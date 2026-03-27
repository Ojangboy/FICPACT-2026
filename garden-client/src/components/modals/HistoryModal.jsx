import React, { useState, useEffect } from 'react';
import { X, History, CheckCircle2 } from 'lucide-react';
import { tasksApi } from '../../api/api';

const HistoryModal = ({ isOpen, onClose }) => {
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const res = await tasksApi.getTasks('completed');
          if (res.data) setHistoryTasks(res.data);
        } catch (err) {
          console.error("Failed to fetch history:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else {
      setHistoryTasks([]); // clear on close
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-2xl rounded-[2.5rem] p-8 shadow-2xl border border-white relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="mb-6 shrink-0 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <History size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-emerald-950 mb-1">Habit History</h2>
            <p className="text-emerald-800/80 font-medium">Your legacy of completed habits.</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4" style={{ scrollbarWidth: 'thin' }}>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <span className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
            </div>
          ) : historyTasks.length > 0 ? (
            historyTasks.map(task => (
              <div
                key={task.id}
                className="w-full p-5 rounded-3xl border border-emerald-100 bg-white/60 shadow-sm flex items-center gap-4 opacity-80"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex flex-col flex-1 truncate">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-lg text-emerald-950 line-through decoration-emerald-300 decoration-2 truncate opacity-80">{task.title || task.name}</span>
                    {task.completed_at && (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full whitespace-nowrap">
                        {new Date(task.completed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-emerald-800/60 font-medium truncate">{task.description || 'Completed habit!'}</span>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-200 text-slate-500">
                       {task.difficulty?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-12 bg-white/50 rounded-3xl border border-dashed border-emerald-200 text-emerald-600 font-medium h-48 flex items-center justify-center text-lg">
              No completed tasks yet. Grow your garden!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
