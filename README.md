# Lumi — AI Wellness Companion

Lumi helps students and remote workers build sustainable focus habits. Lumi provides warm, context-aware support while Fern and the wellness garden make healthy breaks feel rewarding.

## What it does

- Tracks active browser focus time and prompts a break after 50 minutes.
- Lets users choose their mood manually; it never changes unexpectedly from mouse movement.
- Gives supportive Lumi chat responses based on focus time and pending tasks.
- Understands natural task requests in chat, such as “Could you add prepare the slides to my task list?”
- Provides a task list where users can add, edit, complete, and delete tasks.
- Includes a dedicated **Bloom** page. Watering steadily grows the plant; it does not regress.
- Lets Lumi and Fern roam the garden during an active focus session.
- Uses Gemini 2.5 Flash when a key is configured, with a reliable local fallback for demos.

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, Flask, Flask-CORS |
| AI | Google Gemini 2.5 Flash / local contextual fallback |
| Visuals | Custom Lumi, Fern, cottage garden, and plant assets |

## Project layout

```text
app.py                         Flask API and wellness logic
requirements.txt               Python dependencies
Lumi-frontend/                 React application
TESTING.md                     Manual test checklist
```

## Run locally

Requirements: Python 3.10+ and Node.js 18+.

Install Python packages:

```powershell
cd "D:\Areeba\CS hackathon wellness"
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Start the API:

```powershell
cd "D:\Areeba\CS hackathon wellness"
.\.venv\Scripts\python.exe app.py
```

Start the frontend in another terminal:

```powershell
cd "D:\Areeba\CS hackathon wellness\Lumi-frontend"
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:5173. Check the backend at http://127.0.0.1:5001/health.

## Chat examples

| Say to Lumi | Result |
| --- | --- |
| `hello` | A friendly greeting |
| `how are you?` | Lumi responds conversationally |
| `I'm tired` | A breathing exercise suggestion |
| `Could you add prepare the slides to my task list?` | Adds a task immediately |
| `show my tasks` | Lists pending tasks |

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/health` | API status and enabled features |
| `GET` | `/status` | Focus time, break status, and break count |
| `POST` | `/activity` | Records active browser use |
| `POST` | `/break` | Records a break and resets break timing |
| `POST`, `GET` | `/tasks` | Adds or lists tasks |
| `PUT` | `/tasks/:id` | Edits a task |
| `POST` | `/tasks/:id/complete` | Completes a task |
| `DELETE` | `/tasks/:id` | Deletes a task |
| `POST` | `/chat` | Sends a message to Lumi |
| `POST` | `/check-in` | Requests a proactive wellness check-in |

## Gemini setup (optional)

Create a `.env` file beside `app.py`:

```env
GOOGLE_API_KEY=your_google_ai_studio_key
```

Without a key, Lumi keeps working with its local wellness fallback. Do not commit `.env` or API keys.

See [TESTING.md](TESTING.md) for the complete test checklist.
