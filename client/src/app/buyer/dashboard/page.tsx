/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Link from "next/link";

interface Order {
  _id: string;
  product: {
    _id: string;
    title: string;
    images: string[];
  };
  supplier: {
    name: string;
  };
  // --- NEW: Added Color & Image to the Interface ---
  color?: {
    name: string;
    hex: string;
  };
  image?: string; 
  // -----------------------------------------------
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function BuyerDashboardHub() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const user = auth?.user;
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const buyerId = user?._id;
        const token = auth?.token;
        if (!buyerId || !token) return;

        // FIXED: Using the live environment variable!
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/buyer/${buyerId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user, auth?.token]);

  const activeOrders = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled");
  const pastOrders = orders.filter(o => o.status === "Delivered");
  const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Processing": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Shipped": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Delivered": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  if (loading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-cyan-400 animate-pulse font-bold tracking-widest uppercase">Initializing Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans space-y-8">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-indigo-500/20 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">Welcome back, {user.name?.split(' ')[0] || 'Buyer'}!</h1>
          <p className="text-indigo-300/80 mt-1">Here is an overview of your sourcing activity.</p>
        </div>
        <Link 
          href="/marketplace"
          className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-2.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          New Order
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/30 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-amber-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-sm uppercase tracking-wider">Active Orders</h3>
          </div>
          <p className="text-4xl font-extrabold text-cyan-50">{activeOrders.length}</p>
        </div>
        
        <div className="bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/30 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-emerald-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            <h3 className="font-bold text-sm uppercase tracking-wider">Completed Orders</h3>
          </div>
          <p className="text-4xl font-extrabold text-cyan-50">{pastOrders.length}</p>
        </div>

        <div className="bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/30 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-3 mb-2 text-cyan-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-sm uppercase tracking-wider">Total Spent</h3>
          </div>
          <p className="text-4xl font-extrabold text-cyan-50">${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-cyan-50 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>
              Track Current Orders
            </h2>
            <Link href="/buyer/orders" className="text-sm font-bold text-indigo-400 hover:text-cyan-400 transition-colors">View All History &rarr;</Link>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/20 p-10 rounded-3xl text-center shadow-xl">
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <p className="text-indigo-200 font-medium mb-4">No active orders right now.</p>
              <Link href="/marketplace" className="inline-block px-6 py-2.5 bg-indigo-900/40 border border-indigo-500/50 rounded-xl text-cyan-400 hover:bg-indigo-800/50 transition-colors text-sm font-bold">Start Sourcing</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeOrders.slice(0, 3).map(order => {
                // --- NEW: Smart Image Selection ---
                const displayImage = order.image || order.product?.images?.[0];

                return (
                  <Link key={order._id} href="/buyer/orders" className="block bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/20 p-5 rounded-3xl shadow-lg hover:border-cyan-500/40 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-indigo-500/30">
                        {displayImage ? (
                          <img src={displayImage} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8px] text-indigo-400/50">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-extrabold text-cyan-50 text-base truncate pr-4">{order.product?.title || "Fabric Order"}</h4>
                          <span className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        
                        {/* --- NEW: Display the Ordered Color Swatch --- */}
                        {order.color ? (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: order.color.hex }}></div>
                            <span className="text-xs font-medium text-cyan-200/80">{order.color.name}</span>
                          </div>
                        ) : null}

                        <p className="text-xs text-indigo-300/70 truncate mb-1">Supplier: {order.supplier?.name || "Verified Mill"}</p>
                        <div className="flex items-center gap-4 text-xs font-medium text-indigo-400">
                          <span>Qty: {order.quantity}m</span>
                          <span>Total: ${order.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-cyan-50 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Quick Actions
          </h2>
          
          <Link href="/buyer/profile" className="flex items-center gap-4 bg-indigo-900/30 border border-indigo-500/30 p-5 rounded-2xl hover:bg-indigo-800/40 hover:border-cyan-400/50 transition-all group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-cyan-50 text-sm">View & Edit Profile</h4>
              <p className="text-xs text-indigo-300/70 mt-0.5">Update AI sourcing preferences</p>
            </div>
          </Link>

          <Link href="/buyer/orders" className="flex items-center gap-4 bg-indigo-900/30 border border-indigo-500/30 p-5 rounded-2xl hover:bg-indigo-800/40 hover:border-cyan-400/50 transition-all group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </div>
            <div>
              <h4 className="font-bold text-cyan-50 text-sm">Previous Orders</h4>
              <p className="text-xs text-indigo-300/70 mt-0.5">View your purchase history</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}