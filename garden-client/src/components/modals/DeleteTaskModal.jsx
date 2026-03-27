import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { tasksApi } from '../../api/api';

const DeleteTaskModal = ({ isOpen, onClose, onSuccess, initialTasks }) => {
  const [loadingId, setLoadingId] = useState(null);

  if (!isOpen) return null;

  const activeTasks = initialTasks || [];

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    
    setLoadingId(taskId);
    try {
      await tasksApi.deleteTask(taskId);
      onSuccess();
    } catch (err) {
      console.error("Failed to delete task", err);
      alert(err.response?.data?.message || "Failed to delete task");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="mb-6 shrink-0">
          <h2 className="text-3xl font-black text-emerald-950 mb-2">Delete Task</h2>
          <p className="text-emerald-800/80 font-medium">Remove habits you no longer want to track.</p>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ scrollbarWidth: 'thin' }}>
          {activeTasks.length > 0 ? activeTasks.map(task => (
            <div
              key={task.id}
              className="w-full p-4 rounded-2xl border border-red-100 bg-white flex items-center justify-between shadow-sm transition-all hover:border-red-300"
            >
              <div className="flex flex-col flex-1 pr-4 truncate">
                <span className="font-bold text-lg text-emerald-950 truncate">{task.title || task.name}</span>
                <span className="text-xs text-slate-400 font-medium truncate">{task.description || 'No description'}</span>
              </div>
              <button 
                onClick={() => handleDelete(task.id)}
                disabled={loadingId === task.id}
                className="w-12 h-12 shrink-0 rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed border border-red-100"
                title="Delete Task"
              >
                {loadingId === task.id ? (
                  <span className="animate-spin w-5 h-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            </div>
          )) : (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 font-medium">
              No active tasks to delete.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
