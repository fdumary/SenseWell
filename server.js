const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.use(cors());
// the notepad — everything the app remembers
let state = {
  status: "idle",
  sessions: [],
  breaks: []
};

// if we saved a notepad earlier, load it back
if (fs.existsSync("data.json")) {
  state = JSON.parse(fs.readFileSync("data.json", "utf8"));
}

const BREAK_AFTER_MS = 10 * 1000; // 10 sec for testing but change to 50 * 60 * 1000 before submitting

// writes the notepad to a file so it survives restarts
function save() {
  fs.writeFileSync("data.json", JSON.stringify(state));
}

app.get("/hello", (req, res) => {
  res.json({ message: "backend is alive" });
});

app.get("/status", (req, res) => {
  let total = 0;
  for (const s of state.sessions) {
    total = total + s.duration;
  }

  let currentMs = 0;
  if (state.status === "working") {
    currentMs = Date.now() - state.startedAt;
  }

  res.json({
    ...state,
    todayFocusMs: total,
    currentMs: currentMs,
    breakDue: currentMs >= BREAK_AFTER_MS,
  });
});

app.post("/start", (req, res) => {
  state.status = "working";
  state.startedAt = Date.now();
  save();
  res.json(state);
});

app.post("/pause", (req, res) => {
  state.status = "paused";
  const elapsed = Date.now() - state.startedAt;
  state.sessions.push({
    start: state.startedAt,
    end: Date.now(),
    duration: elapsed,
  });
  save();
  res.json(state);
});

app.post("/break", (req, res) => {
  state.status = "break";
  state.breaks.push({ start: Date.now() });
  save();
  res.json(state);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});