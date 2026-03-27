import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, FaMapMarkerAlt, FaFacebook, 
  FaInstagram, FaWhatsapp, FaUser 
} from 'react-icons/fa';

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

  // 1. Handle scroll effect untuk Navbar Sticky
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

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      
      {/* --- NAVBAR STICKY (Melayang di atas semua section) --- */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none transition-all duration-300">
        <nav className={`mobile-menu-container pointer-events-auto flex items-center justify-between px-8 py-3 mx-auto max-w-5xl rounded-full border transition-all duration-300 ${
          isScrolled 
            ? 'border-gray-200 bg-white/95 shadow-xl py-2 scale-95' // Efek saat scroll kebawah
            : 'border-white/40 bg-white/30 backdrop-blur-md shadow-lg' // Efek saat di Hero Section
        }`}>
          <div className="text-xl font-bold flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <span className="text-green-900 font-black">Garden</span>
            <span className="text-pink-500 ml-1">of Habits</span>
          </div>
          
          {/* Desktop Menu */}
          <div className={`hidden md:flex items-center space-x-10 font-bold text-sm ${isScrolled ? 'text-green-950' : 'text-white'}`}>
            <button onClick={() => scrollToSection('home')} className="hover:text-pink-600 transition">Home</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-pink-600 transition">How it Works</button>
            <button onClick={() => scrollToSection('key-features')} className="hover:text-pink-600 transition">Key Features</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-pink-600 transition">Contact</button>
          </div>

          {/* User Icon / Navigate to Garden */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/Garden')}
              className={`p-2 rounded-full transition-all ${isScrolled ? 'bg-green-100 text-green-800' : 'bg-white/20 text-white'}`}
            >
              <FaUser size={18} />
            </button>
            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              <div className="w-6 h-6 flex flex-col justify-center items-center gap-1">
                <span className={`block w-5 h-0.5 transition-all ${isScrolled ? 'bg-green-900' : 'bg-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 transition-all ${isScrolled ? 'bg-green-900' : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 transition-all ${isScrolled ? 'bg-green-900' : 'bg-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 py-4 px-6 pointer-events-auto">
            <div className="flex flex-col space-y-4">
              <button onClick={() => { scrollToSection('home'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-green-950 py-2">Home</button>
              <button onClick={() => { scrollToSection('how-it-works'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-green-950 py-2">How it Works</button>
              <button onClick={() => { scrollToSection('key-features'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-green-950 py-2">Key Features</button>
              <button onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} className="text-left font-bold text-green-950 py-2">Contact</button>
            </div>
          </div>
        )}
      </div>

      {/* --- SECTION 1: HERO SECTION --- */}
      <section id="home" className="relative h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${habitLogo})` }}>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-2xl mb-4 tracking-tighter">Habits In Bloom.</h1>
          <p className="text-xl md:text-2xl text-white font-bold max-w-2xl drop-shadow-lg mb-12">Level Up Your Focus in the Ultimate Productivity Playground</p>
          <button onClick={() => navigate('/Garden')} className="bg-[#B3529E] hover:bg-[#8e417e] text-white px-12 py-5 rounded-full font-black text-xl transition shadow-2xl active:scale-95">View Garden</button>
        </div>

        <div className="absolute bottom-[-2px] w-full z-10 fill-white">
          <svg viewBox="0 0 1440 120" className="w-full h-auto"><path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,80C672,85,768,75,864,58.7C960,43,1056,21,1152,21.3C1248,21,1344,43,1392,53.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path></svg>
        </div>
      </section>

      {/* --- SECTION 2: STATS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-black mb-8 leading-tight">Grow Your <span className="text-[#B3529E]">Focus</span>, Build Habits.</h2>
          <p className="text-gray-600 font-bold max-w-2xl mx-auto mb-20 text-lg italic">Turn tasks into a flourishing garden. Master your time.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <CardStat value="12.4K+" title="Habits Bloomed" desc="Tasks completed by our community." />
            <CardStat value="8.9K+" title="Focus Hours" desc="Productive hours spent in the gardens." />
            <CardStat value="3.2K+" title="Trees Grown" desc="Trees fully grown from daily habits." />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: HOW IT WORKS (ORANGE) --- */}
      <section id="how-it-works" className="py-28 bg-[#FFB300] relative overflow-hidden px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="md:w-1/3 text-left">
            <h2 className="text-7xl font-black text-gray-950 mb-6 tracking-tight">How It Works?</h2>
            <p className="text-2xl font-bold text-gray-900/70">Grow your garden in 3 steps.</p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.id} className="bg-white p-8 rounded-[50px] shadow-2xl hover:scale-105 transition duration-500">
                <div className="h-44 rounded-[35px] overflow-hidden mb-6 border-4 border-white shadow-lg">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black mb-3">{step.title}</h3>
                <p className="text-gray-700 font-bold text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: FEATURES (PINK) --- */}
      <section id="key-features" className="py-28 bg-[#FDE2E4] px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-6">Key <span className="text-[#D14D72]">Features</span></h2>
          <p className="text-gray-700 font-bold max-w-2xl mx-auto mb-20">Tools designed for sustained habit growth.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((item) => (
              <div key={item.id} className="bg-white/70 backdrop-blur-md p-10 rounded-[50px] border border-white shadow-xl">
                <div className="h-44 rounded-[30px] overflow-hidden mb-8 border-4 border-white shadow-lg">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-black text-gray-950 mb-4">{item.title} <span className="bg-[#B3529E] text-white px-3 py-1 rounded-xl">{item.highlight}</span></h3>
                <p className="text-gray-700 font-bold text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="contact" className="bg-[#E9E9F0] pt-28">
        <div className="max-w-7xl mx-auto px-6 pb-24 flex flex-col md:flex-row justify-between gap-16">
          <div className="md:w-1/3">
            <h2 className="text-5xl font-black mb-6 tracking-tighter">Get In Touch!</h2>
            <p className="text-gray-600 font-bold text-lg mb-8 leading-relaxed">Have questions or want to collaborate? We'd love to hear from you.</p>
            <div className="space-y-4 font-bold text-lg">
              <div className="flex items-center gap-4 text-gray-800"><FaEnvelope className="text-pink-600" /> hello@gardenofhabits.com</div>
              <div className="flex items-center gap-4 text-gray-800"><FaMapMarkerAlt className="text-pink-600 text-2xl" /> Universitas Singaperbangsa Karawang</div>
            </div>
          </div>
          <div className="md:w-1/2 w-full">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmitWhatsApp(); }}>
              <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Email" className="w-full px-8 py-5 rounded-[2.5rem] bg-pink-50 border border-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-200 font-bold" />
              <textarea placeholder="Message.." rows="4" value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="w-full px-8 py-5 rounded-[2.5rem] bg-pink-50 border border-pink-100 focus:outline-none focus:ring-4 focus:ring-pink-200 font-bold resize-none"></textarea>
              <button type="submit" className="w-full py-5 bg-[#E91E63] hover:bg-[#D81B60] text-white font-black text-xl rounded-[2.5rem] shadow-2xl transition active:scale-95">Send Message</button>
            </form>
          </div>
        </div>
        <div className="bg-[#5E8D7A] py-8 text-center"><p className="text-white text-4xl font-black italic tracking-widest">Let's Grow Together.</p></div>
      </footer>
    </div>
  );
};

const CardStat = ({ value, title, desc }) => (
  <div className="bg-[#E9E9F0] p-12 rounded-[50px] shadow-sm hover:-translate-y-4 transition-all duration-500">
    <div className="text-7xl font-black text-[#3D735F] mb-6 tracking-tighter">{value}</div>
    <h3 className="font-black text-2xl mb-3 text-gray-950 uppercase">{title}</h3>
    <p className="text-gray-600 font-bold italic">{desc}</p>
  </div>
);

export default Dashboard;
