import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'; 

const Onboarding = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // 3 detik loading

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-[#FDE2E4]">
      {/* Pola Garis Vertikal (Overlay) */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(to right, #FFB1B1 1px, transparent 1px)',
          backgroundSize: '8.33% 100%' // Membuat 12 kolom sesuai grid di gambar
        }}
      ></div>

      {/* Konten Utama */}
      <div className="relative z-10 text-center">
        <div className="flex flex-col items-center">
          {/* Ikon Bunga dan Rumput */}
          <div className="text-8xl mb-4">
            {/* Menggunakan Emoji sebagai representasi ikon di gambar */}
            <div className="relative inline-block">
              <span className="block leading-none">🌼</span>
              <div className="bg-[#8CAB45] h-6 w-20 rounded-t-full -mt-2.5 mx-auto"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-[#4A4A4A] mt-4">Garden App</h1>
          <p className="text-gray-500 animate-pulse">Memuat...</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;