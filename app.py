"""Lumi local backend: chat, tasks, check-ins, and focus tracking."""

import json
import os
import re
import threading
import time

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    f"gemini-2.5-flash:generateContent?key={GOOGLE_API_KEY}"
    if GOOGLE_API_KEY else None
)
ACTIVE_WINDOW_SECONDS = 45
BREAK_INTERVAL_MS = 50 * 60 * 1000

state_lock = threading.Lock()
tasks = []
next_task_id = 1
timer = {
    "focus_ms": 0,
    "focus_since_break_ms": 0,
    "last_activity": None,
    "last_tick": None,
    "breaks": [],
    "status": "away",
}

SYSTEM_PROMPT = """You are Lumi, a warm, concise wellness companion for students and remote workers.
Use the supplied focus time, tasks, and message to give a supportive response in 2–3 sentences.
Suggest a break after 50 minutes, a short breathing exercise if the user is stressed or tired,
and gentle water and posture reminders. Never give medical advice.
If there is self-harm, severe distress, or crisis, reply only: "I'm really sorry you're feeling this way. Please reach out to someone you trust or a crisis helpline. In the US, call/text 988. You're not alone."
Return JSON only, exactly: {"reply":"message","suggestedAction":"none"}.
Allowed suggestedAction values: none, take_break, breathing_exercise, stretch, drink_water, check_posture."""


def update_timer(now=None):
    """Add elapsed focus time only while the tab has recently been active."""
    now = now or time.time()
    with state_lock:
        last_tick = timer["last_tick"]
        last_activity = timer["last_activity"]
        active = bool(last_activity and now - last_activity <= ACTIVE_WINDOW_SECONDS)
        if active and last_tick:
            elapsed_ms = max(0, int((now - last_tick) * 1000))
            timer["focus_ms"] += elapsed_ms
            timer["focus_since_break_ms"] += elapsed_ms
        timer["last_tick"] = now
        timer["status"] = "working" if active else "away"


def timer_payload():
    update_timer()
    with state_lock:
        return {
            "status": timer["status"],
            "todayFocusMs": timer["focus_ms"],
            "focusSinceBreakMs": timer["focus_since_break_ms"],
            "breakDue": timer["focus_since_break_ms"] >= BREAK_INTERVAL_MS,
            "breaks": list(timer["breaks"]),
        }


def pending_task_names():
    with state_lock:
        return [task["task"] for task in tasks if not task["completed"]]


def fallback_reply(message, focus_minutes, break_due, pending):
    lower = message.lower()
    if any(word in lower for word in ("self harm", "suicide", "kill myself", "end my life")):
        return {"reply": "I'm really sorry you're feeling this way. Please reach out to someone you trust or a crisis helpline. In the US, call/text 988. You're not alone.", "suggestedAction": "none"}
    if re.fullmatch(r"\s*(hello|hi|hey|hello lumi|hi lumi|hey lumi)[!. ]*", lower):
        return {"reply": "Hi! I’m doing well, and I’m happy you’re here. How are you feeling — ready to focus, or do you need a gentle reset? 🌿", "suggestedAction": "none"}
    if "how are you" in lower:
        return {"reply": "I’m feeling bright and ready to support you! I can help you focus, take a breath, or keep your tasks organised. How are you doing? ✨", "suggestedAction": "none"}
    if break_due or focus_minutes >= 50:
        return {"reply": f"You've focused for {focus_minutes} minutes — that is real progress. Take a small break: stand up, sip water, and let your eyes rest for a minute. 🌿", "suggestedAction": "take_break"}
    if any(word in lower for word in ("tired", "stress", "stressed", "exhaust", "overwhelm")):
        return {"reply": "That sounds heavy. Try one minute with me: breathe in for 4, hold for 4, and out for 4 — then take the next tiny step. 💛", "suggestedAction": "breathing_exercise"}
    if any(word in lower for word in ("motivated", "great", "good", "excited")):
        return {"reply": "I love that energy! Keep your pace kind and steady — you are doing wonderfully. ✨", "suggestedAction": "none"}
    if pending:
        return {"reply": f"You have {len(pending)} task{'s' if len(pending) != 1 else ''} waiting, including “{pending[0]}”. What is one small next step you can finish now?", "suggestedAction": "none"}
    return {"reply": "I’m here with you. Have a sip of water, relax your shoulders, and tell me how your focus session feels. 💧", "suggestedAction": "check_posture"}


def task_intent(message):
    """Recognise simple, natural task commands before asking the AI model."""
    text = message.strip()
    lower = text.lower()
    add_match = re.match(r"(?:can you |could you |please )*(?:add|create|remember|put)\s+(?:a )?(?:task\s*(?:called|named)?\s*)?(.+?)(?:\s+(?:to|into|on)\s+(?:my )?(?:task|to-do)(?: list)?)?[.!?]*$", text, re.I)
    if add_match and ("task" in lower or "list" in lower or re.match(r"(?:can you |could you |please )*(?:add|create|remember|put)\b", lower)):
        task_text = add_match.group(1).strip(" .")
        if task_text and task_text.lower() not in {"this", "that", "it"}:
            return "add", task_text
    if any(phrase in lower for phrase in ("show my tasks", "show tasks", "list my tasks", "what are my tasks", "my task list")):
        return "list", None
    return None, None


