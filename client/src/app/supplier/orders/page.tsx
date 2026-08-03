"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

interface Order {
  _id: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  shippingAddress: string;
  product: {
    title: string;
  };
  buyer: {
    name: string;
    email: string;
  };
}

export default function SupplierOrders() {
  const auth = useContext(AuthContext);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supplierId = auth?.user?._id;
        if (!supplierId) return;

        const res = await fetch(`http://localhost:5000/api/orders/supplier/${supplierId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    if (auth?.user) {
      fetchOrders();
    }
  }, [auth]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // Update the local state so the UI reflects the change immediately
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Incoming Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
          You have no orders yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{order.product.title}</h3>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Qty: {order.quantity}m</span>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-900">Buyer:</span> {order.buyer.name} ({order.buyer.email})
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Ship To:</span> {order.shippingAddress}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 min-w-50">
                <div className="text-xl font-bold text-green-600">${order.totalPrice.toFixed(2)}</div>
                
                <div className="w-full">
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Update Status</label>
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="w-full border p-2 rounded-lg text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}