"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    } else if (auth.user.role !== "supplier") {
      router.push("/login"); 
    }
  }, [auth, router]);

  if (!auth?.user || auth.user.role !== "supplier") {
    return null; 
  }

  return (
    <div className="flex h-screen bg-slate-100 selection:bg-slate-800 selection:text-white font-sans overflow-hidden text-slate-900">
      
      {/* Subtle Background Grid for the light main area */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-30"></div>

      {/* Premium Dark Sidebar */}
      <aside className="w-72 bg-slate-950 flex flex-col shadow-2xl relative z-20 border-r border-slate-800">
        
        {/* Header / Logo */}
        <div className="h-20 flex items-center px-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="font-extrabold text-xl text-white tracking-tight">Supplier Panel</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3">
          {/* 1. Dashboard Link (Restored) */}
          <Link 
            href="/supplier/dashboard" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${
              pathname === "/supplier/dashboard" 
                ? "bg-white/10 text-white border border-white/20 shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            Dashboard
          </Link>

          {/* 2. My Products Link */}
          <Link 
            href="/supplier/products" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${
              pathname === "/supplier/products" 
                ? "bg-white/10 text-white border border-white/20 shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            My Products
          </Link>

          {/* 3. Manage Orders Link */}
          <Link 
            href="/supplier/orders" 
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition font-medium ${
              pathname === "/supplier/orders" 
                ? "bg-white/10 text-white border border-white/20 shadow-sm" 
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Manage Orders
          </Link>
        </nav>

        {/* Profile & Logout Section */}
        <div className="p-6 border-t border-white/10 bg-white/2">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold uppercase shrink-0">
              {auth.user.name ? auth.user.name.charAt(0) : "S"}
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
    </div>
  );
}