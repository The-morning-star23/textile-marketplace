/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] selection:bg-cyan-500/30 selection:text-cyan-100 flex flex-col relative overflow-hidden font-sans">
      
      {/* AURORA LIGHTS BACKGROUND */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-violet-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f111_1px,transparent_1px),linear-gradient(to_bottom,#6366f111_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      </div>

      {/* Sticky Frosted Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[#0B1120]/40 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-indigo-200 hover:text-cyan-100 transition">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 transition-all duration-300">
              Start Sourcing
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-20 pb-24 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Copy */}
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
            <Link href="/register" className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-3 group">
              Explore Marketplace
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/register" className="bg-indigo-900/40 text-cyan-100 border border-indigo-500/30 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-800/50 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-md flex items-center justify-center">
              Sell Fabrics
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 relative w-full h-125">
          {/* Main Floating Image (Textile Rolls) */}
          <div className="absolute top-0 right-0 w-4/5 h-4/5 rounded-3xl overflow-hidden border border-indigo-400/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 hover:-translate-y-2 transition-transform duration-500 bg-slate-900">
            <img 
              src="https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
              alt="Premium Fabric Rolls" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#0B1120] via-transparent to-transparent opacity-60"></div>
          </div>
          {/* Secondary overlapping Image (Threads/Weave) */}
          <div className="absolute bottom-0 left-0 w-3/5 h-3/5 rounded-3xl overflow-hidden border border-cyan-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30 hover:-translate-y-2 transition-transform duration-500 bg-slate-800">
            <img 
              src="https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=1000" 
              alt="Textile Threads" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>

      {/* Live Featured Products Grid */}
      <section className="relative z-10 py-24 bg-linear-to-b from-transparent to-[#0B1120]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-cyan-50 tracking-tight drop-shadow-md mb-4">
              Recently Added to the Marketplace
            </h2>
            <p className="text-indigo-200/80 text-lg max-w-2xl">
              Preview real-time inventory uploaded by certified global suppliers.
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse flex gap-2 items-center text-cyan-400">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <div className="w-3 h-3 bg-indigo-400 rounded-full animation-delay-200"></div>
                <div className="w-3 h-3 bg-violet-400 rounded-full animation-delay-400"></div>
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16 border border-indigo-500/20 rounded-3xl bg-indigo-950/20 backdrop-blur-md text-indigo-300 font-medium">
              New products arriving soon. Create an account to get notified.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-indigo-950/30 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)] hover:-translate-y-2 transition-all duration-500 group flex flex-col"
                >
                  <div className="h-56 bg-slate-800 overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs font-bold tracking-widest uppercase bg-indigo-950">
                        [ Image Pending ]
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-[#0B1120]/80 backdrop-blur-md border border-cyan-400/30 text-cyan-100 text-sm font-extrabold px-4 py-1.5 rounded-full shadow-lg">
                      ${product.price}<span className="text-cyan-300/60 font-medium text-xs">/m</span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-2 block">
                      {product.fabricType}
                    </span>
                    <h3 className="font-extrabold text-cyan-50 text-xl mb-1">{product.title}</h3>
                    <p className="text-sm text-indigo-300 font-medium mb-6">Supplied by {product.supplier?.name || "Verified Mill"}</p>
                    
                    <Link href="/login" className="mt-auto w-full block text-center bg-indigo-600/20 hover:bg-linear-to-r hover:from-cyan-600 hover:to-indigo-600 border border-indigo-400/30 hover:border-transparent text-cyan-100 py-3 rounded-xl text-sm font-bold transition-all duration-300 shadow-sm">
                      Log in to View Order Details
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
            
            {/* Mid-Section Image Spanning Full Width */}
            <div className="col-span-1 md:col-span-3 h-64 md:h-80 rounded-4xl overflow-hidden border border-indigo-500/20 relative group bg-slate-900 shadow-[0_0_20px_rgba(99,102,241,0.1)]">
              <img 
                src="https://plus.unsplash.com/premium_photo-1673352665694-f81f7b90bfeb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fENvbG9yZnVsJTIwSW5kdXN0cmlhbCUyMFRleHRpbGVzfGVufDB8fDB8fHww" 
                alt="Colorful Industrial Textiles" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0B1120] via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Card 1: Direct Manufacturer Access (Now with inner glowing elements) */}
            <div className="col-span-1 md:col-span-2 bg-linear-to-br from-indigo-900/40 to-slate-900/40 p-8 md:p-10 rounded-4xl border border-indigo-500/20 backdrop-blur-xl hover:border-cyan-400/40 transition duration-500 relative overflow-hidden group">
              {/* Internal Decorative Background */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                <div className="absolute right-[-10%] top-[-20%] w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000 delay-100"></div>
                {/* Subtle internal grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[1rem_1rem] opacity-30"></div>
              </div>
              
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

            {/* Card 2: Secure Flow (Now with internal glowing elements) */}
            <div className="col-span-1 bg-linear-to-br from-violet-900/30 to-slate-900/40 p-8 md:p-10 rounded-4xl border border-violet-500/20 backdrop-blur-xl hover:border-violet-400/40 transition duration-500 relative overflow-hidden group">
              {/* Internal Decorative Background */}
              <div className="absolute inset-0 z-0 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-700">
                <div className="absolute left-[-20%] bottom-[-20%] w-56 h-56 bg-violet-600/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="absolute top-[10%] right-[-10%] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000 delay-100"></div>
              </div>

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

      {/* Footer */}
      <footer className="border-t border-indigo-500/20 bg-[#060913] relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </div>
          <p className="text-cyan-50/70 text-sm font-medium">© {new Date().getFullYear()} ThreadMarket. Built for the modern supply chain.</p>
        </div>
      </footer>
    </div>
  );
}