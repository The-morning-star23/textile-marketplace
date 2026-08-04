/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useContext, use } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  fabricType: string;
  price: number;
  moq: number;
  images: string[]; // <-- Added the images array!
  supplier: {
    _id: string;
    name: string;
  };
}

export default function ProductCheckout({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  
  const auth = useContext(AuthContext);
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(0);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setQuantity(data.moq);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !auth?.user) return;
    
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth?.token}`
        },
        body: JSON.stringify({
          buyer: auth.user._id,
          supplier: product.supplier._id,
          product: product._id,
          quantity: Number(quantity),
          totalPrice: Number(quantity) * product.price,
          shippingAddress: address
        }),
      });

      if (res.ok) {
        router.push("/buyer/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-8 text-center text-slate-500 font-medium animate-pulse">Loading product details...</div>;

  const totalPrice = (quantity * product.price).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/buyer/dashboard" className="text-slate-500 hover:text-slate-900 mb-8 inline-flex items-center gap-2 font-semibold transition-colors">
        &larr; Back to Marketplace
      </Link>
      
      {/* Premium Glass-Slate Card */}
      <div className="bg-slate-50/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/60 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left side: Product Info */}
        <div className="md:w-1/2 bg-slate-100/40 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col">
          
          {/* New Image Feature! */}
          {product.images && product.images.length > 0 && (
            <div className="w-full h-64 md:h-72 mb-8 rounded-2xl overflow-hidden border border-slate-200/60 shadow-inner">
              <img 
                src={product.images[0]} 
                alt={product.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          )}

          <div>
            <span className="bg-slate-200/80 text-slate-700 text-xs px-3 py-1.5 rounded-md font-bold uppercase tracking-wider w-max">
              {product.fabricType}
            </span>
            
            <h1 className="text-4xl font-extrabold text-slate-900 mt-5 mb-2 tracking-tight leading-tight">{product.title}</h1>
            <p className="text-slate-500 font-medium mb-8">Supplied by {product.supplier.name}</p>
            
            <div className="text-5xl font-extrabold text-slate-900 mb-8">
              ${product.price} <span className="text-xl text-slate-500 font-medium">/ meter</span>
            </div>
            
            <div className="prose prose-sm text-slate-600">
              <h3 className="text-slate-900 font-bold mb-2">Description</h3>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Right side: Checkout Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight">Place Your Order</h2>
          
          <form onSubmit={handleOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Order Quantity (Meters)
              </label>
              <input 
                type="number" 
                required 
                min={product.moq}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                className="w-full border border-slate-200/80 bg-white/60 p-4 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-slate-900 shadow-sm" 
              />
              <p className="text-xs text-slate-500 font-medium mt-2">
                Minimum order quantity is {product.moq} meters.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Shipping Address
              </label>
              <textarea 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="w-full border border-slate-200/80 bg-white/60 p-4 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-slate-400 outline-none transition-all text-slate-900 shadow-sm" 
                rows={3} 
                placeholder="123 Textile Avenue, Garment District..."
              ></textarea>
            </div>

            <div className="bg-slate-200/50 p-5 rounded-xl border border-slate-200/80 mt-8">
              <div className="flex justify-between items-center text-lg font-extrabold text-slate-900">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4 mt-4 rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}