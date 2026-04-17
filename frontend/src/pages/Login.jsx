import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { login } from '../features/auth/authSlice';

const getHomePath = (role) => {
  if (role === 'admin' || role === 'manager') return '/admin/users';
  return '/dashboard';
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate(getHomePath(user.role), { replace: true });
    }
  }, [navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(login(formData)).unwrap();
      const role = response?.user?.role;
      navigate(getHomePath(role), { replace: true });
    } catch (err) {
      setError(typeof err === 'string' ? err : 'Login failed');
    }
  };

  return (
    <div className="flex h-screen bg-white font-sans text-black overflow-hidden">
      

      <div className="hidden w-1/4 flex-col justify-between bg-black p-8 text-white lg:flex relative">
        <div className="z-10">
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            Purple<br />Merit.
          </h1>
          <div className="mt-2 h-1 w-12 bg-white"></div>
        </div>

      </div>

      {/* Form Section */}
      <div className="flex w-full items-center justify-center lg:w-3/4 px-6 bg-white">
        <div className="w-full max-w-sm scale-95 origin-center">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tighter text-black uppercase">User Authorization</h2>
            {error && <p className="text-[10px] font-bold text-red-600 uppercase mt-2">!! {error}</p>}
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <input 
                name="email" 
                type="email" 
                required 
                onChange={handleChange} 
                className="w-full border-2 border-black p-3 text-sm font-semibold focus:outline-none bg-white" 
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
     
              </div>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                  onChange={handleChange} 
                  className="w-full border-2 border-black p-3 pr-10 text-sm font-semibold focus:outline-none bg-white" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              type="submit" 
              className="w-full bg-black py-4 text-xs font-black tracking-[0.3em] text-white hover:bg-gray-800 transition-all uppercase active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Authorizing...' : 'Authorize Session'}
            </button>
          </form>

          <footer className="mt-8 flex flex-col gap-3 border-t border-gray-100 pt-6">
            <button 
              onClick={() => navigate('/register')} 
              className="text-[10px] font-bold uppercase text-black hover:underline text-left"
            >
              No account? Contact Administrator or Register
            </button>
            <div className="flex items-center gap-2 text-[8px] font-mono uppercase text-gray-400 tracking-tighter">
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;