/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

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

export default function Home() {
  const router = useRouter();
  
  const auth = useContext(AuthContext) as any;
  const cart = useContext(CartContext) as any;
  const user = auth?.user;

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search state to send user to marketplace
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/products");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 4)); // Only show 4 featured products on landing page
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // Handle Search Submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCategory)}`);
  };

  return (
    <div className="min-h-screen bg-[#0B1120] selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* AURORA LIGHTS BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f111_1px,transparent_1px),linear-gradient(to_bottom,#6366f111_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      </div>

      {/* THE PUBLIC HEADER */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#0B1120]/60 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center gap-6">
          
          <Link href="/" className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </Link>

          {/* Search Bar - Redirects to Marketplace */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl items-center bg-[#0B1120]/80 border border-indigo-500/40 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 focus-within:border-transparent transition-all shadow-[0_0_15px_rgba(99,102,241,0.1)]">
            <div className="relative flex items-center bg-indigo-950/50 border-r border-indigo-500/30">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent text-cyan-100 text-sm font-bold pl-5 pr-9 py-3 outline-none appearance-none cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-900 text-cyan-50">
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
              <svg className="w-4 h-4 text-cyan-400 absolute right-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            
            <input 
              type="text" 
              placeholder="Search fabrics, weaves, or suppliers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent px-5 py-3 text-cyan-50 text-sm outline-none placeholder:text-indigo-300/50"
            />
            
            <button type="submit" className="px-5 text-cyan-400 hover:text-cyan-300 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4 shrink-0">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Dashboard Button */}
                <Link 
                  href={user.role === 'supplier' ? "/supplier/dashboard" : "/buyer/dashboard"} 
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Dashboard
                </Link>

                {/* Cart Button (For Buyers only) */}
                {user.role === 'buyer' && (
                  <Link 
                    href="/buyer/cart"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold relative"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Cart
                    {cart?.itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-[#0B1120] text-[9px] items-center justify-center font-extrabold text-[#0B1120]">
                          {cart?.itemCount}
                        </span>
                      </span>
                    )}
                  </Link>
                )}

                {/* Log Out Button */}
                <button 
                  onClick={() => auth?.logout?.()}
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
                <Link href="/login" className="text-sm font-semibold text-indigo-200 hover:text-cyan-100 transition">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-16 pb-24 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-cyan-200 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            The Future of Textiles
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-cyan-50 tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            Source global fabrics with <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-indigo-400 to-violet-400">zero friction.</span>
          </h1>
          <p className="text-xl text-indigo-200/80 mb-10 leading-relaxed max-w-xl">
            A modern B2B platform connecting ambitious apparel brands directly with the world&apos;s most reliable textile mills.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/marketplace" className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-3 group">
              Browse Marketplace
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 relative w-full h-125">
          <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-3xl overflow-hidden border border-indigo-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 hover:-translate-y-2 transition-transform duration-500 bg-slate-900">
            <img src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Premium Fabric Rolls" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0B1120] via-transparent to-transparent opacity-60"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 hover:-translate-y-2 transition-transform duration-500 bg-slate-800">
            <img src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000" alt="Textile Threads" className="w-full h-full object-cover" />
          </div>
        </div>
      </main>

      {/* Featured Products Mid-Section */}
      <section className="relative z-10 py-16 bg-linear-to-b from-transparent to-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-indigo-500/20 pb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-cyan-50 tracking-tight drop-shadow-md">
                Featured Inventory
              </h2>
              <p className="text-indigo-200/80 mt-2">
                A quick preview of our verified supplier catalog.
              </p>
            </div>
            <Link href="/marketplace" className="mt-4 md:mt-0 text-sm font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4">
              View All Fabrics
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse flex gap-2 items-center text-cyan-400">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animation-delay-200"></div>
                <div className="w-3 h-3 bg-violet-400 rounded-full animation-delay-400"></div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div key={product._id} className="bg-indigo-950/30 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col">
                  <div className="h-48 bg-slate-800 overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950">[ Image Pending ]</div>
                    )}
                    <span className="absolute top-3 left-3 bg-[#0B1120]/80 backdrop-blur-md text-cyan-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full border border-cyan-400/20">
                      {product.fabricType}
                    </span>
                    <div className="absolute top-3 right-3 bg-[#0B1120]/90 backdrop-blur-md border border-indigo-500/50 text-cyan-50 text-sm font-extrabold px-3 py-1 rounded-xl shadow-lg">
                      ${product.price}<span className="text-cyan-300/60 font-medium text-xs">/m</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-extrabold text-cyan-50 text-lg mb-1 line-clamp-1">{product.title}</h3>
                    <p className="text-xs text-indigo-300/70 font-medium mb-5">Supplier: {product.supplier?.name || "Verified Mill"}</p>
                    
                    <Link href={`/product/${product._id}`} className="mt-auto w-full block text-center bg-indigo-600/20 hover:bg-linear-to-r hover:from-cyan-600 hover:to-indigo-600 border border-indigo-400/30 hover:border-transparent text-cyan-100 py-2.5 rounded-xl text-sm font-bold transition-all duration-300">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modern Bento Grid: How It Works */}
      <section className="py-24 relative z-10 border-t border-indigo-500/10 bg-[#0B1120]/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:w-2/3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-50 tracking-tight drop-shadow-md">
              A Transparent Supply Chain.
            </h2>
            <p className="text-indigo-200/80 mt-4 text-lg leading-relaxed">
              We built ThreadMarket because sourcing textiles shouldn&apos;t require flying across the world. Manage discovery, negotiation, and logistics in one beautiful dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-3 h-64 md:h-80 rounded-4xl overflow-hidden border border-indigo-500/20 relative group bg-slate-900 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <img 
                src="https://plus.unsplash.com/premium_photo-1673352665694-f81f7b90bfeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fENvbG9yZnVsJTIwSW5kdXN0cmlhbCUyMFRleHRpbGVzfGVufDB8fDB8fHww" 
                alt="Colorful Industrial Textiles" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0B1120] via-transparent to-transparent opacity-80"></div>
            </div>

            <div className="col-span-1 md:col-span-2 bg-linear-to-br from-indigo-900/40 to-slate-900/40 p-8 md:p-10 rounded-4xl border border-indigo-500/20 backdrop-blur-xl hover:border-cyan-400/40 transition duration-500 relative overflow-hidden group">
              <div className="relative z-10 w-14 h-14 bg-cyan-500/20 rounded-2xl border border-cyan-400/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <svg className="w-7 h-7 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-cyan-50 mb-3">Direct Manufacturer Access</h3>
              <p className="relative z-10 text-indigo-200/80 text-lg max-w-md leading-relaxed">
                Bypass traditional agents and middlemen. Browse detailed product catalogs directly from factories in India, China, Turkey, and beyond.
              </p>
            </div>

            <div className="col-span-1 bg-linear-to-br from-violet-900/30 to-slate-900/40 p-8 md:p-10 rounded-4xl border border-violet-500/20 backdrop-blur-xl hover:border-violet-400/40 transition duration-500 relative overflow-hidden group">
              <div className="relative z-10 w-14 h-14 bg-violet-500/20 rounded-2xl border border-violet-400/30 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                <svg className="w-7 h-7 text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="relative z-10 text-2xl font-bold text-cyan-50 mb-3">Secure Flow</h3>
              <p className="relative z-10 text-indigo-200/80 leading-relaxed">
                Every transaction and order status is tracked in real-time, protecting both buyers and suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>

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