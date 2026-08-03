"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to login"); 
      
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
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Frosted Glass Card */}
      <div className="bg-white/3 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md relative z-10">
        
        {/* Logo Mark */}
        <div className="w-12 h-12 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-6">
          <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl text-sm mb-6 border border-red-500/20 font-medium backdrop-blur-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
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
          
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-2"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-400">
          New here? <Link href="/register" className="text-indigo-400 font-semibold hover:text-indigo-300 transition">Create an account</Link>
        </p>
      </div>
    </div>
  );
}