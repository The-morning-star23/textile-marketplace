/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  fabricType: string;
  price: number;
  moq: number;
  images: string[];
}

export default function SupplierProducts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fabricType: "Cotton",
    price: "",
    moq: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const supplierId = auth?.user?._id;
        if (!supplierId) return;

        const res = await fetch(`http://localhost:5000/api/products/supplier/${supplierId}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    if (auth?.user) {
      loadProducts();
    }
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplierId = auth?.user?._id;
      if (!supplierId || !auth?.token) return;
      
      setUploading(true);
      let uploadedImageUrl = "";

      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${auth.token}` },
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.imageUrl;
        }
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          ...formData,
          supplier: supplierId,
          price: Number(formData.price),
          moq: Number(formData.moq),
          images: uploadedImageUrl ? [uploadedImageUrl] : [],
        }),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        setShowForm(false);
        setFormData({ title: "", description: "", fabricType: "Cotton", price: "", moq: "" });
        setImageFile(null);
        setProducts((prevProducts) => [savedProduct, ...prevProducts]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-sans w-full z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">My Inventory</h1>
          <p className="text-indigo-300/80 mt-1">Manage your textile listings and product catalog.</p>
        </div>
        <Link 
          href="/supplier/products/new"
          className="bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2"
        >
          + List New Fabric
        </Link>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0B1120]/80 backdrop-blur-2xl p-8 rounded-3xl border border-indigo-500/30 mb-10 space-y-6 shadow-2xl">
          <h2 className="text-xl font-bold text-cyan-50 border-b border-indigo-500/20 pb-4">Product Details</h2>
          
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Product Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-indigo-500/30 bg-slate-900/60 p-2.5 rounded-xl text-cyan-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 transition-all cursor-pointer" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Product Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50" placeholder="e.g. Premium Organic Cotton" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Fabric Type</label>
              <select name="fabricType" value={formData.fabricType} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50">
                <option value="Cotton" className="bg-[#080C17]">Cotton</option>
                <option value="Silk" className="bg-[#080C17]">Silk</option>
                <option value="Linen" className="bg-[#080C17]">Linen</option>
                <option value="Polyester" className="bg-[#080C17]">Polyester</option>
                <option value="Wool" className="bg-[#080C17]">Wool</option>
                <option value="Blend" className="bg-[#080C17]">Blend</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Price per Meter ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50" placeholder="12.50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Min. Order Quantity (Meters)</label>
              <input required type="number" name="moq" value={formData.moq} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50" placeholder="100" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50" rows={3} placeholder="Describe weave, weight, and best uses..."></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-cyan-50 border-t-transparent rounded-full animate-spin"></div>
                Saving Product...
              </>
            ) : "Save Product"}
          </button>
        </form>
      )}

      {/* Product List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 text-indigo-300/80 shadow-xl">
            You haven&apos;t added any products yet. Click &quot;+ Add New Product&quot; to begin.
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-[#0B1120]/60 backdrop-blur-xl rounded-3xl border border-indigo-500/20 overflow-hidden flex flex-col hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl group">
              <div className="h-48 bg-slate-900/80 flex items-center justify-center text-indigo-400/50 border-b border-indigo-500/20 overflow-hidden relative">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-xs font-bold tracking-widest uppercase text-indigo-400/40">[ No Image ]</span>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-extrabold text-cyan-50 truncate text-lg">{product.title}</h3>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap">{product.fabricType}</span>
                </div>
                <p className="text-sm text-indigo-200/70 line-clamp-2 mb-6 flex-1 leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-indigo-500/20 mt-auto">
                  <div className="font-extrabold text-lg text-emerald-400">${product.price} <span className="text-xs text-indigo-300/60 font-medium">/m</span></div>
                  <div className="text-xs text-indigo-300 font-bold bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-500/30">MOQ: {product.moq}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}