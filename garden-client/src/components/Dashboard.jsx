import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaMapMarkerAlt, FaFacebook, 
  FaInstagram, FaWhatsapp, FaUser, FaSignOutAlt 
} from 'react-icons/fa';
import { userApi, authApi } from '../api/api';
import SettingsModal from './modals/SettingsModal';

// Import Aset
import habitLogo from '../assets/gambar-hero-section.jpeg'; 
import imgStep1 from '../assets/gambar-card-1.jpeg'; 
import imgStep2 from '../assets/gambar-card-2.jpeg';
import imgStep3 from '../assets/gambar-card-3.jpeg';
import imgTimer from '../assets/gambar-card-1.jpeg'; 
import imgGoal from '../assets/gambar-card-1.jpeg';
import imgDash from '../assets/gambar-card-1.jpeg';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const syncUserFromBackend = async () => {
    try {
      const userRes = await userApi.getProfile();
      let userData = userRes.data || userRes;
      if (userData && userData.user) userData = userData.user;
      setUser(userData);
    } catch (err) {
      console.error("Failed to sync user:", err);
    }
  };

  useEffect(() => {
    syncUserFromBackend();
  }, []);
  // 1. Logic Scroll untuk Navbar Sticky
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    }
  };

  // 2. Fungsi Scroll ke Section dengan Offset
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Ukuran tinggi navbar agar konten tidak tertutup
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false); // Tutup menu setelah klik
    }
  };

  const handleSubmitWhatsApp = () => {
    if (!contactMessage.trim()) {
      window.alert('Silakan isi pesan terlebih dahulu.');
      return;
    }
    const phone = '6285947271670';
    const text = `Email: ${contactEmail || '-'}%0A%0AMessage: ${contactMessage}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const steps = [
    { id: 1, image: imgStep1, title: 'Set Your Goals', description: 'Input your daily tasks or habits to plant your digital seeds.' },
    { id: 2, image: imgStep2, title: 'Focus & Nurture', description: 'Use the Focus Timer to "water" your plants and complete your work.' },
    { id: 3, image: imgStep3, title: 'See The impact', description: 'Watch your garden bloom as you build consistency and reach your goals.' }
  ];

  const features = [
    { id: 1, image: imgTimer, title: 'Smart Focus', highlight: 'Timer', description: 'Water your garden automatically with every work cycle.' },
    { id: 2, image: imgGoal, title: 'Visual', highlight: 'Goal', description: 'Watch your habits grow from seed to bloom on a personalized map.' },
    { id: 3, image: imgDash, title: 'Dynamic', highlight: 'Dashboard', description: 'Manage all your tasks in one intuitive interface with a visual garden overview.' }
  ];

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-white overflow-x-hidden">
      
      {/* --- STICKY NAVBAR --- */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
        <nav className={`flex items-center justify-between px-8 py-3 mx-auto max-w-5xl rounded-full border transition-all duration-300 pointer-events-auto ${
          isScrolled 
            ? 'border-gray-200 bg-white/95 shadow-xl py-2 scale-95' 
            : 'border-white/20 bg-white/10 backdrop-blur-md shadow-lg'
        }`}>
          <div className="text-xl font-bold flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className={isScrolled ? 'text-green-900' : 'text-white'}>Garden</span>
            <span className="text-pink-500 ml-1">of Habits</span>
          </div>
          
          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center space-x-10 font-bold text-sm ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
            <button onClick={() => scrollToSection('home')} className="hover:text-pink-500 transition">Home</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-pink-500 transition">How it Works</button>
            <button onClick={() => scrollToSection('key-features')} className="hover:text-pink-500 transition">Key Features</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-pink-500 transition">Contact</button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSettingsModalOpen(true)} 
              className={`w-10 h-10 rounded-full transition-all flex items-center justify-center overflow-hidden border-2 ${isScrolled ? 'bg-green-100 text-green-800 border-green-200 shadow-md' : 'bg-white/20 text-white border-white/30'} hover:scale-105`}
            >
              {user?.profile_picture ? (
                <img 
                  src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000/${user.profile_picture}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser size={18} />
              )}
            </button>

            {user && (
              <button 
                onClick={handleLogout}
                title="Logout"
                className={`hidden md:flex w-10 h-10 rounded-full transition-all items-center justify-center border-2 ${isScrolled ? 'bg-red-50 text-red-600 border-red-100 shadow-md' : 'bg-red-500/20 text-white border-red-500/30'} hover:bg-red-600 hover:text-white hover:scale-105`}
              >
                <FaSignOutAlt size={18} />
              </button>
            )}
            
            {/* Mobile Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1">
              <div className="w-6 h-5 flex flex-col justify-between items-center">
                <span className={`block w-6 h-0.5 transition-all ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`block w-6 h-0.5 transition-all ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-6 h-0.5 transition-all ${isScrolled ? 'bg-gray-800' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 py-6 px-8 pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col space-y-2">
              <button onClick={() => scrollToSection('home')} className="text-left font-bold text-lg text-gray-800 py-3 border-b border-gray-50">Home</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left font-bold text-lg text-gray-800 py-3 border-b border-gray-50">How it Works</button>
              <button onClick={() => scrollToSection('key-features')} className="text-left font-bold text-lg text-gray-800 py-3 border-b border-gray-50">Key Features</button>
              <button onClick={() => scrollToSection('contact')} className="text-left font-bold text-lg text-gray-800 py-3">Contact</button>
              <button onClick={() => navigate('/Garden')} className="mt-4 w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg">Open My Garden</button>
              {user && (
                <button onClick={handleLogout} className="mt-2 w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl border border-red-100 flex items-center justify-center gap-2">
                  <FaSignOutAlt size={18} /> Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- HERO SECTION --- */}
      <section id="home" className="relative h-[700px] w-full flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img src={habitLogo} alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">Habits In Bloom.</h1>
          <p className="text-xl md:text-2xl text-white font-bold mb-10 drop-shadow-lg">Turn Your Tasks into a Flourishing Digital Paradise.</p>
          <button onClick={() => navigate('/Garden')} className="bg-[#B3529E] hover:bg-[#8e417e] text-white px-10 py-4 rounded-full font-black text-xl transition-all shadow-2xl active:scale-95">Start Growing Now</button>
        </div>
        {/* Wave Divider */}
        <div className="absolute bottom-0 w-full fill-white">
          <svg viewBox="0 0 1440 120" className="w-full h-auto"><path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,58.7C960,43,1056,21,1152,21.3C1248,21,1344,43,1392,53.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path></svg>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-16">Grow Your <span className="text-[#B3529E]">Focus</span>, Build Habits.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CardStat value="12.4K+" title="Habits Bloomed" />
            <CardStat value="8.9K+" title="Focus Hours" />
            <CardStat value="3.2K+" title="Trees Grown" />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Orange) --- */}
      <section id="how-it-works" className="py-28 bg-[#FFB300] px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/3">
            <h2 className="text-6xl font-black text-gray-950 mb-6">How It Works?</h2>
            <p className="text-xl font-bold text-gray-800 italic">Watch your garden thrive in 3 simple steps.</p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.id} className="bg-white p-8 rounded-[40px] shadow-2xl hover:-translate-y-2 transition-transform duration-300">
                <div className="h-40 rounded-3xl overflow-hidden mb-6 shadow-md"><img src={step.image} className="w-full h-full object-cover" alt="" /></div>
                <h3 className="text-xl font-black mb-2">{step.title}</h3>
                <p className="text-sm font-bold text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FEATURES (Pink) --- */}
      <section id="key-features" className="py-28 bg-[#FDE2E4] px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-20">Key <span className="text-[#D14D72]">Features</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.id} className="bg-white/60 backdrop-blur-md p-10 rounded-[50px] shadow-xl border border-white">
                <div className="h-40 rounded-3xl overflow-hidden mb-6 shadow-md"><img src={f.image} className="w-full h-full object-cover" alt="" /></div>
                <h3 className="text-2xl font-black mb-4">{f.title} <span className="bg-[#B3529E] text-white px-3 py-1 rounded-xl text-sm">{f.highlight}</span></h3>
                <p className="text-gray-700 font-bold">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER & CONTACT --- */}
      <footer id="contact" className="bg-[#E9E9F0] pt-28">
        <div className="max-w-7xl mx-auto px-6 pb-20 flex flex-col md:flex-row justify-between gap-16">
          <div className="md:w-1/3">
            <h2 className="text-5xl font-black mb-6">Get In Touch!</h2>
            <div className="space-y-4 font-bold text-lg">
              <div className="flex items-center gap-4"><FaEnvelope className="text-pink-600" /> hello@gardenofhabits.com</div>
              <div className="flex items-center gap-4"><FaMapMarkerAlt className="text-pink-600" /> Unsika, Karawang</div>
            </div>
          </div>
          <div className="md:w-1/2">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitWhatsApp(); }} className="space-y-4">
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Your Email" className="w-full px-8 py-5 rounded-full bg-white/50 border focus:ring-4 focus:ring-pink-200 font-bold" />
              <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} placeholder="Your Message..." rows="4" className="w-full px-8 py-5 rounded-[40px] bg-white/50 border focus:ring-4 focus:ring-pink-200 font-bold resize-none"></textarea>
              <button type="submit" className="w-full py-5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black text-xl rounded-full shadow-2xl transition-all">Send WhatsApp Message</button>
            </form>
          </div>
        </div>
        <div className="bg-[#5E8D7A] py-8 text-center"><p className="text-white text-3xl font-black italic tracking-widest">Let's Grow Together.</p></div>
      </footer>
      <SettingsModal 
        isOpen={isSettingsModalOpen} 
        onClose={() => setIsSettingsModalOpen(false)} 
        user={user} 
        onSuccess={syncUserFromBackend}
      />
    </div>
  );
};

const CardStat = ({ value, title }) => (
  <div className="bg-[#E9E9F0] p-10 rounded-[40px] hover:shadow-xl transition-all">
    <div className="text-6xl font-black text-[#3D735F] mb-4">{value}</div>
    <h3 className="font-bold text-xl uppercase text-gray-800">{title}</h3>
  </div>
);

export default Dashboard;