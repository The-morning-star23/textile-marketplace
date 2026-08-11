/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect, useContext } from "react";
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
}

const CATEGORIES = ["All", "Cotton", "Silk", "Linen", "Polyester", "Wool", "Blend"];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Hydration fix state
  const [isMounted, setIsMounted] = useState(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const isLoggedIn = auth?.token || (typeof window !== "undefined" && localStorage.getItem("token"));
  const cart = useContext(CartContext);

  // Set isMounted to true once the component has mounted in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 1. Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
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
  }, []);

  // 2. Catch Search Queries from the Landing Page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const search = params.get("search");
      const category = params.get("category");
      if (search) setSearchQuery(search);
      if (category) setSelectedCategory(category);
    }
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.fabricType.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "All" || product.fabricType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    /* A lighter dark mode background (slate-900) instead of the landing page's #0B1120 */
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* AURORA LIGHTS BACKGROUND (Dark Mode Effects restored) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* THE PUBLIC HEADER (Relative so it scrolls away naturally) */}
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
            {/* HYDRATION FIX: Only render buttons after mounting */}
            {isMounted && (
              isLoggedIn ? (
                <div className="flex items-center gap-4">
      
                  {/* Dashboard Button */}
                  <Link 
                    href="/buyer/dashboard"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
      
                  {/* Cart Button */}
                  <Link
                    href="/buyer/cart"
                    className="relative flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart

                    {/* Notification Badge */}
                    {(cart?.itemCount ?? 0) > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-[#0B1120] text-[9px] items-center justify-center font-extrabold text-[#0B1120]">
                            {cart?.itemCount}
                        </span>
                      </span>
                    )}
                  </Link>

                  {/* Log Out Button */}
                  <button 
                    onClick={() => auth?.logout?.()}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-all group text-sm font-bold ml-2"
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

      {/* Marketplace Category Toolbar */}
      <div className="max-w-7xl mx-auto px-6 w-full pt-10 pb-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tight">Global Catalog</h1>
          
          {/* Category Filter Pills (Restored to Dark Mode) */}
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

      {/* Product Grid (Restored to Dark Mode) */}
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
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-indigo-950/30 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col">
                <div className="h-48 bg-slate-800 overflow-hidden relative">
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950">
                      [ No Image ]
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-[#0B1120]/90 backdrop-blur-md border border-indigo-500/50 text-cyan-50 text-sm font-extrabold px-3 py-1 rounded-xl shadow-lg">
                    ${product.price}<span className="text-cyan-300/60 font-medium text-xs">/m</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">{product.fabricType}</span>
                  <h3 className="font-extrabold text-cyan-50 text-lg mb-1 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-indigo-300/70 font-medium mt-auto pt-2">Supplier: {product.supplier?.name || "Verified Mill"}</p>
                  
                  {/* REAL LINK BUTTON (Only this part is clickable now) */}
                  <Link 
                    href={`/product/${product._id}`}
                    className="mt-4 w-full block text-center bg-indigo-600/20 hover:bg-linear-to-r hover:from-cyan-600 hover:to-indigo-600 border border-indigo-400/30 hover:border-transparent text-cyan-100 py-2.5 rounded-xl text-sm font-bold transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= FULL WIDTH FOOTER ================= */}
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