import React, { useEffect, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { addTask, completeTask, deleteTask, getTasks, updateTask } from '../../api';

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editing, setEditing] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data.tasks || []);
      setError('');
    } catch {
      setError('Task list is reconnecting…');
    }
  };

  useEffect(() => {
    loadTasks();
    window.addEventListener('sensewell:tasks-updated', loadTasks);
    const id = window.setInterval(loadTasks, 10000);
    return () => {
      window.removeEventListener('sensewell:tasks-updated', loadTasks);
      window.clearInterval(id);
    };
  }, []);

  const add = async () => {
    const text = newTask.trim();
    if (!text) return;
    await addTask(text);
    setNewTask('');
    loadTasks();
  };

  const saveEdit = async (id: number) => {
    const text = editText.trim();
    if (!text) return;
    await updateTask(id, text);
    setEditing(null);
    loadTasks();
  };

  const finish = async (id: number) => {
    await completeTask(id);
    loadTasks();
  };

  const remove = async (id: number) => {
    await deleteTask(id);
    loadTasks();
  };

  return (
    <section className="p-4 rounded-3xl bg-[#3E2B18] border-2 border-[#5C4229] shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-pixel font-bold uppercase tracking-wider text-[#EDE6D6]">My gentle task list</h2>
          <p className="text-[10px] text-[#AFA28C] mt-1">Lumi can also add tasks from chat.</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-[#25331E] text-[#98C992] text-[10px] font-bold">{tasks.length} pending</span>
      </div>

      <div className="flex gap-2">
        <input
          value={newTask}
          onChange={event => setNewTask(event.target.value)}
          onKeyDown={event => event.key === 'Enter' && add()}
          placeholder="Write a task…"
          className="min-w-0 flex-1 px-3 py-2.5 rounded-xl bg-[#2A1C0E] border border-[#5C4229] text-xs text-[#EDE6D6] placeholder-[#8C7A64] focus:outline-none focus:border-[#98C992]"
        />
        <button onClick={add} className="px-3 rounded-xl bg-[#486940] hover:bg-[#3D5C35] text-white transition-colors" title="Add task">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {error && <p className="text-[10px] text-[#F6C177]">{error}</p>}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <p className="rounded-xl bg-[#2A1C0E] px-3 py-3 text-xs text-[#AFA28C]">Your list is clear. Add one tiny next step.</p>
        ) : tasks.map(task => (
          <div key={task.id} className="flex items-center gap-2 rounded-xl bg-[#2A1C0E] border border-[#483420] px-2.5 py-2">
            {editing === task.id ? (
              <input
                autoFocus
                value={editText}
                onChange={event => setEditText(event.target.value)}
                onKeyDown={event => event.key === 'Enter' && saveEdit(task.id)}
                className="min-w-0 flex-1 bg-transparent text-xs text-[#EDE6D6] focus:outline-none"
              />
            ) : <span className="min-w-0 flex-1 text-xs text-[#EDE6D6] break-words">{task.task}</span>}
            {editing === task.id ? <>
              <button onClick={() => saveEdit(task.id)} className="text-[#98C992]" title="Save"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditing(null)} className="text-[#AFA28C]" title="Cancel"><X className="w-4 h-4" /></button>
            </> : <>
              <button onClick={() => finish(task.id)} className="text-[#98C992] hover:text-white" title="Complete"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setEditing(task.id); setEditText(task.task); }} className="text-[#D9C7A4] hover:text-white" title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(task.id)} className="text-[#D98978] hover:text-white" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </>}
          </div>
        ))}
      </div>
    </section>
  );
};
