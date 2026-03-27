import React, { useState } from 'react';
import { Flame, User, Sprout, TreeDeciduous, Flower2 } from 'lucide-react';

// --- IMPORT ASSET LOGO ---
import flowerIcon from '../assets/logo-2.png'; 
import textLogo from '../assets/logo-tulisan.png'; 

// --- IMPORT ASSET BACKGROUND ---
import gardenBg from '../assets/gambar-login-regist.jpeg'; 
import groundBg from '../assets/tanah.png'; 

const GardenDashboard = () => {
  const [currentLevel, setCurrentLevel] = useState(1); 
  const [streak, setStreak] = useState(0); 

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
    <div className="min-h-screen font-sans relative flex flex-col">
      
      {/* 1. LAYER BACKGROUND YANG MENYAMBUNG (Bukan Menimpa) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="flex flex-col min-h-screen w-full">
          {/* Gambar Taman: Tampil di atas sesuai ukuran aslinya */}
          <img 
            src={gardenBg} 
            alt="Garden View" 
            className="w-full object-cover" 
          />
          {/* Gambar Tanah: Menyambung tepat di bawah gambar taman */}
          <div 
            className="w-full flex-grow bg-repeat"
            style={{ 
              backgroundImage: `url(${groundBg})`,
              backgroundSize: 'contain',
              backgroundColor: '#8b4513' // Warna tanah cadangan
            }}
          />
        </div>
      </div>

    {/* 2. NAVIGATION BAR  */}
<nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-white/20 backdrop-blur-md border-b border-white/30 shadow-[0_4px_30px_rgba(255,255,255,0.1)]">
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
    <button className="p-2 bg-white rounded-full shadow-xl hover:scale-105 transition">
      <User size={20} className="text-slate-600" />
    </button>
  </div>
</nav>

      {/* 3. MAIN CONTENT (Mengikuti aliran scroll) */}
      <div className="relative z-10 flex flex-col w-full">
        
        {/* Section Atas (Di atas gambar taman) */}
        <main className="pt-28 pb-12 px-6 flex flex-col items-center justify-center min-h-[65vh]">
          <div className="text-center max-w-2xl bg-white/30 p-6 rounded-3xl backdrop-blur-md border border-white/20 mb-10">
            <h2 className="text-4xl font-black text-emerald-950 mb-2 drop-shadow-sm">{growth.stage}</h2>
            <p className="text-lg text-emerald-900/90 font-medium">{growth.description}</p>
          </div>

          <div className="relative w-full max-w-sm flex items-center justify-center">
            {/* Animasi Cahaya */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative z-10 transition-all duration-1000 transform hover:scale-110">
              {growth.icon}
            </div>
          </div>
        </main>

        {/* Section Bawah (Di atas gambar tanah) - TANPA BAYANGAN PUTIH */}
        <section className="p-8 md:p-12 min-h-[35vh]">
          <div className="max-w-5xl mx-auto">
            {/* Header Rituals tetap pakai sedikit BG agar teks terbaca di atas tanah cokelat */}
            <div className="flex justify-between items-center mb-10 bg-white/60 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
              <div>
                  <h3 className="text-2xl font-bold text-emerald-950">Daily Rituals</h3>
                  <p className="text-emerald-800 font-medium text-sm">Grow your focus, one habit at a time</p>
              </div>
              <span className="text-emerald-900 font-black bg-white/80 px-4 py-2 rounded-full text-sm shadow-inner border border-emerald-100">
                +{currentLevel} XP
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Drink Water 2L', 'Meditate 10min', 'Read 1 Chapter'].map((habit, i) => (
                <div key={i} className="group bg-white p-6 rounded-[2.5rem] flex items-center justify-between hover:bg-emerald-50 transition-all shadow-2xl border border-white/40">
                  <span className="font-bold text-lg text-emerald-950">{habit}</span>
                  <button 
                    onClick={() => {
                      setCurrentLevel(prev => prev + 1);
                      if (currentLevel % 3 === 0) setStreak(prev => prev + 1);
                    }}
                    className="w-14 h-14 rounded-3xl bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 shadow-lg active:scale-90 transition-all text-2xl font-bold"
                  >
                    ✓
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default GardenDashboard;