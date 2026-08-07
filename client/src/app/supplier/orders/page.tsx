/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

interface Order {
  _id: string;
  product: {
    title: string;
    images: string[];
  };
  buyer: {
    name: string;
    email: string;
  };
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

// Added 'Cancelled' to match the database schema
const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function SupplierOrders() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supplierId = auth?.user?._id;
        const token = auth?.token;
        if (!supplierId || !token) return;

        const res = await fetch(`http://localhost:5000/api/orders/supplier/${supplierId}`, {
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth?.token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        const updatedOrder = await res.json();
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: updatedOrder.status } : order));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // Upgraded to neon dark-mode color scheme
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "Processing": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "Shipped": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "Cancelled": return "bg-red-500/10 text-red-400 border-red-500/30";
      default: return "bg-indigo-500/10 text-indigo-400 border-indigo-500/30";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans w-full z-10 relative">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">Order Management</h1>
        <p className="text-indigo-300/80 mt-1">Track customer orders, manage fulfillment, and update statuses.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-emerald-400/70 font-bold animate-pulse">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          Syncing Orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-cyan-50">No orders yet</h2>
          <p className="text-indigo-300/80 mt-2 max-w-sm">When buyers purchase your fabrics, their fulfillment requests will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-[#0B1120]/60 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-6 md:p-8 shadow-xl hover:border-emerald-500/40 transition-colors group">
              
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-indigo-500/20 pb-6 mb-6 gap-4">
                <div>
                  <p className="text-xs font-bold text-indigo-400/60 uppercase tracking-widest mb-1 flex items-center gap-2">
                    Order <span className="text-cyan-400">#{order._id.slice(-8).toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-indigo-300/80 font-medium">{new Date(order.createdAt).toLocaleDateString()} &nbsp;&bull;&nbsp; {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                
                {/* Status Update Control */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Status:</span>
                  <div className="relative flex-1 md:flex-none">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`appearance-none w-full md:w-44 pl-4 pr-10 py-2.5 rounded-xl text-sm font-bold outline-none cursor-pointer border transition-colors focus:ring-2 focus:ring-emerald-400/50 ${getStatusColor(order.status)} ${updatingId === order._id ? 'opacity-50 grayscale' : ''}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status} className="bg-[#080C17] text-cyan-50">{status}</option>
                      ))}
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-80">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="flex flex-col md:flex-row gap-8">
                
                {/* Product Info Thumbnail */}
                <div className="flex gap-5 md:w-1/2">
                  <div className="w-24 h-24 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-indigo-500/30">
                    {order.product?.images && order.product.images.length > 0 ? (
                      <img src={order.product.images[0]} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-indigo-400/50 font-bold uppercase text-center p-2">No Image</div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="font-extrabold text-cyan-50 text-lg line-clamp-1">{order.product?.title || "Product Unavailable"}</h3>
                    <p className="text-sm text-indigo-300/80 font-medium mt-1">Qty: <span className="text-cyan-400">{order.quantity} m</span></p>
                    <p className="text-xl font-extrabold text-emerald-400 mt-2">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="md:w-1/2 bg-indigo-950/40 rounded-2xl p-5 border border-indigo-500/30">
                  <h4 className="text-xs font-bold text-emerald-400/70 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Shipping Details
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-indigo-300 w-16">Buyer:</span> 
                      <span className="text-cyan-50 font-bold">{order.buyer?.name || "Unknown Buyer"}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="font-bold text-indigo-300 w-16">Email:</span> 
                      <a href={`mailto:${order.buyer?.email}`} className="text-cyan-400 hover:text-cyan-300 transition-colors">{order.buyer?.email || "N/A"}</a>
                    </p>
                    <div className="flex items-start gap-2 pt-1">
                      <span className="font-bold text-indigo-300 w-16 mt-0.5">Address:</span> 
                      <span className="text-indigo-200/90 flex-1 leading-relaxed">{order.shippingAddress}</span>
                    </div>
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