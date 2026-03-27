import React, { useState } from 'react';
import { X } from 'lucide-react';
import { tasksApi } from '../../api/api';

const AddTaskModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    try {
      await tasksApi.createTask({
        title: title.trim(),
        description: description.trim(),
        difficulty
      });
      setTitle('');
      setDescription('');
      setDifficulty('easy');
      onSuccess();
    } catch (err) {
      console.error("Failed to create task", err);
      alert(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border border-white relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-3xl font-black text-emerald-950 mb-2">Plant a Seed</h2>
        <p className="text-emerald-800/80 font-medium mb-8">What habit do you want to grow today?</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">Task Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Read 10 pages"
              className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-emerald-950 placeholder:text-slate-400"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-emerald-900 mb-2">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any specific details?"
              rows="3"
              className="w-full bg-white px-5 py-4 rounded-2xl border border-emerald-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-emerald-950 placeholder:text-slate-400 resize-none"
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
          
          <button 
            type="submit" 
            disabled={loading || !title.trim()}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-2xl shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
          >
            {loading ? 'PLANTING...' : 'CREATE TASK'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
