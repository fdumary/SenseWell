const TIMER_API = 'http://localhost:5000';
const LUMI_API = 'http://127.0.0.1:5001';

export interface TimerBackendData {
  status?: 'working' | 'break' | 'away' | string;
  todayFocusMs?: number;
  breakDue?: boolean;
  breaks?: Array<{ timestamp: number; durationMs: number }> | any[];
}

export interface LumiResponse {
  reply: string;
  suggestedAction?: 'take_break' | 'breathing_exercise' | 'drink_water' | 'check_posture' | string;
  focusTimeMinutes?: number;
}

export interface CheckInResponse {
  reply: string;
  suggestedAction?: string;
}

// 1. Get timer status from Amber's backend
export const getTimerStatus = async (): Promise<TimerBackendData> => {
  const res = await fetch(`${TIMER_API}/status`);
  return res.json(); // {status, todayFocusMs, breakDue, breaks}
};

// 2. Send message to Lumi (YOUR backend)
export const sendToLumi = async (
  userMessage: string,
  timerData?: TimerBackendData | null
): Promise<LumiResponse> => {
  const res = await fetch(`${LUMI_API}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: userMessage,
      todayFocusMs: timerData?.todayFocusMs || 0,
      status: timerData?.status || 'working',
      breakDue: timerData?.breakDue || false,
      breaks: timerData?.breaks || [],
    }),
  });
  return res.json(); // {reply, suggestedAction, focusTimeMinutes}
};

// 3. Proactive check-in (tasks + water + posture)
export const doCheckIn = async (timerData?: TimerBackendData | null): Promise<CheckInResponse> => {
  const res = await fetch(`${LUMI_API}/check-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todayFocusMs: timerData?.todayFocusMs || 0,
      status: timerData?.status || 'working',
    }),
  });
  return res.json(); // {reply, suggestedAction}
};

// 4. Task management
export const addTask = async (taskText: string) => {
  const res = await fetch(`${LUMI_API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: taskText }),
  });
  return res.json();
};

export const getTasks = async () => {
  const res = await fetch(`${LUMI_API}/tasks`);
  return res.json();
};
