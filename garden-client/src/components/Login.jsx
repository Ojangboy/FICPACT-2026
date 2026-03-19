import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    // Pastikan bg-pink dan min-h-screen bekerja
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDE2E4] p-4 font-sans">
      
      {/* Container Putih Utama */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[40px] shadow-xl overflow-hidden min-h-137.5">
        
        {/* SISI KIRI: Ilustrasi Gambar */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1501004318641-729e8e26bd05?auto=format&fit=crop&w=800&q=80" 
            alt="Garden" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Efek lengkungan pemisah */}
          <div className="absolute top-0 right-0 h-full w-16 bg-white rounded-l-[100px] -mr-1"></div>
        </div>

        {/* SISI KANAN: Form Login */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-10">Login</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Field Username */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">Username</label>
                <input
                  type="text"
                  placeholder="Input username"
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Field Password */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="Input password"
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="text-right">
                  <button type="button" className="text-xs italic text-gray-500 hover:text-pink-600">
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Tombol Login Oranye */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-4 bg-[#FFB300] hover:bg-[#FFA000] text-black font-extrabold rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Footer Form */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-600">
                Don't have any account? <br />
                <Link to="/register" className="text-purple-600 font-bold hover:underline">
                  Register Now
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;