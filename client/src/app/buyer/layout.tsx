"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!auth?.user) {
      router.push("/login");
    } else if (auth.user.role !== "buyer") {
      router.push("/login"); 
    }
  }, [auth, router]);

  if (!auth?.user || auth.user.role !== "buyer") {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col shadow-xl">
        <div className="p-6 text-xl font-bold border-b border-indigo-900">
          Buyer Panel
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/buyer/dashboard" className="block p-3 rounded-lg bg-indigo-600 text-white font-medium">
            Marketplace
          </Link>
          <Link href="/buyer/orders" className="block p-3 rounded-lg hover:bg-indigo-900 text-indigo-200 transition">
            My Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-indigo-900">
          <button 
            onClick={auth.logout} 
            className="w-full text-left p-3 text-red-400 hover:bg-indigo-900 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}