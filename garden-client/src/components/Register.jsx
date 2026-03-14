import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi proses registrasi
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FDE2E4] p-4 font-sans">
      
      {/* Container Utama */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[40px] shadow-xl overflow-hidden min-h-[600px]">
        
        {/* SISI KIRI: Ilustrasi (Sama dengan Login) */}
        <div className="hidden md:block md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1501004318641-729e8e26bd05?auto=format&fit=crop&w=800&q=80" 
            alt="Garden Illustration" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Efek Lengkungan Pemisah */}
          <div className="absolute top-0 right-0 h-full w-16 bg-white rounded-l-[100px] -mr-1"></div>
        </div>

        {/* SISI KANAN: Form Register */}
        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Register</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field Username */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Username</label>
                <input
                  name="username"
                  type="text"
                  placeholder="Input username"
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Field Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Input password"
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Field Confirm Password */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-600 ml-1">Confirm Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Input password"
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300 transition-all"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Tombol Register Now! */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 mt-6 bg-[#FFB300] hover:bg-[#FFA000] text-black font-extrabold rounded-full shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Register Now!'}
              </button>
            </form>

            {/* Footer Form */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-600">
                Do you have an account? <br />
                <Link to="/login" className="text-[#D14D72] font-bold hover:underline">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;