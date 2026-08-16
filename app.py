from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("GOOGLE_API_KEY", "YOUR_API_KEY_HERE")
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key={API_KEY}"

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

RESPOND IN THIS EXACT JSON FORMAT:
{"reply":"your message here","suggestedAction":"none"}

suggestedAction can be: none, take_break, breathing_exercise, stretch
"""

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    
    user_message = data.get('message', '')
    focus_time_ms = data.get('todayFocusMs', 0)
    focus_time = int(focus_time_ms / 60000) if focus_time_ms else data.get('focusTimeMinutes', 0)
    status = data.get('status', 'Working')
    break_due = data.get('breakDue', False)
    break_count = len(data.get('breaks', [])) if 'breaks' in data else data.get('breakCount', 0)
    
    if break_due and not user_message:
        user_message = "[SYSTEM: User has been working a long time. Gently suggest a break.]"
    
    user_context = f"""User Context:
- Focus time today: {focus_time} minutes
- Current status: {status}
- Breaks taken today: {break_count}
- Break overdue: {"Yes" if break_due else "No"}
- User says: "{user_message}"
Respond with JSON only:"""
    
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
        result = json.loads(reply_text)
        
        return jsonify({
            "reply": result.get("reply", "I'm here for you! 💙"),
            "suggestedAction": result.get("suggestedAction", "none"),
            "focusTimeMinutes": focus_time,
            "status": status,
            "breakDue": break_due
        })
        
    except Exception as e:
        return jsonify({
            "reply": "Hey, I'm having a little trouble right now, but I'm still here for you! How are you feeling? 💙",
            "suggestedAction": "none",
            "breakDue": break_due,
            "error": str(e)
        })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "Lumi is awake and ready! ✨",
        "model": "gemini-flash-latest",
        "port": 5001
    })

if __name__ == '__main__':
    app.run(debug=True, port=5001)
