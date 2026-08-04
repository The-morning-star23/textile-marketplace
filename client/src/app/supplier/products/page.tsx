"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

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
  const auth = useContext(AuthContext);
  
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

      // 1. Upload the image first if one was selected
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

      // 2. Create the product with the new image URL
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
          images: uploadedImageUrl ? [uploadedImageUrl] : [], // Attach the Cloudinary URL!
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
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">My Products</h1>
          <p className="text-slate-500 mt-2 text-lg">Manage your textile inventory and listings.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-md shadow-slate-900/10"
        >
          {showForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-50/80 backdrop-blur-md p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 mb-10 space-y-6">
          
          {/* New Image Upload Field */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Product Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-slate-200/80 bg-white/60 p-2.5 rounded-xl text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800 transition-all cursor-pointer" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Product Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-slate-200/80 bg-white/60 p-3.5 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-900 shadow-sm" placeholder="e.g. Premium Organic Cotton" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Fabric Type</label>
              <select name="fabricType" value={formData.fabricType} onChange={handleChange} className="w-full border border-slate-200/80 bg-white/60 p-3.5 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-900 shadow-sm">
                <option value="Cotton">Cotton</option>
                <option value="Silk">Silk</option>
                <option value="Linen">Linen</option>
                <option value="Polyester">Polyester</option>
                <option value="Wool">Wool</option>
                <option value="Blend">Blend</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Meter ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-slate-200/80 bg-white/60 p-3.5 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-900 shadow-sm" placeholder="12.50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Min. Order Quantity (Meters)</label>
              <input required type="number" name="moq" value={formData.moq} onChange={handleChange} className="w-full border border-slate-200/80 bg-white/60 p-3.5 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-900 shadow-sm" placeholder="100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-slate-200/80 bg-white/60 p-3.5 rounded-xl focus:ring-2 focus:ring-slate-400 outline-none transition-all text-slate-900 shadow-sm" rows={3} placeholder="Describe the fabric weave, weight, and best uses..."></textarea>
          </div>
          
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading & Saving..." : "Save Product"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-3 text-center py-16 bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 text-slate-500 shadow-sm">
            You haven&apos;t added any products yet.
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-slate-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 overflow-hidden flex flex-col hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300/80 transition-all duration-300">
              
              {/* Dynamic Image Rendering */}
              <div className="h-48 bg-slate-200/50 flex items-center justify-center text-slate-400 border-b border-slate-200/60 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-medium tracking-widest uppercase">[ No Image ]</span>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="font-bold text-slate-900 truncate">{product.title}</h3>
                  <span className="bg-slate-200/70 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md whitespace-nowrap">{product.fabricType}</span>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 mb-6 flex-1 leading-relaxed">{product.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-200/60 mt-auto">
                  <div className="font-extrabold text-lg text-slate-900">${product.price} <span className="text-xs text-slate-500 font-medium">/m</span></div>
                  <div className="text-xs text-slate-500 font-medium bg-white/50 px-2 py-1 rounded-md border border-slate-200/50">MOQ: {product.moq}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}