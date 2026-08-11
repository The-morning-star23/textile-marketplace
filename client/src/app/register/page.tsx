/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const auth = useContext(AuthContext) as any;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "supplier">("buyer");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      // Log the user in via AuthContext
      if (auth?.login) {
        // FIX: Swapped arguments to match Context (User Object FIRST, Token String SECOND)
        auth.login(data.user, data.token);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // REDIRECT LOGIC BASED ON ROLE
      if (role === "supplier") {
        router.push("/supplier/onboarding");
      } else {
        router.push("/buyer/onboarding");
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex items-center justify-center font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100 p-6">
      
      {/* Background Glows */}
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
          <p className="text-indigo-300/80 text-sm font-medium">Create your account to get started.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          {/* ROLE SELECTOR */}
          <div className="flex bg-indigo-950/40 p-1 rounded-xl border border-indigo-500/30 shadow-inner mb-6">
            <button 
              type="button"
              onClick={() => setRole("buyer")} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'buyer' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'text-indigo-400 hover:text-cyan-200'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              I am a Buyer
            </button>
            <button 
              type="button"
              onClick={() => setRole("supplier")} 
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${role === 'supplier' ? 'bg-emerald-500/20 text-emerald-400 shadow-sm border border-emerald-500/30' : 'text-indigo-400 hover:text-emerald-200'}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              I am a Supplier
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Full Name / Company Name</label>
            <input 
              type="text" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              placeholder={role === 'buyer' ? "John Doe" : "Apex Textiles"}
            />
          </div>
          
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
            <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Password</label>
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
            className={`w-full text-cyan-50 px-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 ${role === 'supplier' ? 'bg-linear-to-r from-emerald-600 to-cyan-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-linear-to-r from-cyan-600 to-indigo-600 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]'}`}
          >
            {isLoading ? "Creating Account..." : `Sign Up as ${role === 'supplier' ? 'Supplier' : 'Buyer'}`}
          </button>
        </form>

        <p className="text-center text-sm text-indigo-300/60 mt-6 font-medium">
          Already have an account? <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Log In</Link>
        </p>
      </div>
    </div>
  );
}