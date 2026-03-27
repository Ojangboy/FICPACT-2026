import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { tasksApi } from '../../api/api';

const UpdateTaskModal = ({ isOpen, onClose, onSuccess, initialTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  // When tasks update globally, sync them here
  const activeTasks = initialTasks || [];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTask(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setTitle(task.title || task.name || '');
    setDescription(task.description || '');
    setDifficulty(task.difficulty || 'easy');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !selectedTask) return;
    
    setLoading(true);
    try {
      await tasksApi.updateTask(selectedTask.id, {
        title: title.trim(),
        description: description.trim(),
        difficulty
      });
      onSuccess();
      setSelectedTask(null);
    } catch (err) {
      console.error("Failed to update task", err);
      alert(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white relative animate-in zoom-in-95 duration-200 h-[600px] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {!selectedTask ? (
          <>
            <h2 className="text-3xl font-black text-emerald-950 mb-2">Update Task</h2>
            <p className="text-emerald-800/80 font-medium mb-6">Select a habit to modify</p>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ scrollbarWidth: 'thin' }}>
              {activeTasks.length > 0 ? activeTasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => handleSelectTask(task)}
                  className="w-full text-left p-4 rounded-2xl border border-emerald-100 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm active:scale-95 flex flex-col"
                >
                  <div className="flex justify-between items-center w-full mb-1">
                    <span className="font-bold text-lg text-emerald-950 line-clamp-1">{task.title || task.name}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                       task.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 
                       task.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 
                       'bg-emerald-100 text-emerald-700'
                     }`}>
                       {task.difficulty?.toUpperCase()}
                     </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Click to edit details</span>
                </button>
              )) : (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 font-medium">
                  No active tasks to update.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <button 
                onClick={() => setSelectedTask(null)}
                className="p-2 -ml-2 rounded-full hover:bg-emerald-50 text-emerald-600 transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div>
                <h2 className="text-3xl font-black text-emerald-950">Edit Detail</h2>
                <p className="text-emerald-800/80 font-medium text-sm">Modifying your task parameters</p>
              </div>
            </div>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-5 flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Task Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-emerald-950"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-emerald-950 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Difficulty</label>
                <div className="grid grid-cols-3 gap-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-3 rounded-2xl font-bold uppercase text-xs tracking-wider transition-all border ${
                        difficulty === level 
                          ? level === 'hard' ? 'bg-red-500 text-white border-red-600 shadow-md' :
                            level === 'medium' ? 'bg-amber-500 text-white border-amber-600 shadow-md' :
                            'bg-emerald-500 text-white border-emerald-600 shadow-md'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <button 
                  type="submit" 
                  disabled={loading || !title.trim()}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                >
                  {loading ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateTaskModal;
