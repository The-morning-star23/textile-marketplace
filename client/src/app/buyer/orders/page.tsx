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
  color?: string;
  image?: string;
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

export default function BuyerOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', '30days', 'thisYear'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const buyerId = auth?.user?._id;
        const token = auth?.token;
        if (!buyerId || !token) return;

        const res = await fetch(`http://localhost:5000/api/orders/buyer/${buyerId}`, {
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

    if (auth?.user) {
      fetchOrders();
    }
  }, [auth]);

  // Combined Filter Logic (Text Search + Time Buttons)
  const filteredOrders = orders.filter((order) => {
    // 1. Text Search Match
    const query = searchQuery.toLowerCase();
    const productName = order.product?.title?.toLowerCase() || "";
    const supplierName = order.supplier?.name?.toLowerCase() || "";
    const orderId = order._id.toLowerCase();
    
    const dateObj = new Date(order.createdAt);
    const dateStr = dateObj.toLocaleDateString().toLowerCase();
    const yearStr = dateObj.getFullYear().toString();
    const monthStr = dateObj.toLocaleString('default', { month: 'long' }).toLowerCase();

    const matchesSearch = 
      productName.includes(query) ||
      supplierName.includes(query) ||
      orderId.includes(query) ||
      dateStr.includes(query) ||
      yearStr.includes(query) ||
      monthStr.includes(query);

    // 2. Time Filter Match
    let matchesTime = true;
    const now = new Date();
    
    if (timeFilter === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      matchesTime = dateObj >= thirtyDaysAgo;
    } else if (timeFilter === "thisYear") {
      matchesTime = dateObj.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesTime;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Processing": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Shipped": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "Delivered": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">My Purchases</h1>
          <p className="text-indigo-300/80 mt-1">Track your fabric orders, sample requests, and delivery statuses.</p>
        </div>
        <Link 
          href="/marketplace"
          className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all text-center shrink-0"
        >
          Browse Marketplace
        </Link>
      </header>

      {/* --- SEARCH & FILTER TOOLBAR --- */}
      <div className="mb-10 flex flex-col md:flex-row gap-4 items-start md:items-center">
        
        {/* Instant Search Bar */}
        <div className="relative w-full max-w-xl">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, suppliers, or Order IDs..."
            className="w-full bg-[#0B1120]/60 backdrop-blur-md border border-indigo-500/30 text-cyan-50 rounded-xl pl-12 pr-12 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-indigo-400/50 shadow-xl"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-cyan-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Quick Date Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setTimeFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${timeFilter === 'all' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-[#0B1120]/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 hover:text-indigo-200'}`}
          >
            All Time
          </button>
          <button 
            onClick={() => setTimeFilter("30days")}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${timeFilter === '30days' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-[#0B1120]/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 hover:text-indigo-200'}`}
          >
            Last 30 Days
          </button>
          <button 
            onClick={() => setTimeFilter("thisYear")}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${timeFilter === 'thisYear' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-[#0B1120]/60 text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 hover:text-indigo-200'}`}
          >
            This Year
          </button>
        </div>
      </div>

      {/* --- ORDER LIST RENDER --- */}
      {loading ? (
        <div className="text-center py-20 text-cyan-50/50 font-medium animate-pulse">Loading your purchase history...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-cyan-50">No orders found</h2>
          <p className="text-indigo-300/70 mt-2 mb-8 max-w-md text-center">
            {searchQuery || timeFilter !== 'all' ? "We couldn't find any orders matching your filters." : "You haven't placed any orders yet. Head over to the marketplace to source fabrics."}
          </p>
          {searchQuery || timeFilter !== 'all' ? (
            <button onClick={() => { setSearchQuery(""); setTimeFilter("all"); }} className="text-cyan-400 font-bold hover:text-cyan-300 transition">
              Clear All Filters
            </button>
          ) : (
            <Link href="/marketplace" className="text-cyan-400 font-bold hover:text-cyan-300 transition">
              Explore Fabrics &rarr;
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-6 md:p-8 shadow-xl hover:border-cyan-500/30 transition-colors group">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-indigo-500/20 pb-5 mb-5 gap-4">
                <div>
                  <p className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest mb-1">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-indigo-200/80 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-indigo-300/60">Status:</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide border uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex gap-5 md:w-1/2">
                  <div className="w-24 h-24 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-indigo-500/30">
                    {/* --- UPDATED: Uses the saved order image first, falls back to default product image if missing --- */}
                    {order.image || (order.product?.images && order.product.images.length > 0) ? (
                      <img src={order.image || order.product.images[0]} alt="Product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-indigo-400/50 font-bold uppercase text-center p-2">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-extrabold text-cyan-50 text-lg hover:text-cyan-400 transition-colors line-clamp-1">
                      <Link href={`/product/${order.product?._id}`}>
                        {order.product?.title || "Product Unavailable"}
                      </Link>
                    </h3>
                    <p className="text-sm text-indigo-300/70 font-medium mt-1">From: {order.supplier?.name || "Unknown Supplier"}</p>
                    {order.color && order.color !== "Standard" && (
                      <p className="text-xs text-amber-400 font-bold mt-1 uppercase tracking-wider">
                        Color: {order.color}
                      </p>
                    )}
                    <p className="text-sm text-indigo-400 font-bold mt-2">Qty: {order.quantity} meters</p>
                  </div>
                </div>

                <div className="md:w-1/2 bg-slate-900/40 rounded-2xl p-5 border border-indigo-500/10 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-400/60 uppercase tracking-widest mb-2">Shipping To</h4>
                    <p className="text-sm text-indigo-200 font-medium line-clamp-2 leading-relaxed">{order.shippingAddress}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-indigo-500/20 flex justify-between items-end">
                    <span className="text-xs font-bold text-indigo-400/60 uppercase tracking-widest">Total Paid</span>
                    <span className="text-2xl font-extrabold text-emerald-400">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}