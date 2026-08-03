"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to register"); 
      
      if (authContext) {
        authContext.login(data.user, data.token);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 selection:bg-indigo-500 selection:text-white relative overflow-hidden px-4">
      
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[4rem_4rem]">
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Frosted Glass Card */}
      <div className="bg-white/3 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md relative z-10">
        
        <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight">Join ThreadMarket</h2>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl text-sm mb-6 border border-red-500/20 font-medium backdrop-blur-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-slate-500"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-slate-500"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full p-4 bg-slate-900/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-white placeholder-slate-500"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
          </div>
          
          <div>
            <select 
              className="w-full p-4 bg-slate-900 border border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-white appearance-none"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              value={formData.role}
            >
              <option value="buyer">I am a Buyer</option>
              <option value="supplier">I am a Supplier</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-slate-950 p-4 rounded-xl font-bold hover:bg-slate-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4"
          >
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account? <Link href="/login" className="text-white font-semibold hover:text-indigo-300 transition">Sign In</Link>
        </p>
      </div>
    </div>
  );
}