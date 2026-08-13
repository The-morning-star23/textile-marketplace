/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image"; // 1. Added next/image
import { useSearchParams } from "next/navigation"; // 2. Added useSearchParams
import { useState, useEffect, useContext, Suspense } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

interface Product {
  _id: string;
  title: string;
  fabricType: string;
  price: number;
  images: string[];
  supplier?: {
    name: string;
  };
  inStock?: boolean;
  availableStock?: number;
}

const CATEGORIES = ["All", "Cotton", "Silk", "Linen", "Polyester", "Wool", "Blend"];

// 3. Extracted to handle search params safely within a Suspense boundary
function MarketplaceContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const searchParams = useSearchParams();
  // 4. Initialize state directly from URL params if they exist
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const auth = useContext(AuthContext) as any;
  const cart = useContext(CartContext) as any;

  // 5. Safely check localStorage only on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const token = auth?.token || localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [auth?.token]);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        
        const token = auth?.token || localStorage.getItem("token");
        const headers: Record<string, string> = token ? { "Authorization": `Bearer ${token}` } : {};
        
        const res = await fetch(`${apiUrl}/api/products`, { headers }); 

        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [auth?.token]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.fabricType.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "All" || product.fabricType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* AURORA LIGHTS BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* THE PUBLIC HEADER */}
      <nav className="relative z-50 w-full backdrop-blur-2xl bg-[#0B1120]/95 border-b border-indigo-500/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center gap-4 md:gap-8">
          
          <Link href="/" className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)] md:flex">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="hidden sm:block">Thread<span className="text-cyan-400">Market</span></span>
          </Link>

          {/* GLOBAL SEARCH BAR */}
          <div className="flex-1 max-w-2xl flex items-center bg-[#0B1120]/80 border border-indigo-500/40 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <input 
              type="text" 
              placeholder="Search fabrics, weaves, or suppliers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-5 py-2.5 text-cyan-50 text-sm outline-none placeholder:text-indigo-300/50"
            />
            <div className="px-5 text-cyan-400 border-l border-indigo-500/30 py-2.5 bg-indigo-950/30">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {isMounted && (
              isLoggedIn ? (
                <div className="flex items-center gap-4">
                  <Link 
                    href="/buyer/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
      
                  <Link
                    href="/buyer/cart"
                    className="relative flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                    {(cart?.itemCount ?? 0) > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-[#0B1120] text-[9px] items-center justify-center font-extrabold text-[#0B1120]">
                            {cart?.itemCount}
                        </span>
                      </span>
                    )}
                  </Link>

                  <button 
                    onClick={() => {
                        auth?.logout?.();
                        setIsLoggedIn(false);
                    }}
                    className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-all group text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold text-indigo-200 hover:text-cyan-100 transition hidden sm:block">
                    Log in
                  </Link>
                  <Link href="/register" className="text-sm font-semibold bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 px-4 py-2 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300">
                    Sign Up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 w-full pt-10 pb-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tight">Global Catalog</h1>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    : "bg-indigo-900/30 text-indigo-200 border border-indigo-500/20 hover:bg-indigo-800/50 hover:text-cyan-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-6 w-full pb-24 relative z-10">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex gap-2 items-center text-cyan-400">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="w-3 h-3 bg-indigo-400 rounded-full animation-delay-200"></div>
              <div className="w-3 h-3 bg-violet-400 rounded-full animation-delay-400"></div>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 border border-indigo-500/20 rounded-3xl bg-indigo-950/20 backdrop-blur-md text-indigo-300 font-medium">
            No fabrics match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.inStock === false || product.availableStock === 0;

              return (
                <div key={product._id} className={`bg-indigo-950/30 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden transition-all duration-500 group flex flex-col ${isOutOfStock ? 'opacity-80 grayscale' : 'hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:-translate-y-2'}`}>
                  <div className="h-48 bg-slate-800 overflow-hidden relative">
                    
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-[#0B1120]/60 z-20 flex items-center justify-center backdrop-blur-[2px]">
                        <span className="bg-red-500 text-white font-extrabold px-4 py-1.5 rounded-lg uppercase tracking-widest text-sm shadow-lg shadow-red-500/30">Out of Stock</span>
                      </div>
                    )}

                    {/* 7. Replaced standard <img> with Next.js <Image /> component */}
                    {product.images && product.images.length > 0 ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950">
                        [ No Image ]
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-[#0B1120]/90 backdrop-blur-md border border-indigo-500/50 text-cyan-50 text-sm font-extrabold px-3 py-1 rounded-xl shadow-lg z-10">
                      ${product.price}<span className="text-cyan-300/60 font-medium text-xs">/m</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">{product.fabricType}</span>
                    <h3 className="font-extrabold text-cyan-50 text-lg mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-indigo-300/70 font-medium mt-auto pt-2">Supplier: {product.supplier?.name || "Verified Mill"}</p>
                    
                    <Link 
                      href={`/product/${product._id}`}
                      className="mt-4 w-full block text-center bg-indigo-600/20 hover:bg-linear-to-r hover:from-cyan-600 hover:to-indigo-600 border border-indigo-400/30 hover:border-transparent text-cyan-100 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="w-full border-t border-indigo-500/20 bg-[#0B1120]/80 backdrop-blur-xl py-8 z-50 relative mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-indigo-300/60 text-sm font-medium">
            &copy; {new Date().getFullYear()} ThreadMarket. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-indigo-400 hover:text-cyan-400 transition-colors cursor-pointer">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 8. Wrap inside Suspense because useSearchParams() de-opts static rendering if not isolated
export default function MarketplacePage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-slate-900 flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}