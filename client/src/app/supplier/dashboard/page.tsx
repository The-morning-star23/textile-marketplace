/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function SupplierDashboard() {
  const auth = useContext(AuthContext);
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const supplierId = auth?.user?._id;
        const token = auth?.token;
        if (!supplierId || !token) return;

        // Fetch both Products and Orders simultaneously for speed
        const [productsRes, ordersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/products/supplier/${supplierId}`),
          fetch(`http://localhost:5000/api/orders/supplier/${supplierId}`, {
            headers: { "Authorization": `Bearer ${token}` }
          })
        ]);

        if (productsRes.ok && ordersRes.ok) {
          const products = await productsRes.json();
          const orders = await ordersRes.json();

          // Calculate Real KPIs
          const totalProducts = products.length;
          
          // Assuming orders have a status field (defaulting to 'pending' if missing or matching 'pending')
          const pendingOrders = orders.filter((order: any) => !order.status || order.status.toLowerCase() === 'pending').length;
          
          // Sum up the total price of all orders
          const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0);

          setStats({ totalProducts, pendingOrders, totalRevenue });
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user) {
      fetchDashboardData();
    }
  }, [auth]);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, {auth?.user?.name || "Supplier"}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Here is what is happening with your store today.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Total Products Card */}
        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Products</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">
            {loading ? "..." : stats.totalProducts}
          </p>
        </div>
        
        {/* Pending Orders Card */}
        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Pending Orders</h3>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">
            {loading ? "..." : stats.pendingOrders}
          </p>
        </div>
        
        {/* Total Revenue Card */}
        <div className="bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm shadow-slate-200/40 border border-slate-200/60 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h3>
          <p className="text-4xl font-extrabold text-emerald-600 mt-2">
            {loading ? "..." : `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-slate-50/80 backdrop-blur-sm rounded-3xl shadow-sm shadow-slate-200/40 border border-slate-200/60 p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Recent Activity</h2>
        <div className="text-center py-12 bg-slate-100/50 rounded-2xl border border-slate-200/50 text-slate-500 font-medium">
          {loading ? "Loading activity..." : "No recent activity to display."}
        </div>
      </div>
    </div>
  );
}