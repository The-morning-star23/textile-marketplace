/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { ReactNode, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function SupplierLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 🚀 THE MASTER BOUNCER
  // This useEffect ensures users are always exactly where they are supposed to be.
  useEffect(() => {
    if (auth.isLoading) return; // Wait for context to finish loading from localStorage

    // 1. Kick out unauthenticated users
    if (!auth?.user) {
      router.push("/login");
      return;
    }

    // 2. Kick out buyers trying to access supplier routes
    if (auth.user.role !== "supplier") {
      router.push("/buyer/dashboard");
      return;
    }

    // 3. Route based on Onboarding Status
    if (!auth.user.isOnboarded && pathname !== "/supplier/onboarding") {
      // If not onboarded, FORCE them to the onboarding page
      router.push("/supplier/onboarding");
    } else if (auth.user.isOnboarded && pathname === "/supplier/onboarding") {
      // If they ARE onboarded but try to go to the onboarding page, FORCE them to dashboard
      router.push("/supplier/dashboard");
    }
  }, [auth.isLoading, auth?.user, pathname, router]);

  // If context is still loading, show a blank/loading screen so it doesn't flash the wrong layout
  if (auth.isLoading) {
    return <div className="min-h-screen bg-[#080C17]"></div>;
  }

  // If we are on the onboarding page, DO NOT show the sidebar layout
  if (pathname === "/supplier/onboarding") {
    return <>{children}</>;
  }

  const supplierLinks = [
    { name: "Dashboard", href: "/supplier/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { name: "Incoming Orders", href: "/supplier/orders", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { name: "My Inventory", href: "/supplier/products", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
    { name: "Add Product", href: "/supplier/products/new", icon: "M12 4v16m8-8H4" },
    { name: "My Profile", href: "/supplier/profile", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  ];

  const handleLogout = () => {
    if (auth?.logout) auth.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex font-sans text-cyan-50 selection:bg-cyan-500/30 overflow-x-hidden w-full">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0B1120]/80 border-r border-indigo-500/20 backdrop-blur-xl shrink-0 z-50">
        <div className="h-20 flex items-center px-8 border-b border-indigo-500/20">
          <Link href="/" className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            Supplier<span className="text-emerald-400">Hub</span>
          </Link>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold text-indigo-400/60 uppercase tracking-widest mb-4 px-2">Factory Management</p>
          <nav className="space-y-2">
            {supplierLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 ${isActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg" : "text-indigo-200/70 hover:bg-indigo-900/40 hover:text-cyan-100 hover:border hover:border-indigo-500/30 border border-transparent"}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} /></svg>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-indigo-500/20">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3.5 w-full rounded-xl font-bold text-red-400 border border-transparent hover:bg-red-500/10 hover:border-red-500/30 transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative overflow-x-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-emerald-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        {children}
      </div>
    </div>
  );
}