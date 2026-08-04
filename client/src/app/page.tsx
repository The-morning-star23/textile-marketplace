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
          // Grab only the newest 3 products for the landing page showcase
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
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-hidden text-slate-200">
      
      {/* Immersive Background: Grid + Glowing Orbs */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[4rem_4rem]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Sticky Frosted Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-white tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-indigo-400">Market</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-white text-slate-950 px-4 py-2 rounded-lg hover:bg-slate-200 transition shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 text-sm font-semibold mb-8 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_10px_rgba(129,140,248,0.8)]"></span>
            Marketplace v1.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-8">
            Source premium textiles with <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-blue-400 to-cyan-400">zero friction.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern B2B platform connecting ambitious apparel brands directly with the world&apos;s most reliable fabric mills and suppliers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-500 transition shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center justify-center gap-2 group border border-indigo-500/50">
              Join as a Buyer
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/register" className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition backdrop-blur-md flex items-center justify-center gap-2">
              Become a Supplier
            </Link>
          </div>
        </div>

        {/* Live Featured Products Grid */}
        <div className="relative mx-auto max-w-5xl mt-12">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-slate-500 mb-8">
            Featured Marketplace Additions
          </h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse flex gap-2 items-center text-indigo-400">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animation-delay-400"></div>
              </div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm text-slate-400">
              New products arriving soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <div 
                  key={product._id} 
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="h-48 bg-slate-900 border-b border-white/10 overflow-hidden relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600 text-xs font-bold tracking-widest uppercase">
                        [ No Image ]
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      ${product.price}/m
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2 block">
                      {product.fabricType}
                    </span>
                    <h3 className="font-bold text-white text-lg truncate mb-1">{product.title}</h3>
                    <p className="text-sm text-slate-400 mb-4">By {product.supplier?.name || "Verified Mill"}</p>
                    <Link href="/login" className="w-full block text-center bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white py-2 rounded-lg text-sm font-semibold transition-all">
                      Log in to view details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modern Bento Grid Features */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">Everything you need to scale production.</h2>
            <p className="text-slate-400 mt-2 text-lg">Built specifically for the modern textile supply chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="col-span-1 md:col-span-2 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-indigo-500/30"></div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Global Sourcing Network</h3>
              <p className="text-slate-400 text-lg max-w-md">Bypass middlemen. Connect directly with verified manufacturers across 40+ countries and negotiate the best rates.</p>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl hover:border-blue-500/50 transition duration-500">
              <div className="w-12 h-12 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-center mb-6 shadow-inner">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Escrow</h3>
              <p className="text-slate-400">Your funds are protected until the textiles arrive exactly as promised.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="border-t border-white/10 mt-auto bg-slate-950/50 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-white/10 border border-white/20 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="font-bold text-white">ThreadMarket</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ThreadMarket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}