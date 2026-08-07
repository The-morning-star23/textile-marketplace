"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";

interface Product {
  _id: string;
  title: string;
  fabricType: string;
  description: string;
  price: number;
  images: string[];
  supplier?: {
    _id?: string;
    name: string;
  };
  availableColors: string[];
  specifications: {
    width: string;
    weight: string;
    composition: string;
  };
  moq?: number;
  availableStock: number;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartContext = useContext(CartContext) as any;
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  const isLoggedIn = auth?.token || (typeof window !== "undefined" && localStorage.getItem("token"));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to load product.");
        const data = await res.json();
        setProduct(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
        // Set default quantity to MOQ
        if (data.moq) {
          setQuantity(data.moq);
        }
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setError("This fabric is currently unavailable. The inventory might be outdated.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  // Search Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#080C17]">
        <div className="animate-pulse flex gap-2.5 items-center text-cyan-400">
          <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
          <div className="w-4 h-4 bg-indigo-400 rounded-full animation-delay-200"></div>
          <div className="w-4 h-4 bg-violet-400 rounded-full animation-delay-400"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080C17] p-6">
        <div className="max-w-2xl w-full p-12 text-center bg-indigo-950/40 border border-indigo-500/20 backdrop-blur-md rounded-3xl shadow-xl">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h1 className="text-3xl font-extrabold text-cyan-50 mb-3">Product Not Found</h1>
          <p className="text-indigo-200/80 max-w-lg mx-auto mb-8">{error}</p>
          <button onClick={() => router.push('/marketplace')} className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition">
            Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080C17] flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100">
      
      {/* AURORA LIGHTS BACKGROUND */}
      <div className="inset-0 z-0 overflow-hidden pointer-events-none fixed">
        <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-10000"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f10a_1px,transparent_1px),linear-gradient(to_bottom,#6366f10a_1px,transparent_1px)] bg-size-[4rem_4rem]"></div>
      </div>

      {/* Smart Navbar (Consistent Dark Theme) */}
      <nav className="relative z-50 w-full backdrop-blur-2xl bg-[#0B1120]/80 border-b border-indigo-500/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          <Link href="/" className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fabrics, categories..."
              className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 text-sm rounded-full py-2.5 pl-5 pr-10 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-indigo-300/40"
            />
            <button type="submit" className="absolute right-4 top-3 text-indigo-400 hover:text-cyan-400 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* UNIFIED NAVIGATION BUTTONS */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/buyer/dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-900/40 border border-indigo-500/30 rounded-xl text-indigo-200 hover:text-cyan-400 hover:border-cyan-400/50 transition-all group text-sm font-bold"
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
                  
                  {/* Active Notification Badge */}
                  {cartContext?.itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-5 w-5 bg-cyan-500 border-2 border-[#0B1120] text-[9px] items-center justify-center font-extrabold text-[#0B1120]">
                        {cartContext.itemCount}
                      </span>
                    </span>
                  )}
                </Link>

                <button 
                  onClick={() => auth?.logout?.()}
                  className="flex items-center gap-2 px-4 py-2 bg-red-900/10 border border-red-500/20 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-400/50 transition-all group text-sm font-bold ml-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-indigo-200 hover:text-cyan-100 transition px-4 py-2">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-semibold bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 px-5 py-2.5 rounded-xl hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full font-sans p-6 md:py-12 relative z-10">
        
