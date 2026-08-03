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
}

export default function SupplierProducts() {
  const auth = useContext(AuthContext);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fabricType: "Cotton",
    price: "",
    moq: "",
  });

  // Data fetching logic moved safely inside the effect
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
      if (!supplierId) return;
      
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          ...formData,
          supplier: supplierId,
          price: Number(formData.price),
          moq: Number(formData.moq),
          images: [],
        }),
      });

      if (res.ok) {
        const savedProduct = await res.json();
        setShowForm(false);
        setFormData({ title: "", description: "", fabricType: "Cotton", price: "", moq: "" });
        
        // Optimistically update the UI without needing a second network request
        setProducts((prevProducts) => [savedProduct, ...prevProducts]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          {showForm ? "Cancel" : "+ Add New Product"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="e.g. Premium Organic Cotton" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
              <select name="fabricType" value={formData.fabricType} onChange={handleChange} className="w-full border p-2 rounded-md">
                <option value="Cotton">Cotton</option>
                <option value="Silk">Silk</option>
                <option value="Linen">Linen</option>
                <option value="Polyester">Polyester</option>
                <option value="Wool">Wool</option>
                <option value="Blend">Blend</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per Meter ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="12.50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order Quantity (Meters)</label>
              <input required type="number" name="moq" value={formData.moq} onChange={handleChange} className="w-full border p-2 rounded-md" placeholder="100" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded-md" rows={3} placeholder="Describe the fabric weave, weight, and best uses..."></textarea>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
            Save Product
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-3 text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-500">
            You haven&apos;t added any products yet.
          </div>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                [ Image Placeholder ]
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900">{product.title}</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{product.fabricType}</span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                <div className="flex justify-between items-center border-t pt-4 mt-auto">
                  <div className="font-bold text-blue-600">${product.price} <span className="text-xs text-gray-500 font-normal">/m</span></div>
                  <div className="text-sm text-gray-500">MOQ: {product.moq}m</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}