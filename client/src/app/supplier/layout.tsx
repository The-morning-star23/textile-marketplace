"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SupplierLayout({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a supplier
    if (!auth?.user) {
      router.push("/login");
    } else if (auth.user.role !== "supplier") {
      router.push("/login"); 
    }
  }, [auth, router]);

  // Prevent flash of unstyled content while checking auth
  if (!auth?.user || auth.user.role !== "supplier") {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-6 text-xl font-bold border-b border-gray-800">
          Supplier Panel
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/supplier/dashboard" className="block p-3 rounded-lg bg-blue-600 text-white font-medium">
            Dashboard
          </Link>
          <Link href="/supplier/products" className="block p-3 rounded-lg hover:bg-gray-800 text-gray-300 transition">
            My Products
          </Link>
          <Link href="/supplier/orders" className="block p-3 rounded-lg hover:bg-gray-800 text-gray-300 transition">
            Orders
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={auth.logout} 
            className="w-full text-left p-3 text-red-400 hover:bg-gray-800 rounded-lg transition"
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