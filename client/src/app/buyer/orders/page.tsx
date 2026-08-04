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
  quantity: number;
  totalPrice: number;
  shippingAddress: string;
  status: string;
  createdAt: string;
}

export default function BuyerOrders() {
  const auth = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Helper function to pick the right color for the status badge
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Processing": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Shipped": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Delivered": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Purchases</h1>
          <p className="text-slate-500 mt-2 text-lg">Track your fabric orders and delivery statuses.</p>
        </div>
        <Link 
          href="/buyer/dashboard"
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-md shadow-slate-900/10 inline-block text-center"
        >
          Browse Marketplace
        </Link>
      </header>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading your purchase history...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">No orders placed yet</h2>
          <p className="text-slate-500 mt-2 mb-6">Head over to the marketplace to find the perfect fabrics for your next project.</p>
          <Link href="/buyer/dashboard" className="text-indigo-600 font-bold hover:text-indigo-700 transition">
            Explore Fabrics &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-slate-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                {/* Status Badge (Read-Only for Buyer) */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-600">Status:</span>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Body */}
              <div className="flex flex-col md:flex-row gap-6">
                
                {/* Product Info Thumbnail */}
                <div className="flex gap-4 md:w-1/2">
                  <div className="w-20 h-20 bg-slate-200 rounded-xl overflow-hidden shrink-0 border border-slate-200/80">
                    {order.product?.images && order.product.images.length > 0 ? (
                      <img src={order.product.images[0]} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 font-bold uppercase text-center p-2">No Image</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg hover:text-indigo-600 transition">
                      <Link href={`/buyer/product/${order.product?._id}`}>
                        {order.product?.title || "Product Unavailable"}
                      </Link>
                    </h3>
                    <p className="text-sm text-slate-600 font-medium mt-1">From: {order.supplier?.name || "Unknown Supplier"}</p>
                    <p className="text-sm text-slate-500 font-medium">Qty: {order.quantity} meters</p>
                  </div>
                </div>

                {/* Price & Shipping Info */}
                <div className="md:w-1/2 bg-white/60 rounded-xl p-4 border border-slate-200/60 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Shipping To</h4>
                    <p className="text-sm text-slate-700 font-medium line-clamp-2">{order.shippingAddress}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-end">
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Paid</span>
                    <span className="text-2xl font-extrabold text-slate-900">${order.totalPrice.toFixed(2)}</span>
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