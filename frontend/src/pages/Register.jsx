import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'user', status: 'active'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return setError("Passwords mismatch");
    console.log("Submit:", formData);
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

      {/* Form Section - Focused & Scaled Down */}
      <div className="flex w-full items-center justify-center lg:w-3/4 px-6 bg-white">
        <div className="w-full max-w-sm scale-95 origin-center"> {/* scale-95 helps fit smaller screens */}
          <header className="mb-6">
            <h2 className="text-3xl font-bold tracking-tighter text-black uppercase">Register Account</h2>
            {error && <p className="text-[10px] font-bold text-red-600 uppercase mt-1">!! {error}</p>}
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Name</label>
              <input name="name" type="text" required onChange={handleChange} className="w-full border-2 border-black p-2 text-sm font-semibold focus:outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
              <input name="email" type="email" required onChange={handleChange} className="w-full border-2 border-black p-2 text-sm font-semibold focus:outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                <div className="relative">
                  <input name="password" type={showPassword ? "text" : "password"} required onChange={handleChange} className="w-full border-2 border-black p-2 pr-8 text-sm font-semibold focus:outline-none" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Confirm Password</label>
                <input name="confirmPassword" type="password" required onChange={handleChange} className="w-full border-2 border-black p-2 text-sm font-semibold focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</label>
                <select name="role" onChange={handleChange} className="w-full border-2 border-black bg-white p-2 text-xs font-black uppercase focus:outline-none">
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="w-1/2 space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</label>
                <select name="status" onChange={handleChange} className="w-full border-2 border-black bg-white p-2 text-xs font-black uppercase focus:outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button type="submit" className="w-full bg-black py-3 text-xs font-black tracking-[0.2em] text-white hover:bg-gray-800 uppercase">
              Register Entity
            </button>
          </form>

          <footer className="mt-6 flex flex-col gap-2 border-t border-gray-100 pt-4">
            <button onClick={() => navigate('/login')} className="text-[10px] font-bold uppercase text-black hover:underline">
              Already Registered? Login
            </button>
            <div className="flex items-center gap-2 text-[8px] font-mono uppercase text-gray-400">
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Register;