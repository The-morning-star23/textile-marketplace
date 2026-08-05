"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import AIAssistant from "../../components/AIAssistant";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (auth?.isLoading) return;

    if (!auth?.user) {
      router.push("/login");
    } else if (auth.user.role !== "buyer") {
      router.push("/login"); 
    }
  }, [auth, router]);

  if (auth?.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-indigo-100">
        <div className="animate-pulse text-indigo-600 font-bold text-xl flex items-center gap-2">
          <svg className="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading workspace...
        </div>
      </div>
    );
  }

  // If we finished loading and there STILL isn't a valid buyer, show nothing (it will redirect)
  if (!auth?.user || auth.user.role !== "buyer") {
    return null; 
  }

  return (
    // MAIN WRAPPER
    <div className="flex h-screen bg-indigo-100 selection:bg-indigo-400 selection:text-white font-sans overflow-hidden text-slate-900">
      
      {/* Subtle Background Grid for the light main area */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30"></div>

      {/* Premium Dark Sidebar */}
      <aside className="w-72 bg-slate-950 flex flex-col shadow-2xl relative z-20 border-r border-slate-800">
        
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Buyer Panel</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3">
          <Link 
            href="/buyer/dashboard" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${
              pathname === "/buyer/dashboard" 
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Marketplace
          </Link>

          <Link 
            href="/buyer/orders" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${
              pathname === "/buyer/orders" 
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            My Orders
          </Link>
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-6 border-t border-white/10 bg-white/2">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold uppercase shrink-0">
              {auth.user.name ? auth.user.name.charAt(0) : "B"}
            </div>
            <div className="flex-col hidden sm:flex overflow-hidden">
              <span className="text-sm font-semibold text-white truncate">{auth.user.name}</span>
              <span className="text-xs text-slate-500 truncate">{auth.user.email}</span>
            </div>
          </div>
          <button 
            onClick={auth.logout} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
  );
}