"use client";

import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function SupplierDashboard() {
  const auth = useContext(AuthContext);

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {auth?.user?.name || "Supplier"}
        </h1>
        <p className="text-gray-500 mt-1">Here is what is happening with your store today.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Pending Orders</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">$4,250</p>
        </div>
      </div>

      {/* Recent Activity Section Placeholder */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-10 text-gray-500">
          No recent activity to display. 
        </div>
      </div>
    </div>
  );
}