/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const auth = useContext(AuthContext) as any;
  const cart = useContext(CartContext) as any;

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (auth.isLoading) return;

    if (!auth?.user) {
      router.push("/login");
      return;
    }

    if (auth.user.role !== "buyer") {
      router.push("/supplier/dashboard");
      return;
    }

    if (!auth.user.isOnboarded && pathname !== "/buyer/onboarding") {
      router.push("/buyer/onboarding");
    } else if (auth.user.isOnboarded && pathname === "/buyer/onboarding") {
      router.push("/marketplace");
    }
  }, [auth.isLoading, auth?.user, pathname, router]);

  if (auth.isLoading) {
    return <div className="min-h-screen bg-[#080C17]"></div>;
  }

  if (pathname === "/buyer/onboarding") {
    return <>{children}</>;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const primaryLinks = [
    { 
      name: "Dashboard Hub", 
      href: "/buyer/dashboard", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> 
    },
    { 
      name: "My Profile", 
      href: "/buyer/profile", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> 
    },
    { 
      name: "Orders & Samples", 
      href: "/buyer/orders", 
      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-[#080C17] flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100">
      <div className="inset-0 z-0 overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f10a_1px,transparent_1px),linear-gradient(to_bottom,#6366f10a_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      </div>

      <div className="flex flex-1 w-full relative z-10">
        <aside className="w-64 bg-[#0B1120]/90 backdrop-blur-md border-r border-indigo-500/20 flex flex-col shrink-0 min-h-full">
          <div className="p-6 border-b border-indigo-500/20 sticky top-0 bg-[#0B1120]/90 z-20">
            <Link href="/" className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
              <div className="w-8 h-8 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <svg className="w-5 h-5 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
              </div>
              Thread<span className="text-cyan-400">Market</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <Link 
              href="/marketplace"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-linear-to-r from-cyan-600/20 to-indigo-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all mb-6"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Marketplace
            </Link>

            <div className="text-xs font-extrabold text-indigo-400/50 uppercase tracking-wider mb-2 px-2">Account Control</div>
            
            {primaryLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                      ? "bg-indigo-600/20 text-cyan-400 border border-indigo-500/30" 
                      : "text-indigo-200/60 hover:text-cyan-100 hover:bg-indigo-900/20"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {link.icon}
                  </svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto mb-4">
            <div className="bg-linear-to-br from-indigo-900/40 to-cyan-900/10 border border-indigo-500/20 rounded-2xl p-4 shadow-lg">
              <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-cyan-50 mb-1">Need help?</h4>
              <p className="text-xs text-indigo-200/70 mb-4 leading-relaxed">Our experts can help you negotiate MOQs.</p>
              <button className="w-full text-xs font-bold bg-indigo-600/30 text-cyan-400 border border-indigo-500/30 py-2.5 rounded-xl hover:bg-indigo-500/40 hover:text-cyan-300 transition-colors cursor-pointer">
                Contact Support
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col w-full relative">
          <header className="h-20 bg-[#0B1120]/80 backdrop-blur-2xl border-b border-indigo-500/20 px-8 flex items-center justify-between sticky top-0 z-30 shadow-xl">
            <form onSubmit={handleSearch} className="flex-1 max-w-xl relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search marketplace..."
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 text-sm rounded-full py-2.5 pl-11 pr-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-indigo-400/50"
              />
            </form>

            <div className="flex items-center gap-4 ml-6">
              <Link 
                href="/buyer/cart"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold relative"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Cart
                {cart?.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-[#0B1120] text-[9px] items-center justify-center font-extrabold text-[#0B1120]">
                      {cart?.itemCount}
                    </span>
                  </span>
                )}
              </Link>

              <button 
                onClick={() => auth?.logout?.()}
                className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-all group text-sm font-bold"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </header>

          <main className="flex-1 w-full relative z-10 pb-8">
            {children}
          </main>
        </div>
      </div>

      <footer className="w-full border-t border-indigo-500/20 bg-[#0B1120]/80 backdrop-blur-xl py-8 z-50 relative mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-indigo-300/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} ThreadMarket. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-indigo-400 hover:text-cyan-400 transition-colors cursor-pointer">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}