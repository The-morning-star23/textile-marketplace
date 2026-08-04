/* eslint-disable @next/next/no-img-element */
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
  images: string[];
  supplier?: {
    name: string;
  };
}

// Standard categories we defined in the supplier form
const CATEGORIES = ["All", "Cotton", "Silk", "Linen", "Polyester", "Wool", "Blend"];

export default function BuyerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New States for Search and Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Filter Logic: Runs instantly on the frontend whenever search or category changes
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "All" || product.fabricType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Textile Marketplace</h1>
        <p className="text-slate-500 mt-2 text-lg">Browse and source fabrics directly from verified suppliers.</p>
      </header>

      {/* --- NEW: Search & Filter Toolbar --- */}
      <div className="bg-slate-50/80 backdrop-blur-md rounded-2xl border border-slate-200/60 p-4 mb-10 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96 shrink-0">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Search fabrics, weaves, or suppliers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-slate-900 shadow-sm font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white shadow-slate-900/20"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* --- END TOOLBAR --- */}

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Loading marketplace...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 text-slate-500 shadow-sm flex flex-col items-center justify-center">
              <svg className="w-12 h-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold text-slate-700">No fabrics found</span>
              <p className="text-sm mt-1">Try adjusting your search or selecting a different category.</p>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="mt-6 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div 
                key={product._id} 
                className="bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300 group"
              >
                {/* Dynamic Image Area */}
                <div className="h-48 bg-slate-200/50 flex items-center justify-center text-slate-400 border-b border-slate-200/60 overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-sm font-medium tracking-widest uppercase">[ No Image ]</span>
                  )}
                  {/* Category Badge overlaying the image */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                    {product.fabricType}
                  </span>
                </div>
                
                {/* Card Content Area */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{product.title}</h3>
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