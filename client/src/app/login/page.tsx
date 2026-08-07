/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const auth = useContext(AuthContext) as any;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Login failed");
      }

      // Log the user in via AuthContext
      if (auth?.login) {
        auth.login(data.token, data.user);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // SMART REDIRECT BASED ON ROLE
      if (data.user?.role === "supplier") {
        router.push("/supplier/dashboard");
      } else {
        router.push("/buyer/dashboard");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex items-center justify-center font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100 p-6">
      
      {/* Background Glows (Matching Register Page) */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#0B1120]/80 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-8 shadow-2xl z-10">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-cyan-50 tracking-tighter mb-2">
            <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
              <svg className="w-5 h-5 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </Link>
          <p className="text-indigo-300/80 text-sm font-medium">Welcome back. Log in to your account.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div>
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">Password</label>
              <span className="text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer transition-colors font-medium">Forgot?</span>
            </div>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full text-cyan-50 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 bg-linear-to-r from-cyan-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          >
            {isLoading ? (
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-cyan-50 border-t-transparent rounded-full animate-spin"></div>
                 Authenticating...
               </div>
            ) : "Secure Login"}
          </button>
        </form>

        <p className="text-center text-sm text-indigo-300/60 mt-6 font-medium">
          Don&apos;t have an account? <Link href="/register" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}