def ask_lumi(message, focus_minutes, break_due, pending, check_in=False):
    if not GEMINI_URL:
        return fallback_reply(message, focus_minutes, break_due, pending)
    context = {
        "focusTimeMinutes": focus_minutes, "breakDue": break_due,
        "pendingTasks": pending, "isProactiveCheckIn": check_in, "userMessage": message,
    }
    try:
        response = requests.post(
            GEMINI_URL,
            json={"contents": [{"parts": [{"text": f"{SYSTEM_PROMPT}\n\nContext: {json.dumps(context)}"}]}]},
            timeout=12,
        )
        response.raise_for_status()
        text = response.json()["candidates"][0]["content"]["parts"][0]["text"]
        result = json.loads(text.replace("```json", "").replace("```", "").strip())
        if isinstance(result.get("reply"), str):
            return {"reply": result["reply"], "suggestedAction": result.get("suggestedAction", "none")}
    except (requests.RequestException, KeyError, IndexError, TypeError, ValueError, json.JSONDecodeError):
        pass
    return fallback_reply(message, focus_minutes, break_due, pending)


@app.get("/health")
def health():
    return jsonify({"status": "Lumi is awake and ready! ✨", "ai": "gemini-2.5-flash" if GEMINI_URL else "local wellness fallback", "features": ["focus-timer", "breaks", "tasks", "chat", "check-ins", "garden-actions"]})


@app.get("/status")
def status():
    return jsonify(timer_payload())


@app.post("/activity")
def activity():
    update_timer()
    now = time.time()
    with state_lock:
        timer["last_activity"] = now
        timer["last_tick"] = now
        timer["status"] = "working"
    return jsonify({"ok": True, **timer_payload()})


@app.post("/break")
def take_break():
    update_timer()
    with state_lock:
        timer["breaks"].append({"timestamp": int(time.time() * 1000), "durationMs": 0})
        timer["focus_since_break_ms"] = 0
        timer["status"] = "break"
    return jsonify({"ok": True, **timer_payload()})


@app.route("/tasks", methods=["GET", "POST"])
def handle_tasks():
    global next_task_id
    if request.method == "GET":
        with state_lock:
            pending = [task for task in tasks if not task["completed"]]
        return jsonify({"tasks": pending, "count": len(pending)})
    data = request.get_json(silent=True) or {}
    task_text = str(data.get("task", "")).strip()
    if not task_text:
        return jsonify({"error": "Task cannot be empty"}), 400
    with state_lock:
        task = {"id": next_task_id, "task": task_text, "completed": False, "created_at": int(time.time())}
        tasks.append(task)
        next_task_id += 1
    return jsonify({"message": "Task added! 💪", "task": task}), 201


@app.put("/tasks/<int:task_id>")
def edit_task(task_id):
    data = request.get_json(silent=True) or {}
    task_text = str(data.get("task", "")).strip()
    if not task_text:
        return jsonify({"error": "Task cannot be empty"}), 400
    with state_lock:
        for task in tasks:
            if task["id"] == task_id:
                task["task"] = task_text
                return jsonify({"message": "Task updated", "task": task})
    return jsonify({"error": "Task not found"}), 404


@app.post("/tasks/<int:task_id>/complete")
def complete_task(task_id):
    with state_lock:
        for task in tasks:
            if task["id"] == task_id:
                task["completed"] = True
                return jsonify({"message": "Great job completing your task! 🎉", "task": task})
    return jsonify({"error": "Task not found"}), 404


@app.delete("/tasks/<int:task_id>")
def delete_task(task_id):
    global tasks
    with state_lock:
        before = len(tasks)
        tasks = [task for task in tasks if task["id"] != task_id]
    if len(tasks) == before:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task deleted"})


@app.post("/chat")
def chat():
    data = request.get_json(silent=True) or {}
    message = str(data.get("message", ""))
    intent, task_text = task_intent(message)
    if intent == "add":
        global next_task_id
        with state_lock:
            task = {"id": next_task_id, "task": task_text, "completed": False, "created_at": int(time.time())}
            tasks.append(task)
            next_task_id += 1
        return jsonify({"reply": f"Done — I added “{task_text}” to your task list. You’ve got this! 💪", "suggestedAction": "none", "task": task, "pendingTasks": len(pending_task_names())})
    if intent == "list":
        pending = pending_task_names()
        reply = "Your task list is clear right now." if not pending else "Your pending tasks: " + "; ".join(pending) + "."
        return jsonify({"reply": reply, "suggestedAction": "none", "pendingTasks": len(pending)})
    live_timer = timer_payload()
    focus_ms = data.get("todayFocusMs", live_timer["todayFocusMs"])
    focus_minutes = max(0, int(float(focus_ms) / 60000))
    pending = pending_task_names()
    result = ask_lumi(message, focus_minutes, bool(data.get("breakDue", live_timer["breakDue"])), pending)
    return jsonify({**result, "focusTimeMinutes": focus_minutes, "pendingTasks": len(pending)})


@app.post("/check-in")
def check_in():
    data = request.get_json(silent=True) or {}
    live_timer = timer_payload()
    focus_ms = data.get("todayFocusMs", live_timer["todayFocusMs"])
    focus_minutes = max(0, int(float(focus_ms) / 60000))
    pending = pending_task_names()
    result = ask_lumi("Please give a proactive wellness check-in.", focus_minutes, live_timer["breakDue"], pending, check_in=True)
    return jsonify({**result, "focusTimeMinutes": focus_minutes, "pendingTasks": len(pending)})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
