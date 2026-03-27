import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaLeaf, FaSeedling, FaCalendarAlt, FaStar, 
  FaEnvelope, FaMapMarkerAlt, FaFacebook, 
  FaInstagram, FaWhatsapp, FaCheckCircle, 
  FaUser, FaPlus 
} from 'react-icons/fa';

// Pastikan aset gambar ini tersedia di folder src/assets/ kamu
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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Smooth scroll to section
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
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
    {
      id: 1,
      image: imgStep1,
      title: 'Set Your Goals',
      description: 'Input your daily tasks or habits to plant your digital seeds.',
    },
    {
      id: 2,
      image: imgStep2,
      title: 'Focus & Nurture',
      description: 'Use the Focus Timer to "water" your plants and complete your work.',
    },
    {
      id: 3,
      image: imgStep3,
      title: 'See The impact',
      description: 'Watch your garden bloom as you build consistency and reach your goals.',
    }
  ];

  // Data untuk Section Key Features (PINK)
  const features = [
    {
      id: 1,
      image: imgTimer,
      title: 'Smart Focus',
      highlight: 'Timer',
      description: 'Water your garden automatically with every work cycle.'
    },
    {
      id: 2,
      image: imgGoal,
      title: 'Visual',
      highlight: 'Goal',
      description: 'Watch your habits grow from seed to bloom on a personalized map.'
    },
    {
      id: 3,
      image: imgDash,
      title: 'Dynamic',
      highlight: 'Dashboard',
      description: 'Manage all your tasks in one intuitive interface with a visual garden overview.'
    }
  ];

  return (
    <div className={`min-h-screen font-sans text-gray-800 bg-white overflow-x-hidden ${isScrolled ? 'pt-20' : ''}`}>
      
      {/* --- SECTION 1: HERO SECTION --- */}
      <section id="home" className="relative h-[650px] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${habitLogo})` }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Navbar Floating */}
        <div className="mobile-menu-container sticky top-0 z-50 px-4 pt-2">
          <nav className={`flex items-center justify-between px-8 py-3 mx-auto max-w-5xl rounded-full border transition-all duration-300 ${isScrolled ? 'border-gray-200 bg-white/95 shadow-lg' : 'border-white/40 bg-white/30 shadow-lg'}`}>
            <div className="text-xl font-bold flex items-center">
              <span className="text-green-900">Garden</span>
              <span className="text-pink-500 ml-1">of Habits</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10 font-bold text-sm text-green-950">
              <button 
                onClick={() => scrollToSection('home')}
                className="hover:text-pink-600 transition"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="hover:text-pink-600 transition"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('key-features')}
                className="hover:text-pink-600 transition"
              >
                Key Features
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="hover:text-pink-600 transition"
              >
                Contact
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/20 transition"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-green-900 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                <span className={`block w-5 h-0.5 bg-green-900 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block w-5 h-0.5 bg-green-900 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
              </div>
            </button>
          </nav>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 py-4 px-6">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    scrollToSection('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-green-950 hover:text-pink-600 transition py-2"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('how-it-works');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-green-950 hover:text-pink-600 transition py-2"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('key-features');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-green-950 hover:text-pink-600 transition py-2"
                >
                  Key Features
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left font-bold text-green-950 hover:text-pink-600 transition py-2"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 -mt-20">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white drop-shadow-2xl mb-2">
            Habits In Bloom.
          </h1>
          <p className="text-xl md:text-2xl text-white font-bold max-w-2xl drop-shadow-lg mb-10">
            Level Up Your Focus in the Ultimate Productivity Playground
          </p>
          <div className="flex space-x-6">
            <button 
              onClick={() => navigate('/Garden')}
              className="bg-[#B3529E] hover:bg-purple-700 text-white px-10 py-4 rounded-full font-extrabold transition shadow-xl active:scale-95"
            >
              View Garden
            </button>
          </div>
        </div>

        {/* Wavy Cloud Bottom */}
        <div className="absolute bottom-[-2px] w-full z-10">
          <svg viewBox="0 0 1440 120" className="w-full h-auto fill-white">
            <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,58.7C960,43,1056,21,1152,21.3C1248,21,1344,43,1392,53.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* --- SECTION 2: STATS SECTION --- */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-gray-900 leading-tight">
            Grow Your <span className="text-[#B3529E]">Focus</span>, Build Habits.
          </h2>
          <p className="text-gray-700 font-medium max-w-2xl mx-auto mb-16 text-lg">
            Turn tasks into a flourishing garden. Grow your consistency and master your time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <CardStat value="12.450+" title="Total Habits Bloomed" desc="Successful tasks completed by our community." />
            <CardStat value="8.900+" title="Focus Hours Nurtured" desc="Productive hours spent nurturing the digital gardens." />
            <CardStat value="3.200+" title="Trees Fully Grown" desc="Digital trees fully grown from consistent daily habits." />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: HOW IT WORKS (ORANGE) --- */}
      <section id="how-it-works" className="relative py-24 px-6 bg-[#FFB300] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(90deg, #000 50%, transparent 50%)', backgroundSize: '40px 100%' }}></div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/3 text-left">
            <h2 className="text-6xl font-black text-gray-950 mb-4 leading-tight">How It Works?</h2>
            <p className="text-2xl font-bold text-gray-900/80">Grow your garden in 3 ways.</p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="bg-white/95 backdrop-blur-sm p-8 rounded-[45px] shadow-2xl flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-full h-44 rounded-[35px] overflow-hidden mb-6 border-4 border-white shadow-md">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 leading-tight">{step.title}</h3>
                <p className="text-gray-700 font-semibold text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: KEY FEATURES (PINK) --- */}
      <section id="key-features" className="relative py-24 px-6 bg-[#FDE2E4] overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(90deg, #D14D72 50%, transparent 50%)', backgroundSize: '60px 100%' }}></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">
            Key <span className="text-[#D14D72]">Features</span> to Master Your Time
          </h2>
          <p className="text-gray-700 font-bold max-w-2xl mx-auto mb-16">
            Experience productivity like never before with these powerful tools designed for sustained habit growth.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item) => (
              <div key={item.id} className="bg-white/60 backdrop-blur-sm p-10 rounded-[45px] border border-white shadow-xl flex flex-col items-center">
                <div className="h-44 w-full rounded-[30px] overflow-hidden mb-8 border-4 border-white shadow-md">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">
                  {item.title} <span className="bg-[#B3529E] text-white px-3 py-1 rounded-lg ml-1">{item.highlight}</span>
                </h3>
                <p className="text-gray-700 font-semibold text-center leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 5: FOOTER (GET IN TOUCH) --- */}
      <footer id="contact" className="relative bg-[#E9E9F0] pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16">
            
            {/* Info Kontak */}
            <div className="md:w-1/3 space-y-8">
              <div>
                <h2 className="text-4xl font-black text-gray-950 mb-4">Get In Touch!</h2>
                <p className="text-gray-700 font-medium text-lg">
                  Have questions or want to collaborate? We'd love to hear from you.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-800">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <FaEnvelope className="text-purple-600 text-xl" />
                  </div>
                  <span className="font-bold text-lg">hello@gardenofhabits.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-800">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm">
                    <FaMapMarkerAlt className="text-purple-600 text-xl" />
                  </div>
                  <span className="font-bold text-lg leading-tight">
                    Universitas Singaperbangsa Karawang
                  </span>
                </div>
              </div>
            </div>

            {/* Form Kontak */}
            <div className="md:w-1/2 w-full">
              <form className="space-y-4 max-w-lg ml-auto" onSubmit={(e) => { e.preventDefault(); handleSubmitWhatsApp(); }}>
                <input 
                  type="email" 
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email" 
                  className="w-full px-6 py-4 rounded-2xl bg-pink-50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 font-medium shadow-inner"
                />
                <textarea 
                  placeholder="Message.." 
                  rows="4"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-pink-50 border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-pink-300 font-medium shadow-inner resize-none"
                ></textarea>
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black text-xl rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ilustrasi Bukit Bawah */}
        <div className="absolute bottom-0 left-0 w-full h-40 pointer-events-none select-none">
          <div className="absolute bottom-0 left-0 w-[50%] h-[120%] bg-[#3D735F] rounded-tr-[500px] opacity-90"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[90%] bg-[#5E8D7A] rounded-tr-[400px]"></div>
          <div className="absolute bottom-16 left-10 text-6xl opacity-30">🌸</div>
        </div>

        {/* Bar Social Media */}
        <div className="bg-[#5E8D7A] py-6 px-10 relative z-20">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6 text-white text-2xl">
              {/* Social icons removed as requested */}
            </div>
            <p className="text-white text-3xl font-black italic tracking-tight">
              Let's Grow Together.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Komponen Pembantu Stat Cards
const CardStat = ({ value, title, desc }) => (
  <div className="bg-[#E9E9F0] p-12 rounded-[40px] shadow-sm hover:translate-y-[-10px] transition-all duration-300">
    <div className="text-6xl font-black text-[#3D735F] mb-6 leading-none">{value}</div>
    <h3 className="font-extrabold text-xl mb-3 text-gray-900 leading-tight">{title}</h3>
    <p className="text-gray-600 font-medium text-sm leading-relaxed">{desc}</p>
  </div>
);


export default Dashboard;
