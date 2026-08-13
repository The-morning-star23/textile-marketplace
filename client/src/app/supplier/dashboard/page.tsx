"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../../../context/AuthContext";

export default function SupplierDashboard() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  
  // State for real database metrics
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real product & order data when the dashboard loads
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Wait for auth to load
      const supplierId = auth?.user?._id;
      const token = auth?.token;
      if (!supplierId || !token) return; 
      
      try {
        // --- FIXED: Uses the live backend environment variable ---
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

        // Fetch Products
        const prodRes = await fetch(`${apiUrl}/api/products/supplier/${supplierId}`);
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }

        // Fetch Orders
        const ordRes = await fetch(`${apiUrl}/api/orders/supplier/${supplierId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          setOrders(ordData);
        }
        // ---------------------------------------------------------

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [auth?.user?._id, auth?.token]);

  // Calculate live metrics
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.inStock !== false).length;
  const inventoryAlerts = products.filter(p => p.inStock === false).length;
  
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  
  // Get top 5 most recent orders for the table
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6 md:p-10 z-10 w-full max-w-7xl mx-auto font-sans">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">
            Welcome back, <span className="text-emerald-400">{auth?.user?.name || "Partner"}</span>
          </h1>
          <p className="text-indigo-300/80 mt-1">Here is your marketplace activity overview.</p>
        </div>
        <Link 
          href="/supplier/products/new"
          className="bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2 w-fit"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
          Add New Product
        </Link>
      </header>

      {/* TOP METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Widget 1: Pending Orders (REAL DATA) */}
        <div className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-[30px] group-hover:bg-cyan-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
          </div>
          <h3 className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Pending Orders</h3>
          <div className="text-3xl font-extrabold text-cyan-50">
            {isLoading ? "..." : pendingOrdersCount}
          </div>
          <p className="text-xs font-bold text-cyan-400 mt-2 flex items-center gap-1">
            Requires fulfillment
          </p>
        </div>

        {/* Widget 2: Active Products (REAL DATA) */}
        <div className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-[30px] group-hover:bg-emerald-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h3 className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Active Products</h3>
          <div className="text-3xl font-extrabold text-cyan-50">
            {isLoading ? "..." : activeProducts}
          </div>
          <p className="text-xs font-bold text-emerald-400 mt-2 flex items-center gap-1">
            Live on marketplace
          </p>
        </div>

        {/* Widget 3: Total Products (REAL DATA) */}
        <div className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-6 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-[30px] group-hover:bg-purple-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center text-purple-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
          </div>
          <h3 className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Total Products</h3>
          <div className="text-3xl font-extrabold text-cyan-50">
            {isLoading ? "..." : totalProducts}
          </div>
          <p className="text-xs font-bold text-indigo-400 mt-2 flex items-center gap-1">
            Including drafts/offline
          </p>
        </div>

        {/* Widget 4: Inventory Alerts (REAL DATA) */}
        <div className="bg-red-950/20 backdrop-blur-md rounded-3xl border border-red-500/30 p-6 shadow-xl relative overflow-hidden group hover:border-red-500/60 transition-colors">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-[30px] group-hover:bg-red-500/20 transition-colors"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg border border-red-500/40 flex items-center justify-center text-red-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
          <h3 className="text-red-300 text-sm font-bold uppercase tracking-wider mb-1">Inventory Alerts</h3>
          <div className="text-3xl font-extrabold text-red-400">
            {isLoading ? "..." : inventoryAlerts}
          </div>
          <p className="text-xs font-bold text-red-400/80 mt-2 flex items-center gap-1">
            Items low on stock
          </p>
        </div>

      </div>

      {/* BOTTOM SECTION: Recent Orders & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Widget 5: Recent Orders */}
        <div className="lg:col-span-2 bg-[#0B1120]/60 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-2xl flex flex-col h-full">
          <div className="p-6 border-b border-indigo-500/20 flex justify-between items-center">
            <h2 className="text-xl font-bold text-cyan-50">Recent Orders</h2>
            <Link href="/supplier/orders" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="flex-1 p-6 overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10 text-cyan-50/50 animate-pulse">Loading orders...</div>
            ) : recentOrders.length === 0 ? (
              <div className="text-center py-10 text-indigo-300/60">No orders received yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-indigo-500/20">
                    <th className="pb-4 font-bold">Order ID</th>
                    <th className="pb-4 font-bold">Buyer</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-indigo-500/10">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-indigo-900/20 transition-colors group">
                      <td className="py-4 font-bold text-cyan-50">#{order._id.slice(-6)}</td>
                      <td className="py-4 text-indigo-200">{order.buyer?.name || "Unknown Buyer"}</td>
                      <td className="py-4 text-indigo-300/80">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          order.status === 'Pending' ? 'bg-cyan-900/40 text-cyan-400 border-cyan-500/30' :
                          order.status === 'Processing' ? 'bg-amber-900/40 text-amber-400 border-amber-500/30' :
                          'bg-emerald-900/40 text-emerald-400 border-emerald-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 font-extrabold text-emerald-400 text-right">${order.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-3xl p-6 backdrop-blur-md flex flex-col h-full">
          <h2 className="text-xl font-bold text-cyan-50 mb-6">Quick Actions</h2>
          <div className="space-y-4 flex-1">
            <Link href="/supplier/orders" className="flex items-center justify-between bg-[#0B1120]/80 p-5 rounded-2xl border border-indigo-500/30 hover:border-emerald-500/50 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                </div>
                <span className="font-bold text-cyan-50">Review Orders</span>
              </div>
              <svg className="w-5 h-5 text-indigo-400 group-hover:text-emerald-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
            
            <Link href="/supplier/products" className="flex items-center justify-between bg-[#0B1120]/80 p-5 rounded-2xl border border-indigo-500/30 hover:border-cyan-500/50 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                </div>
                <span className="font-bold text-cyan-50">Manage Inventory</span>
              </div>
              <svg className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}