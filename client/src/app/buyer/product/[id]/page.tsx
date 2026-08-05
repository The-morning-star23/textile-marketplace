/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";
import { CartContext } from "../../../../context/CartContext";

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
  const auth = useContext(AuthContext);
  const cartContext = useContext(CartContext);
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // 1. Fetch Product Data on Load
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (!res.ok) {
          throw new Error("Failed to load product.");
        }
        const data = await res.json();
        setProduct(data);
        // Set the main image to the first one available
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0]);
        }
      } catch (err) {
        console.error("Fetch Product Error:", err);
        setError("This fabric is currently unavailable. The inventory might be outdated.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-pulse flex gap-2.5 items-center text-indigo-500">
          <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
          <div className="w-4 h-4 bg-cyan-400 rounded-full delay-150"></div>
          <div className="w-4 h-4 bg-violet-400 rounded-full delay-300"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center bg-red-50 border border-red-200 rounded-3xl">
        <svg className="w-16 h-16 text-red-400 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h1 className="text-3xl font-extrabold text-red-900 mb-3">Product Not Found</h1>
        <p className="text-red-700 max-w-lg mx-auto mb-8">{error}</p>
        <button onClick={() => router.back()} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto font-sans">
      
      {/* Breadcrumbs */}
      <nav className="mb-10 text-sm text-slate-500 flex items-center gap-2">
        <span onClick={() => router.push('/buyer/dashboard')} className="hover:text-indigo-600 cursor-pointer transition-colors">Marketplace</span>
        <span>/</span>
        <span className="text-slate-900 font-medium capitalize">{product.fabricType}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-6">
          <div className="aspect-4/3 bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative overflow-hidden group">
            <img 
              src={selectedImage || "https://placehold.co/600x450/e2e8f0/1e293b?text=No+Image"} 
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
                  className={`aspect-square cursor-pointer rounded-xl border-2 transition overflow-hidden p-1 ${selectedImage === img ? 'border-indigo-500 bg-white shadow-md' : 'border-slate-100 hover:border-slate-300'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Information & Action Panel */}
        <div className="flex flex-col gap-10">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-extrabold uppercase tracking-widest mb-4 border border-indigo-200">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
              {product.fabricType}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-950 tracking-tighter leading-tight mb-3">
              {product.title}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Supplied by <span className="text-indigo-600 font-bold hover:underline cursor-pointer">{product.supplier?.name || "Verified Mill"}</span>
            </p>
          </div>

          {/* Pricing and Stock Panel */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5">
            <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
                <div>
                    <span className="text-5xl font-extrabold text-slate-950 tracking-tight">${product.price}</span>
                    <span className="text-lg font-bold text-slate-500">/meter (MOQ: {product.moq || 1}m)</span>
                </div>
                <div className={`text-sm font-bold flex items-center gap-2 ${product.availableStock > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                    <span className={`w-3 h-3 rounded-full ${product.availableStock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    {product.availableStock > 0 ? `${product.availableStock} meters available` : "Not in stock"}
                </div>
            </div>
            
            {/* Quantity Selector */}
            {product.availableStock > 0 && (
                <div className="mb-8 border-t border-b border-slate-100 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <label className="text-lg font-bold text-slate-900">Select Order Amount (meters)</label>
                  <div className="flex items-center gap-2 bg-slate-100 rounded-full p-1 border border-slate-200 max-w-50 w-full justify-between">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center hover:bg-slate-50 transition border border-slate-100 disabled:opacity-50"
                      disabled={quantity <= 1}
                    >—</button>
                    <span className="text-xl font-extrabold text-slate-950 px-4">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.availableStock, q + 1))}
                      className="w-10 h-10 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center hover:bg-slate-50 transition border border-slate-100 disabled:opacity-50"
                      disabled={quantity >= product.availableStock}
                    >+</button>
                  </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => {
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
                    alert("Added to cart!");
                  }
                }}
                className="flex-1 bg-indigo-600 text-white px-8 py-5 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:bg-indigo-300 flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/20"
                disabled={product.availableStock === 0}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
              <button 
                className="bg-slate-100 text-slate-900 px-8 py-5 rounded-2xl text-lg font-bold hover:bg-slate-200 transition-all duration-300 flex items-center justify-center gap-3 border border-slate-200"
              >
                Request Sample
              </button>
            </div>
          </div>

          {/* Description and Specs Tabs/Info */}
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-950">Evaluating this Fabric</h2>
            <p className="text-slate-600 text-md leading-relaxed whitespace-pre-line">{product.description}</p>
            
            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-3 gap-6 bg-slate-100/50 p-6 rounded-2xl border border-slate-100 mt-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Width</span>
                    <span className="text-sm font-bold text-slate-950 capitalize">{product.specifications?.width || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Weight</span>
                    <span className="text-sm font-bold text-slate-950 capitalize">{product.specifications?.weight || 'N/A'}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Composition</span>
                    <span className="text-sm font-bold text-slate-950 capitalize">{product.specifications?.composition || 'N/A'}</span>
                </div>
            </div>
            
            {/* Available Colors */}
            {product.availableColors && product.availableColors.length > 0 && (
                <div className="mt-2">
                    <span className="text-sm font-bold text-slate-500 mb-2 block">Available Color Palette</span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {product.availableColors.map(color => (
                            <span key={color} className="text-xs font-bold bg-white border border-slate-200 text-slate-800 px-3 py-1.5 rounded-full shadow-sm capitalize">
                                {color}
                            </span>
                        ))}
                    </div>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}