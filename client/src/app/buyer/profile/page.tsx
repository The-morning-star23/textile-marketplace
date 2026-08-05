"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const auth = useContext(AuthContext);
  const router = useRouter();

  // Protect the route: if no user is logged in, send them back to login
  useEffect(() => {
    // Wait a brief moment to ensure context has loaded before redirecting
    if (auth && !auth.user) {
      router.push("/login");
    }
  }, [auth, router]);

  // If loading or redirecting, show a simple state
  if (!auth?.user) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-pulse flex gap-2.5 items-center text-indigo-500">
          <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full delay-150"></div>
          <div className="w-4 h-4 bg-violet-400 rounded-full delay-300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto font-sans">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-950 tracking-tight mb-2">My Profile</h1>
        <p className="text-slate-500 font-medium">Manage your account details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: User Card */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-3xl font-extrabold mb-4 border-4 border-white shadow-lg">
              {auth.user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{auth.user.name}</h2>
            <p className="text-sm text-slate-500 mb-6">{auth.user.email}</p>
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Active {auth.user.role}
            </span>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => auth.logout()}
            className="w-full bg-red-50 text-red-600 border border-red-100 p-4 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>

        {/* Right Column: Account Details & Settings */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Information</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Full Name</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-medium">
                  {auth.user.name}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Email Address</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-medium">
                  {auth.user.email}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Account Type</label>
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-900 font-medium capitalize">
                  {auth.user.role} Account
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}