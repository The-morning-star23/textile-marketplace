"use client";

import Link from "next/link";
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
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Textile Marketplace</h1>
        <p className="text-slate-500 mt-2 text-lg">Browse and source fabrics directly from verified suppliers.</p>
      </header>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading marketplace...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 text-slate-500 shadow-sm">
              No products available in the marketplace yet.
            </div>
          ) : (
            products.map((product) => (
              <div 
                key={product._id} 
                className="bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300"
              >
                {/* Image Area */}
                <div className="h-48 bg-slate-200/50 flex items-center justify-center text-slate-400 border-b border-slate-200/60">
                  <span className="text-sm font-medium tracking-widest uppercase">[ Image Placeholder ]</span>
                </div>
                
                {/* Card Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{product.title}</h3>
                    {/* Neutral, elegant badge */}
                    <span className="bg-slate-200/70 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap">
                      {product.fabricType}
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    By: {product.supplier?.name || "Unknown Supplier"}
                  </p>
                  
                  <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex justify-between items-end pt-4 border-t border-slate-200/60 mt-auto">
                    <div>
                      <div className="font-extrabold text-lg text-slate-900">
                        ${product.price} <span className="text-xs text-slate-500 font-medium">/m</span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">MOQ: {product.moq}m</div>
                    </div>
                    <Link 
                      href={`/buyer/product/${product._id}`} 
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-md shadow-slate-900/10"
                    >
                       View Details
                    </Link>
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