        {/* Smart Breadcrumbs */}
        <nav className="mb-10 text-sm text-indigo-300/60 flex items-center gap-2">
          <span 
            onClick={() => router.push('/marketplace')} 
            className="hover:text-cyan-400 cursor-pointer transition-colors"
          >
            Marketplace
          </span>
          <span>/</span>
          <span className="text-cyan-100 font-medium capitalize">{product.fabricType}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery */}
          <div className="flex flex-col gap-6">
            <div className="aspect-4/3 bg-[#0B1120]/50 border border-indigo-500/20 backdrop-blur-md rounded-3xl p-4 shadow-xl relative overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={selectedImage || "https://placehold.co/600x450/0f172a/38bdf8?text=No+Image"} 
                alt={product.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-2xl" 
              />
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-4">
                {product.images.map((img) => (
                  <div 
                    key={img} 
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden p-1 ${selectedImage === img ? 'border-cyan-400 bg-indigo-900/30 shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'border-transparent hover:border-indigo-500/50 bg-[#0B1120]/50'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Information & Action Panel */}
          <div className="flex flex-col gap-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-cyan-400 text-xs font-extrabold uppercase tracking-widest mb-4">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
                {product.fabricType}
              </span>
              <h1 className="text-4xl font-extrabold text-cyan-50 tracking-tighter leading-tight mb-3 drop-shadow-md">
                {product.title}
              </h1>
              <p className="text-sm text-indigo-200/80 font-medium">
                Supplied by <span className="text-cyan-400 font-bold hover:underline cursor-pointer">{product.supplier?.name || "Verified Mill"}</span>
              </p>
            </div>

            {/* Pricing and Stock Panel */}
            <div className="bg-[#0B1120]/60 backdrop-blur-xl p-8 rounded-3xl border border-indigo-500/20 shadow-2xl">
              <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
                  <div>
                      <span className="text-5xl font-extrabold text-cyan-50 tracking-tight drop-shadow-lg">${product.price}</span>
                      <span className="text-lg font-bold text-indigo-300/70">/meter (MOQ: {product.moq || 1}m)</span>
                  </div>
                  <div className={`text-sm font-bold flex items-center gap-2 ${product.availableStock > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      <span className={`w-3 h-3 rounded-full ${product.availableStock > 0 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}></span>
                      {product.availableStock > 0 ? `${product.availableStock} meters available` : "Not in stock"}
                  </div>
              </div>
              
              {/* Quantity Selector */}
              {product.availableStock > 0 && (
                  <div className="mb-8 border-t border-b border-indigo-500/20 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="text-lg font-bold text-cyan-50">Order Amount (meters)</label>
                    <div className="flex items-center gap-2 bg-indigo-950/50 rounded-full p-1 border border-indigo-500/30 max-w-50 w-full justify-between">
                      <button 
                        onClick={() => setQuantity(q => Math.max(product.moq || 1, q - 1))}
                        className="w-10 h-10 rounded-full bg-indigo-900/50 text-cyan-50 font-bold flex items-center justify-center hover:bg-indigo-800 transition border border-indigo-500/30 disabled:opacity-30"
                        disabled={quantity <= (product.moq || 1)}
                      >—</button>
                      <span className="text-xl font-extrabold text-cyan-50 px-4">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => Math.min(product.availableStock, q + 1))}
                        className="w-10 h-10 rounded-full bg-indigo-900/50 text-cyan-50 font-bold flex items-center justify-center hover:bg-indigo-800 transition border border-indigo-500/30 disabled:opacity-30"
                        disabled={quantity >= product.availableStock}
                      >+</button>
                    </div>
                  </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("Please log in or create an account to start sourcing fabrics!");
                      router.push("/login");
                      return;
                    }
                    if (cartContext && product) {
                      cartContext.addToCart({
                        productId: product._id,
                        title: product.title,
                        price: product.price,
                        quantity: quantity,
                        image: selectedImage,
                        supplierId: product.supplier?._id || "unknown",
                        moq: product.moq || 1
                      });
                      alert("Added to cart successfully!");
                    }
                  }}
                  className="flex-1 bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-8 py-5 rounded-2xl text-lg font-bold hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                  disabled={product.availableStock === 0}
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Add to Cart
                </button>
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      router.push("/login");
                    } else {
                      alert("Sample request sent to supplier!");
                    }
                  }}
                  className="bg-indigo-900/40 text-cyan-100 border border-indigo-500/30 px-8 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-800/50 hover:border-cyan-400/50 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-md"
                >
                  Request Sample
                </button>
              </div>
            </div>

            {/* Description and Specs Tabs/Info */}
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-bold text-cyan-50 drop-shadow-md">Evaluating this Fabric</h2>
              <p className="text-indigo-200/80 text-md leading-relaxed whitespace-pre-line">{product.description}</p>
              
              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-3 gap-6 bg-[#0B1120]/40 p-6 rounded-2xl border border-indigo-500/20 mt-4 backdrop-blur-sm">
                  <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-1">Width</span>
                      <span className="text-sm font-bold text-cyan-50 capitalize">{product.specifications?.width || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-1">Weight</span>
                      <span className="text-sm font-bold text-cyan-50 capitalize">{product.specifications?.weight || 'N/A'}</span>
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-1">Composition</span>
                      <span className="text-sm font-bold text-cyan-50 capitalize">{product.specifications?.composition || 'N/A'}</span>
                  </div>
              </div>
              
              {/* Available Colors */}
              {product.availableColors && product.availableColors.length > 0 && (
                  <div className="mt-2">
                      <span className="text-sm font-bold text-indigo-300 mb-3 block">Available Color Palette</span>
                      <div className="flex items-center gap-2 flex-wrap">
                          {product.availableColors.map(color => (
                              <span key={color} className="text-xs font-bold bg-indigo-950/60 border border-indigo-500/30 text-cyan-100 px-4 py-2 rounded-full shadow-sm capitalize">
                                  {color}
                              </span>
                          ))}
                      </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Inline Footer */}
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