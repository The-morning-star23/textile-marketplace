"use client";

import { useState, useEffect } from "react";

interface Product {
  _id: string;
  title: string;
  description: string;
  fabricType: string;
  price: number;
  moq: number;
  supplier?: {
    name: string;
  };
}

export default function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to load marketplace products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Textile Marketplace</h1>
        <p className="text-gray-500 mt-1">Browse and source fabrics directly from verified suppliers.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-gray-500 font-medium animate-pulse">Loading marketplace...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
              No products available in the marketplace yet.
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-200">
                <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                  [ Image Placeholder ]
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{product.title}</h3>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">{product.fabricType}</span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-3">
                    By: {product.supplier?.name || "Unknown Supplier"}
                  </p>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                  
                  <div className="flex justify-between items-end border-t border-gray-100 pt-4 mt-auto">
                    <div>
                      <div className="font-bold text-lg text-gray-900">${product.price} <span className="text-xs text-gray-500 font-normal">/m</span></div>
                      <div className="text-xs text-gray-500 mt-1">MOQ: {product.moq}m</div>
                    </div>
                    <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}