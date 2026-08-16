# Lumi Test Guide

Run the backend and frontend from the README, then open http://127.0.0.1:5173.

## Quick judge-ready test

1. Open **Garden** and select a mood. Confirm it stays selected rather than changing with mouse movement.
2. Select **Start Focus Session**. Confirm Fern and Lumi roam in the garden.
3. Open **Bloom**. Press **Water & celebrate this moment** a few times. Confirm the health bar and plant growth only move forward.
4. Open **Companion** and add a task in **My gentle task list**.
5. Edit it with the pencil, complete it with ✓, or delete it with the bin icon.
6. Select **Talk with Lumi** and send: `Could you add prepare the final demo to my task list?`
7. Confirm Lumi replies that it added the task and the visible list updates immediately.
8. Send `hello`, `how are you?`, and `I'm tired` to verify conversational replies and a breathing suggestion.

## Backend checks

Visit http://127.0.0.1:5001/health. It should return `Lumi is awake and ready!`.

In PowerShell, test activity and status:

```powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:5001/activity' -Method Post
Invoke-RestMethod -Uri 'http://127.0.0.1:5001/status'
```

The response should show `status` as `working` and an increasing `todayFocusMs` while the tab is active.

Test chat task creation:

```powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:5001/chat' -Method Post `
  -ContentType 'application/json' `
  -Body '{"message":"Could you add practice the pitch to my task list?"}'
```

Test task editing:

```powershell
Invoke-RestMethod -Uri 'http://127.0.0.1:5001/tasks/1' -Method Put `
  -ContentType 'application/json' `
  -Body '{"task":"Practice the final pitch"}'
```

## Expected behaviour

| Feature | Expected result |
| --- | --- |
| Mood selector | Changes only when the user clicks a mood |
| Focus session | Fern and Lumi roam while it is active |
| Bloom page | Watering increases plant health by 20% and never reduces it |
| Task list | Add, edit, complete, and delete actions work |
| Lumi task command | Adds the requested task and confirms it in chat |
| Tired message | Suggests a breathing exercise |
| 50-minute focus period | Shows a break reminder |

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Frontend does not open | Run `npm run dev -- --host 127.0.0.1` inside `Lumi-frontend`. |
| Chat cannot connect | Start `app.py`, then check `/health`. |
| Plant looks unchanged | Water it a few times; each action advances growth by 20%. |
| Task list does not update | Refresh the page once and check the Flask API is running. |
| Gemini does not answer | Add `GOOGLE_API_KEY` to `.env`; local fallback still supports the demo. |
