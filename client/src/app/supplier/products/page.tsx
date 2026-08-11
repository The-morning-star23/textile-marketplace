/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../../context/AuthContext";

interface Product {
  _id: string;
  title: string;
  description: string;
  fabricType: string;
  price: number;
  moq: number;
  availableStock: number; // Added to track exact quantity
  images: string[];
  inStock?: boolean; 
}

export default function SupplierProducts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const supplierId = auth?.user?._id;
        if (!supplierId) return;

        const res = await fetch(`http://localhost:5000/api/products/supplier/${supplierId}`);
        if (res.ok) {
          const data = await res.json();
          // Map backend data to ensure inStock defaults to true if undefined
          setProducts(data.map((p: Product) => ({ ...p, inStock: p.inStock ?? true })));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (auth?.user) {
      loadProducts();
    }
  }, [auth]);

  // DELETE PRODUCT LOGIC
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${auth.token}` }
      });

      if (res.ok) {
        setProducts(products.filter(product => product._id !== id));
      } else {
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // TOGGLE IN-STOCK LOGIC
  const handleToggleStock = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update for instant feedback
      setProducts(products.map(p => p._id === id ? { ...p, inStock: !currentStatus } : p));

      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}` 
        },
        body: JSON.stringify({ inStock: !currentStatus })
      });

      if (!res.ok) {
        // Revert if API fails
        setProducts(products.map(p => p._id === id ? { ...p, inStock: currentStatus } : p));
        alert("Failed to update inventory status.");
      }
    } catch (error) {
      console.error("Error updating stock status:", error);
      setProducts(products.map(p => p._id === id ? { ...p, inStock: currentStatus } : p));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans w-full z-10 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">My Inventory</h1>
          <p className="text-indigo-300/80 mt-1">Manage your textile listings and product catalog.</p>
        </div>
        <Link 
          href="/supplier/products/new"
          className="bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Add New Product
        </Link>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20 text-emerald-400/70 font-bold animate-pulse">
          <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4"></div>
          Loading Inventory...
        </div>
      ) : (
        /* Product List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 text-indigo-300/80 shadow-xl">
              You haven&apos;t added any products yet. Click &quot;Add New Product&quot; to begin.
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id} className={`bg-[#0B1120]/60 backdrop-blur-xl rounded-3xl border ${product.inStock ? 'border-indigo-500/20 hover:border-emerald-500/40' : 'border-red-500/20 opacity-75 grayscale-30'} overflow-hidden flex flex-col hover:-translate-y-1 transition-all duration-300 shadow-xl group`}>
                
                {/* Product Image & Badges */}
                <div className="h-48 bg-slate-900/80 flex items-center justify-center text-indigo-400/50 border-b border-indigo-500/20 overflow-hidden relative">
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-[#0B1120]/60 z-10 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="bg-red-500 text-white font-extrabold px-4 py-1.5 rounded-lg uppercase tracking-widest text-sm shadow-lg shadow-red-500/30">Out of Stock</span>
                    </div>
                  )}
                  {product.images && product.images.length > 0 ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-xs font-bold tracking-widest uppercase text-indigo-400/40">[ No Image ]</span>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className={`font-extrabold truncate text-lg ${product.inStock ? 'text-cyan-50' : 'text-indigo-200'}`}>{product.title}</h3>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap">{product.fabricType}</span>
                  </div>
                  <p className="text-sm text-indigo-200/70 line-clamp-2 mb-4 flex-1 leading-relaxed">{product.description}</p>
                  
                  <div className="flex justify-between items-end mb-6">
                    <div className="font-extrabold text-xl text-emerald-400">${product.price} <span className="text-xs text-indigo-300/60 font-medium">/m</span></div>
                    
                    {/* MOQ & Stock Numbers */}
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="text-xs text-indigo-300 font-bold bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-500/30">
                        MOQ: {product.moq}m
                      </div>
                      <div className={`text-xs font-bold px-3 py-1 rounded-md border ${product.availableStock < product.moq ? 'bg-red-950/60 text-red-300 border-red-500/30' : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'}`}>
                        Stock: {product.availableStock || 0}m
                      </div>
                    </div>
                  </div>

                  {/* Management Controls */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-indigo-500/20 mt-auto">
                    
                    {/* Toggle Stock Button */}
                    <button 
                      onClick={() => handleToggleStock(product._id, product.inStock || false)}
                      className={`col-span-1 flex flex-col xl:flex-row items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold border transition-colors ${product.inStock ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'}`}
                      title={product.inStock ? "Mark Out of Stock" : "Mark In Stock"}
                    >
                      {product.inStock ? (
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      ) : (
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      )}
                      <span>Stock</span>
                    </button>

                    {/* Edit Button */}
                    <Link 
                      href={`/supplier/products/${product._id}/edit`}
                      className="col-span-1 flex flex-col xl:flex-row items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <span>Edit</span>
                    </Link>

                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(product._id)}
                      className="col-span-1 flex flex-col xl:flex-row items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      <span>Delete</span>
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