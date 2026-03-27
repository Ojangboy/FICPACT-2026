import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, User, Sprout, TreeDeciduous, Flower2, Loader2, LogOut } from 'lucide-react';
import { gardenApi, tasksApi, authApi, userApi } from '../api/api';
// --- IMPORT ASSET ---
import flowerIcon from '../assets/logo-2.png'; 
import textLogo from '../assets/logo-tulisan.png'; 
import gardenBg from '../assets/gambar-login-regist.jpeg'; 
import groundBg from '../assets/tanah.png'; 

const GardenDashboard = () => {
  // State untuk data API
  const [currentLevel, setCurrentLevel] = useState(1); 
  const [streak, setStreak] = useState(0); 
  const [tasks, setTasks] = useState([]);
  const [profilePicture, setProfilePicture] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // 1. Fungsi untuk mengambil semua data (Garden & Tasks)
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('No access token found, redirecting to login');
        navigate('/login');
        return;
      }
      
      const [gardenData, tasksData, userData] = await Promise.all([
        gardenApi.getGarden(), // Ambil data level/streak
        tasksApi.getTasks('pending'), // Ambil task yang belum selesai
        userApi.getProfile(), // Ambil data profile pengguna
      ]);

      // Sesuaikan key property (misal: gardenData.level) dengan respons API Laravel kamu
      setCurrentLevel(gardenData.level || 1);
      setStreak(gardenData.streak || 0);
      setTasks(tasksData || []);
      setProfilePicture(userData.profile_picture || '');
      setUsername(userData.username || 'User');
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      // Set default values if API fails
      setCurrentLevel(1);
      setStreak(0);
      setTasks([]);
      setProfilePicture('');
      setUsername('User');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data ketika window mendapat focus (user kembali dari Settings)
  useEffect(() => {
    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleSettings = () => {
    setShowDropdown(false);
    navigate('/settings');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log('Logout error:', error);
    }
    localStorage.removeItem('access_token');
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.profile-container')) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // 2. Fungsi untuk menyelesaikan Task
  const handleCompleteTask = async (id) => {
    try {
      await tasksApi.completeTask(id); // Hit API PATCH
      
      // Refresh data agar level dan streak terupdate otomatis dari backend
      fetchData(); 
    } catch (error) {
      alert("Gagal menyelesaikan tugas. Coba lagi!");
      console.error(error);
    }
  };

  const getGrowthData = (level) => {
    if (level >= 1 && level <= 14) {
      return { stage: "Seed Stage", description: "A seed has been planted. Your habits are starting to take root!", icon: <div className="text-8xl animate-bounce">🌱</div>, progressColor: "bg-amber-500" };
    } else if (level >= 15 && level <= 34) {
      return { stage: "Sprout Stage", description: "Your garden is showing its first strong growth! Keep it up.", icon: <Sprout size={160} className="text-emerald-500 animate-pulse" />, progressColor: "bg-emerald-500" };
    } else if (level >= 35) {
      return { stage: "Tree Stage", description: "A majestic tree stands tall. Your habits are now deeply rooted!", icon: <TreeDeciduous size={200} className="text-green-700" />, progressColor: "bg-green-700" };
    }
    return { stage: "Getting Ready", description: "Complete your first habit to plant a seed!", icon: <Flower2 size={100} className="text-slate-300" />, progressColor: "bg-slate-400" };
  };

  const growth = getGrowthData(currentLevel);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative flex flex-col">
      {/* 1. LAYER BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="flex flex-col min-h-screen w-full">
          <img src={gardenBg} alt="Garden View" className="w-full object-cover" />
          <div className="w-full flex-grow bg-repeat" style={{ backgroundImage: `url(${groundBg})`, backgroundSize: 'contain', backgroundColor: '#8b4513' }} />
        </div>
      </div>

      {/* 2. NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm">
        <div className="flex items-center gap-2">
          <img src={flowerIcon} alt="Icon" className="h-10 w-auto rounded-full shadow-sm" />
          <img src={textLogo} alt="Garden of Habits" className="h-7 w-auto drop-shadow-md" />
        </div>
        
        <div className="flex items-center gap-6 font-bold">
          <div className="hidden md:flex items-center gap-1 text-orange-600 bg-white/40 px-3 py-1 rounded-full shadow-inner">
            <Flame size={20} />
            <span>{streak} Streak</span>
          </div>
          <div className="flex items-center gap-3 bg-white/90 px-4 py-1.5 rounded-full shadow-lg border border-emerald-100">
            <span className="text-sm text-emerald-700 font-black">LVL {currentLevel}</span>
            <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${growth.progressColor} transition-all duration-500`} 
                  style={{ width: `${((currentLevel - 1) % 35) * 3}%` }}
                ></div>
            </div>
          </div>
          <div className="profile-container relative">
            <div className="flex items-center gap-3 bg-white/90 px-4 py-1.5 rounded-full shadow-lg border border-emerald-100">
              <button 
                className="p-1 bg-white rounded-full shadow-xl hover:scale-105 transition"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'none';
                    }}
                  />
                ) : null}
                <User size={20} className="text-slate-600" style={{ display: profilePicture ? 'none' : 'block' }} />
              </button>
              <span className="text-sm text-emerald-700 font-black">{username}</span>
            </div>
            {showDropdown && (
              <div className="profile-dropdown absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/50 py-1 z-50">
                <button
                  onClick={handleSettings}
                  className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-slate-700 font-medium rounded-t-xl flex items-center gap-2 transition-all"
                >
                  <User size={16} />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 font-medium rounded-b-xl flex items-center gap-2 transition-all"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex flex-col w-full">
        {/* 3. MAIN CONTENT (TANAMAN) */}
        <main className="pt-28 pb-12 px-6 flex flex-col items-center justify-center min-h-[65vh]">
          <div className="text-center max-w-2xl bg-white/30 p-6 rounded-3xl backdrop-blur-md border border-white/20 mb-10">
            <h2 className="text-4xl font-black text-emerald-950 mb-2 drop-shadow-sm">{growth.stage}</h2>
            <p className="text-lg text-emerald-900/90 font-medium">{growth.description}</p>
          </div>

          <div className="relative w-full max-w-sm flex items-center justify-center">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 transition-all duration-1000 transform hover:scale-110">
              {growth.icon}
            </div>
          </div>
        </main>

        {/* 4. GROUND SECTION (DYNAMIC TASKS) */}
        <section className="p-8 md:p-12 min-h-[35vh]">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-10 bg-white/60 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
              <div>
                  <h3 className="text-2xl font-bold text-emerald-950">Daily Rituals</h3>
                  <p className="text-emerald-800 font-medium text-sm">You have {tasks.length} tasks pending</p>
              </div>
              <span className="text-emerald-900 font-black bg-white/80 px-4 py-2 rounded-full text-sm border border-emerald-100">
                Lvl: {currentLevel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <div key={task.id} className="group bg-white p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-emerald-50 transition-all shadow-2xl border border-white/40">
                    <span className="font-bold text-lg text-emerald-950">{task.title}</span>
                    <button 
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 shadow-lg active:scale-90 transition-all text-2xl font-bold"
                    >
                      ✓
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white/40 rounded-3xl backdrop-blur-sm border border-white/20">
                  <p className="text-emerald-900 font-bold">All habits bloomed for today! 🌸</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GardenDashboard;
