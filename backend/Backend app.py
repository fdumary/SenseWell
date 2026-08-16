from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import time
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

# ===================== CONFIG =====================
load_dotenv()

API_KEY = "YOUR_API_KEY"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={API_KEY}"

# ===================== TASK STORAGE =====================
tasks = []
task_id_counter = 1

# ===================== SYSTEM PROMPT =====================
SYSTEM_PROMPT = """You are "Lumi", a warm and supportive wellness companion. 
You help people maintain healthy work habits and prevent burnout.

PERSONALITY:
- Warm, friendly, and concise (2-3 sentences max)
- Encouraging but never pushy
- Use gentle emojis occasionally
- Talk like a caring friend, not a robot

RULES:
- If user worked 50+ minutes, gently suggest a break
- If user says stressed/tired, offer a 1-min breathing exercise
- If user says motivated, hype them up briefly
- If user mentions self-harm, severe distress, or crisis: respond ONLY with "I'm really sorry you're feeling this way. Please reach out to someone you trust or a crisis helpline. In the US, call/text 988. You're not alone."
- Never give medical advice
- Never say "As an AI language model"

TASK RULES:
- If user has pending tasks, gently ask if they are making progress
- If user completed a task, celebrate their win enthusiastically
- If user has no tasks, ask if they want to add one
- Help them break big tasks into smaller steps if they seem overwhelmed

WELLNESS REMINDER RULES:
- Every check-in, remind them to drink water and stay hydrated
- Every check-in, remind them to check posture and do a quick shoulder stretch
- Keep reminders gentle, not nagging

RESPOND IN THIS EXACT JSON FORMAT:
{"reply":"your message here","suggestedAction":"none"}

suggestedAction can be: none, take_break, breathing_exercise, stretch, drink_water, check_posture
"""

# ===================== HELPER =====================
def call_lumi(user_context):
    payload = {
        "contents": [{
            "parts": [{"text": f"{SYSTEM_PROMPT}\n\n{user_context}"}]
        }]
    }
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        response.raise_for_status()
        result_data = response.json()
        reply_text = result_data["candidates"][0]["content"]["parts"][0]["text"]
        reply_text = reply_text.replace("```json", "").replace("```", "").strip()
        return json.loads(reply_text)
    except Exception as e:
        return {"reply": "Hey, I'm having a little trouble right now, but I'm still here for you! How are you feeling? 💙", "suggestedAction": "none", "error": str(e)}

# ===================== TASK ROUTES =====================

@app.route('/tasks', methods=['GET', 'POST'])
def handle_tasks():
    global task_id_counter
    if request.method == 'POST':
        data = request.get_json()
        task_text = data.get('task', '').strip()
        if not task_text:
            return jsonify({"error": "Task cannot be empty"}), 400
        task = {
            "id": task_id_counter,
            "task": task_text,
            "completed": False,
            "created_at": int(time.time())
        }
        tasks.append(task)
        task_id_counter += 1
        return jsonify({"message": "Task added! 💪", "task": task})
    else:
        pending = [t for t in tasks if not t['completed']]
        return jsonify({"tasks": pending, "count": len(pending)})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [t for t in tasks if t['id'] != task_id]
    return jsonify({"message": "Task deleted! 🗑️"})

@app.route('/tasks/<int:task_id>/complete', methods=['POST'])
def complete_task(task_id):
    for t in tasks:
        if t['id'] == task_id:
            t['completed'] = True
            return jsonify({
                "message": "Great job completing your task! 🎉 You are crushing it!",
                "task": t
            })
    return jsonify({"error": "Task not found"}), 404

# ===================== CHECK-IN ROUTE =====================

@app.route('/check-in', methods=['POST'])
def check_in():
    """Proactive wellness check-in: tasks, water, posture"""
    data = request.get_json() or {}
    focus_time_ms = data.get('todayFocusMs', 0)
    focus_time = int(focus_time_ms / 60000) if focus_time_ms else 0
    status = data.get('status', 'Working')
    
    pending = [t['task'] for t in tasks if not t['completed']]
    task_context = f"You have {len(pending)} pending tasks: {', '.join(pending)}." if pending else "You have no pending tasks right now."
    
    user_context = f"""User Context:
- Focus time today: {focus_time} minutes
- Current status: {status}
- {task_context}
- This is a proactive 30-minute wellness check-in.
- Remind them to drink water 💧 and check their posture 🧘.
- Ask about their task progress gently.
Respond with JSON only:"""
    
    result = call_lumi(user_context)
    return jsonify({
        "reply": result.get("reply", "How is it going? 💙"),
        "suggestedAction": result.get("suggestedAction", "none"),
        "pendingTasks": len(pending),
        "focusTimeMinutes": focus_time,
        "status": status
    })

# ===================== CHAT ROUTE =====================

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    user_message = data.get('message', '')
    focus_time_ms = data.get('todayFocusMs', 0)
    focus_time = int(focus_time_ms / 60000) if focus_time_ms else data.get('focusTimeMinutes', 0)
    status = data.get('status', 'Working')
    break_due = data.get('breakDue', False)
    break_count = len(data.get('breaks', [])) if 'breaks' in data else data.get('breakCount', 0)
    
    pending = [t['task'] for t in tasks if not t['completed']]
    task_context = f"Pending tasks: {', '.join(pending)}." if pending else "No pending tasks."
    
    if break_due and not user_message:
        user_message = "[SYSTEM: User has been working a long time. Gently suggest a break.]"
    
    user_context = f"""User Context:
- Focus time today: {focus_time} minutes
- Current status: {status}
- Breaks taken today: {break_count}
- Break overdue: {"Yes" if break_due else "No"}
- {task_context}
- User says: "{user_message}"
Respond with JSON only:"""
    
    result = call_lumi(user_context)
    
    return jsonify({
        "reply": result.get("reply", "I'm here for you! 💙"),
        "suggestedAction": result.get("suggestedAction", "none"),
        "focusTimeMinutes": focus_time,
        "status": status,
        "breakDue": break_due,
        "pendingTasks": len(pending)
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "Lumi is awake and ready! ✨",
        "model": "gemini-flash-latest",
        "port": 5001,
        "features": ["chat", "tasks", "check-in", "water-reminder", "posture-reminder"]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
