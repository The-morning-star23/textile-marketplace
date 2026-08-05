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

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered"];

export default function SupplierOrders() {
  const auth = useContext(AuthContext);
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
        // Update the order in our local state so the UI changes instantly
        setOrders(orders.map(order => order._id === orderId ? { ...order, status: updatedOrder.status } : order));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

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
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order Management</h1>
        <p className="text-slate-500 mt-2 text-lg">Track customer orders, manage fulfillment, and update statuses.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">No orders yet</h2>
          <p className="text-slate-500 mt-2">When buyers place orders for your fabrics, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-shadow">
              
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200/80 pb-4 mb-4 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-8)}</p>
                  <p className="text-sm text-slate-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}  {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                
                {/* Status Update Control */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="text-sm font-semibold text-slate-600">Status:</span>
                  <div className="relative flex-1 md:flex-none">
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`appearance-none w-full md:w-40 pl-4 pr-10 py-2 rounded-xl text-sm font-bold outline-none cursor-pointer border transition-colors ${getStatusColor(order.status)} ${updatingId === order._id ? 'opacity-50' : ''}`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status} className="bg-white text-slate-900">{status}</option>
                      ))}
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-current opacity-60">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
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
                    <h3 className="font-extrabold text-slate-900 text-lg">{order.product?.title || "Product Unavailable"}</h3>
                    <p className="text-sm text-slate-600 font-medium mt-1">Qty: {order.quantity} meters</p>
                    <p className="text-lg font-extrabold text-emerald-600 mt-1">${order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="md:w-1/2 bg-white/60 rounded-xl p-4 border border-slate-200/60">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Shipping Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-slate-700">Buyer:</span> <span className="text-slate-600">{order.buyer?.name}</span></p>
                    <p><span className="font-semibold text-slate-700">Email:</span> <a href={`mailto:${order.buyer?.email}`} className="text-indigo-600 hover:underline">{order.buyer?.email}</a></p>
                    <div className="flex items-start gap-1">
                      <span className="font-semibold text-slate-700">Address:</span> 
                      <span className="text-slate-600 flex-1">{order.shippingAddress}</span>
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