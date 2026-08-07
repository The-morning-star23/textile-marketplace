"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";

export default function AddProductPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fabricType: "Cotton",
    price: "",
    moq: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplierId = auth?.user?._id;
      if (!supplierId || !auth?.token) return;
      
      setUploading(true);
      let uploadedImageUrl = "";

      // 1. Upload image first if selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);

        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${auth.token}` 
          },
          body: imageFormData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.imageUrl;
        } else {
          console.error("Failed to upload image to server");
        }
      }

      // 2. Create product
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
        router.push("/supplier/products");
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
    <div className="max-w-4xl mx-auto p-6 md:p-10 font-sans w-full z-10 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">List New Fabric</h1>
        <p className="text-indigo-300/80 mt-1">Add a new textile offering to your marketplace inventory.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0B1120]/80 backdrop-blur-2xl p-8 rounded-3xl border border-indigo-500/30 space-y-6 shadow-2xl">
        
        {/* Image Upload Field */}
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
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none transition-all text-cyan-50" rows={4} placeholder="Describe weave, weight, and best uses..."></textarea>
        </div>
        
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => router.push("/supplier/products")}
            className="w-1/3 bg-slate-800/60 border border-indigo-500/30 text-indigo-200 py-4 rounded-xl font-bold hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={uploading}
            className="w-2/3 bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-5 h-5 border-2 border-cyan-50 border-t-transparent rounded-full animate-spin"></div>
                Saving Product...
              </>
            ) : "Publish Product"}
          </button>
        </div>
      </form>
    </div>
  );
}