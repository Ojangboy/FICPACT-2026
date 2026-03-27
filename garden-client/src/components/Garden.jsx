import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, User, Sprout, TreeDeciduous, Flower2, Timer, Plus, Edit2, Trash2, History, Zap, Droplet } from 'lucide-react';
import { tasksApi, pomodoroApi, userApi, authApi } from '../api/api';

import AddTaskModal from './modals/AddTaskModal';
import UpdateTaskModal from './modals/UpdateTaskModal';
import DeleteTaskModal from './modals/DeleteTaskModal';
import HistoryModal from './modals/HistoryModal';
import SettingsModal from './modals/SettingsModal';

// --- IMPORT ASSET LOGO ---
import flowerIcon from '../assets/logo-2.png'; 
import textLogo from '../assets/logo-tulisan.png'; 

// --- IMPORT ASSET BACKGROUND ---
import gardenBg from '../assets/gambar-login-regist.jpeg'; 
import groundBg from '../assets/tanah.png'; 

const GardenDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [currentLevel, setCurrentLevel] = useState(1); 
  const [streak, setStreak] = useState(0); 
  const [tasks, setTasks] = useState([]);
  const [pomodoro, setPomodoro] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [totalExp, setTotalExp] = useState(0);
  const [expRequired, setExpRequired] = useState(150);
  const [gardenHp, setGardenHp] = useState(100);
  const [isPomodoroLoading, setIsPomodoroLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Settings & Profile Profile Menu
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPendingTasks = async () => {
    try {
      const tasksRes = await tasksApi.getTasks('active');
      if (tasksRes.data) setTasks(tasksRes.data);
    } catch (err) { console.error("Failed to fetch tasks:", err); }
  };

  const calculateTimeLeft = (session) => {
    if (!session) return;
    
    const now = new Date();
    
    if (session.status === 'cooldown') {
      const cdTime = new Date(session.cooldown_until);
      const remaining = Math.floor((cdTime - now) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      const referenceTime = new Date(session.created_at);
      const elapsedSecs = Math.floor((now - referenceTime) / 1000);
      const totalSecs = 25 * 60;
      const remaining = totalSecs - elapsedSecs;
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
  };

  const syncUserFromBackend = async () => {
    try {
      const userRes = await userApi.getProfile();
      let userData = userRes.data || userRes;
      if (userData && userData.user) userData = userData.user;

      setUser(userData);

      if (userData && userData.streak_count !== undefined) {
        setStreak(Number(userData.streak_count));
        setCurrentLevel(Number(userData.level) || 1);
        setMultiplier(Number(userData.multiplier) || 1);
        
        if (userData.total_exp !== undefined) setTotalExp(Number(userData.total_exp));
        if (userData.exp_required !== undefined) setExpRequired(Number(userData.exp_required));
        
        if (userData.garden) {
          setGardenHp(Number(userData.garden.hp));
        }
      }
    } catch (err) { console.error("Failed to sync user:", err); }
  };

  useEffect(() => {
    let intervalId;

    const fetchAll = async () => {
      // Fetch each resource independently so one failure (like 404 from Pomodoro) doesn't block the rest
      await syncUserFromBackend();
      await fetchPendingTasks();

      try {
        const pomRes = await pomodoroApi.getStatus();
        if (pomRes.data && pomRes.data.status) {
          setPomodoro(pomRes.data);
          calculateTimeLeft(pomRes.data);
        }
      } catch (err) { console.error("Failed to fetch pomodoro status:", err); }
      finally { setIsPomodoroLoading(false); }
    };
    fetchAll();
  }, []);

  // Timer Effect that handles countdown and automatic transitions
  useEffect(() => {
    let intervalId;

    if (pomodoro && (pomodoro.status === 'active' || pomodoro.status === 'cooldown')) {
      intervalId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            if (pomodoro.status === 'active') {
              handleFinishPomodoro();
            } else if (pomodoro.status === 'cooldown') {
              setPomodoro(null);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pomodoro]);

  const handleStartPomodoro = async () => {
    try {
      const res = await pomodoroApi.start();
      setPomodoro(res.data);
      if (res.data) calculateTimeLeft(res.data);
    } catch (err) {
      if (err.status === 409 || err.status === 429) {
        setPomodoro(err.data.data);
        if (err.data.data) calculateTimeLeft(err.data.data);
      } else {
        console.error(err);
      }
    }
  };

  const handleFinishPomodoro = async () => {
    try {
      const res = await pomodoroApi.finish();
      const newSession = res.data.session || null;
      setPomodoro(newSession);
      
      await syncUserFromBackend();
      if (newSession) calculateTimeLeft(newSession);
      else setTimeLeft(0);
    } catch (err) {
      console.error(err);
      if (err.status === 422) {
        alert(err.data?.message || "Session not finished yet.");
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await tasksApi.completeTask(taskId);
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      
      // Sync strictly with backend after completing task to get actual XP/Level
      await syncUserFromBackend();

    } catch (error) {
      console.error("Failed to complete task:", error);
    }
  };

  const getGrowthData = (level) => {
    if (level >= 1 && level <= 14) {
      return {
        stage: "Seed Stage",
        description: "A seed has been planted. Your habits are starting to take root!",
        icon: <div className="text-8xl animate-bounce">🌱</div>,
        progressColor: "bg-amber-500"
      };
    } else if (level >= 15 && level <= 34) {
      return {
        stage: "Sprout Stage",
        description: "Your garden is showing its first strong growth! Keep it up.",
        icon: <Sprout size={160} className="text-emerald-500 animate-pulse" />,
        progressColor: "bg-emerald-500"
      };
    } else if (level >= 35) {
      return {
        stage: "Tree Stage",
        description: "A majestic tree stands tall. Your habits are now deeply rooted!",
        icon: <TreeDeciduous size={200} className="text-green-700" />,
        progressColor: "bg-green-700"
      };
    }
    return {
      stage: "Getting Ready",
      description: "Complete your first habit to plant a seed!",
      icon: <Flower2 size={100} className="text-slate-300" />,
      progressColor: "bg-slate-400"
    };
  };

  const growth = getGrowthData(currentLevel);

  return (
    <div className="h-screen w-full overflow-y-auto md:overflow-hidden font-sans flex flex-col bg-[#FDE2E4]">
      
      {/* 1. NAVIGATION BAR (FIXED HEIGHT AT TOP) */}
      <nav className="flex-none h-16 md:h-20 z-50 flex items-center justify-between px-4 md:px-6 bg-white/40 backdrop-blur-md border-b border-white/50 shadow-sm relative">
        <div className="flex items-center gap-2">
          <img src={flowerIcon} alt="Icon" className="h-10 w-auto rounded-full shadow-sm" />
          <img src={textLogo} alt="Garden of Habits" className="h-7 w-auto drop-shadow-md hidden sm:block" />
        </div>
        
        <div className="flex items-center gap-2">
          {/* Combined Stats Pill */}
          <div className="flex flex-col md:flex-row items-center bg-white/90 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl md:rounded-full shadow-lg border border-emerald-100 gap-1 md:gap-4 overflow-hidden">
            
            {/* Level & XP Section */}
            <div className="flex items-center gap-2 md:border-r md:border-emerald-100 md:pr-4">
              <span className="text-xs md:text-sm text-emerald-700 font-extrabold whitespace-nowrap">LVL {currentLevel}</span>
              <div className="w-16 md:w-20 h-1.5 md:h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner" title={`${totalExp} / ${expRequired} XP`}>
                  <div 
                    className={`h-full ${growth.progressColor} transition-all duration-700 ease-out`} 
                    style={{ width: `${Math.min(100, Math.max(0, (totalExp / Math.max(1, expRequired)) * 100))}%` }}
                  ></div>
              </div>
            </div>

            {/* Streak & Multiplier Section */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-600">
                <Flame size={14} className={streak > 0 ? "fill-orange-500" : ""} />
                <span className="text-[10px] md:text-xs font-black">{streak} Streak</span>
              </div>
              {multiplier > 1 && (
                <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 shadow-sm">
                  <Zap size={10} className="fill-purple-500" />
                  <span className="text-[10px] font-black">{multiplier}x</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative" ref={profileMenuRef}>
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-10 h-10 bg-white rounded-full shadow-xl hover:scale-105 transition flex items-center justify-center overflow-hidden border-2 border-emerald-100 cursor-pointer"
            >
              {user?.profile_picture ? (
                <img src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000/${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} className="text-slate-600" />
              )}
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-emerald-100 py-3 px-2 flex flex-col gap-1 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); navigate("/dashboard"); }}
                  className="w-full text-left px-4 py-2 font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => { setIsProfileMenuOpen(false); setIsSettingsModalOpen(true); }}
                  className="w-full text-left px-4 py-2 font-bold text-emerald-900 hover:bg-emerald-50 rounded-xl transition"
                >
                  Settings
                </button>
                <div className="h-px bg-emerald-100/60 my-1 mx-2"></div>
                <button 
                  onClick={async () => {
                    setIsProfileMenuOpen(false);
                    try {
                      await authApi.logout();
                    } catch (err) {
                      console.error("Logout failed:", err);
                    } finally {
                      localStorage.removeItem("access_token");
                      localStorage.removeItem("refresh_token");
                      navigate("/login");
                    }
                  }}
                  className="w-full text-left px-4 py-2 font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center justify-between"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 2. SPLIT SCREEN CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row md:overflow-hidden relative">
        
        {/* LEFT PANEL: GARDEN BACKGROUND (50%) */}
        {/* LEFT PANEL: on mobile = compact garden banner at top; on desktop = 50% side */}
        <div className="w-full md:w-1/2 h-[420px] md:h-full relative flex-none md:flex-1 overflow-hidden border-b md:border-b-0 md:border-r border-white/40 z-10">
           {/* Background Images */}
           <div className="absolute inset-0 z-0 flex flex-col">
             <img src={gardenBg} alt="Garden View" className="w-full h-[75%] object-cover object-bottom" />
             <div 
               className="w-full h-[25%] bg-repeat"
               style={{ 
                 backgroundImage: `url(${groundBg})`,
                 backgroundSize: 'contain',
                 backgroundColor: '#8b4513'
               }}
             />
             {/* Gradient blur between garden and ground */}
             <div className="absolute left-0 right-0 h-24 pointer-events-none" style={{ top: 'calc(75% - 48px)', background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(90,50,20,0.55) 100%)' }}></div>
             <div className="absolute inset-0 bg-black/10"></div>
           </div>

           {/* Plant Stage label - hidden on mobile to save space, visible on desktop */}
           <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-sm">
              <div className="bg-white/40 p-6 rounded-[2rem] backdrop-blur-md border border-white/50 shadow-2xl text-center transition-all hover:bg-white/50">

                <h2 className="text-3xl font-black text-emerald-950 mb-2 drop-shadow-sm">{growth.stage}</h2>
                <div className="mx-auto w-3/4 bg-black/10 h-2 rounded-full overflow-hidden border border-white/20 mb-2">
                   <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${gardenHp}%` }}></div>
                </div>
                <div className="text-[10px] font-black text-emerald-900 mb-3 uppercase tracking-widest opacity-80">HP {gardenHp}/100</div>
                <p className="text-emerald-950 font-bold leading-snug">{growth.description}</p>
              </div>
           </div>

           {/* Mobile: stage name overlay at bottom of banner */}
           <div className="md:hidden absolute bottom-2 left-4 z-20">
             <span className="bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-emerald-950 text-xs shadow-md border border-white/50 flex items-center gap-2">
               {growth.stage} — {gardenHp}% <Droplet size={14} className="text-cyan-600 fill-cyan-400" />
             </span>
           </div>

           {/* Plant Character/Icon */}
           <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-[50px] animate-pulse"></div>
              <div className="relative z-10 transition-all duration-1000 transform hover:scale-110 drop-shadow-2xl scale-75 md:scale-100">
                {growth.icon}
              </div>
           </div>
        </div>

        {/* RIGHT PANEL: DASHBOARD (50%) */}
        <div className="w-full md:w-1/2 md:h-full bg-[#FDE2E4] relative flex flex-col p-4 lg:p-8 overflow-y-auto md:overflow-hidden">
           {/* Decorative lines */}
           <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(90deg, #D14D72 50%, transparent 50%)', backgroundSize: '40px 100%' }}></div>
           
           <div className="relative z-10 flex flex-col md:h-full max-w-2xl mx-auto w-full gap-4 pb-8 md:pb-0">
              
              {/* POMODORO SESSION */}
              <div className="flex-none flex flex-col sm:flex-row justify-between items-center bg-white/60 p-5 lg:p-6 rounded-[2rem] backdrop-blur-xl border border-white/60 shadow-xl gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center shadow-inner shrink-0">
                    <Timer className="text-orange-500" size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-emerald-950">Pomodoro</h3>
                    <p className="text-emerald-800 font-bold text-sm">
                      {pomodoro?.status === 'active' ? 'Focus time!' 
                       : pomodoro?.status === 'cooldown' ? 'Cooldown break.' 
                       : 'Ready to start?'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-black text-emerald-900 font-mono tracking-widest">
                    {formatTime(timeLeft)}
                  </div>
                  
                  {!pomodoro ? (
                    <button 
                      onClick={handleStartPomodoro}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-6 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                      START
                    </button>
                  ) : pomodoro.status === 'active' ? (
                    <button 
                      disabled
                      className="bg-slate-800 text-white font-black py-3 px-5 rounded-2xl shadow-md cursor-not-allowed opacity-90 flex items-center gap-2"
                    >
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                      FOCUSING
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="bg-slate-400 text-white font-black py-3 px-5 rounded-2xl shadow-md cursor-not-allowed opacity-90 flex items-center gap-2"
                    >
                      <Timer size={16} className="opacity-70" />
                      COOLDOWN
                    </button>
                  )}
                </div>
              </div>

              {/* 4 ACTION BUTTONS */}
              <div className="flex-none grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-white/70 hover:bg-emerald-100 text-emerald-900 font-black py-3 px-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Plus size={20} className="mb-1" /> Add
                </button>
                <button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="bg-white/70 hover:bg-emerald-100 text-emerald-900 font-black py-3 px-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Edit2 size={20} className="mb-1" /> Update
                </button>
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="bg-white/70 hover:bg-red-100 text-red-700 font-black py-3 px-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <Trash2 size={20} className="mb-1" /> Delete
                </button>
                <button 
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="bg-white/70 hover:bg-emerald-100 text-emerald-900 font-black py-3 px-2 rounded-2xl shadow-sm border border-white/50 flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                >
                  <History size={20} className="mb-1" /> History
                </button>
              </div>

              {/* ACTIVE TASKS HEADER */}
              <div className="flex-none flex justify-between items-center bg-white/50 p-4 lg:p-5 rounded-3xl backdrop-blur-xl border border-white/40 shadow-sm mt-2">
                <div>
                    <h3 className="text-xl font-black text-emerald-950">Active Tasks</h3>
                    <p className="text-emerald-900/80 font-bold text-xs">Target today to achieve</p>
                </div>
                <span className="text-emerald-900 font-black bg-white/80 px-4 py-2 rounded-full text-xs lg:text-sm shadow-sm border border-emerald-100">
                  + {10 * multiplier} ~ {40 * multiplier} XP
                </span>
              </div>

              {/* TASKS LIST */}
              <div className="flex-1 bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[inset_0_2px_15px_rgba(0,0,0,0.03)] rounded-[2.5rem] p-4 lg:p-6 overflow-hidden flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 gap-4" style={{ scrollbarWidth: 'thin' }}>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <div key={task.id} className="group bg-white/90 p-5 rounded-[1.5rem] flex flex-col justify-between hover:bg-emerald-50 transition-all shadow-md hover:shadow-xl border border-emerald-50 hover:border-emerald-200 duration-300">
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-3">
                             <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-wider ${
                               task.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 
                               task.difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 
                               'bg-emerald-100 text-emerald-700'
                             }`}>
                               {task.difficulty ? task.difficulty.toUpperCase() : 'EASY'}
                             </span>
                             {task.deadline && (
                               <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                 {new Date(task.deadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                               </span>
                             )}
                          </div>
                          <h4 className="font-black text-lg text-emerald-950 leading-tight mb-1">
                            {task.title || task.name || 'Untitled Task'}
                          </h4>
                          <p className="text-sm font-bold text-emerald-800/60 line-clamp-2">
                            {task.description || 'No description provided.'}
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => handleCompleteTask(task.id)}
                          className="mt-auto w-full py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all font-black border border-emerald-100 hover:border-emerald-500 text-sm"
                        >
                          <span className="text-lg leading-none">✓</span> COMPLETE TASK
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-1 text-center text-emerald-800 p-10 bg-white/50 rounded-[2rem] border border-white/60 font-black h-full flex items-center justify-center flex-col">
                      <Flower2 size={40} className="mb-3 opacity-50 text-emerald-600" />
                      No active tasks. Take a rest or plant a new seed!
                    </div>
                  )}
                </div>
              </div>
           </div>
        </div>

      </div>

      {/* --- MODALS --- */}
      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          setIsAddModalOpen(false);
          fetchPendingTasks();
        }} 
      />
      
      <UpdateTaskModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        initialTasks={tasks}
        onSuccess={() => {
          setIsUpdateModalOpen(false);
          fetchPendingTasks();
        }} 
      />

      <DeleteTaskModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        initialTasks={tasks}
        onSuccess={fetchPendingTasks} 
      />

      <HistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
      />

      <SettingsModal 
        isOpen={isSettingsModalOpen}
        user={user}
        onClose={() => setIsSettingsModalOpen(false)}
        onSuccess={syncUserFromBackend}
      />

    </div>
  );
};

export default GardenDashboard;