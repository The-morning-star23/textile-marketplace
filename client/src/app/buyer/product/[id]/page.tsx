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
  supplier: {
    _id: string;
    name: string;
  };
}

export default function ProductCheckout({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the dynamic URL parameter in Next.js 16+
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
          setQuantity(data.moq); // Default the quantity to the Minimum Order Quantity
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
        // Order successful! Send them to their order history
        router.push("/buyer/orders");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="p-8 text-center animate-pulse">Loading product details...</div>;

  const totalPrice = (quantity * product.price).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/buyer/dashboard" className="text-indigo-600 hover:underline mb-6 inline-block font-medium">
        &larr; Back to Marketplace
      </Link>
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left side: Product Info */}
        <div className="md:w-1/2 bg-gray-50 p-8 border-r border-gray-100">
          <span className="bg-indigo-100 text-indigo-800 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            {product.fabricType}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">{product.title}</h1>
          <p className="text-gray-500 mb-6">Supplied by {product.supplier.name}</p>
          
          <div className="text-4xl font-bold text-indigo-600 mb-6">
            ${product.price} <span className="text-lg text-gray-500 font-normal">/ meter</span>
          </div>
          
          <div className="prose prose-sm text-gray-600">
            <h3 className="text-gray-900 font-semibold mb-2">Description</h3>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Right side: Checkout Form */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Place Your Order</h2>
          
          <form onSubmit={handleOrder} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Quantity (Meters)
              </label>
              <input 
                type="number" 
                required 
                min={product.moq}
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum order quantity is {product.moq} meters.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <textarea 
                required 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" 
                rows={3} 
                placeholder="123 Textile Avenue, Garment District..."
              ></textarea>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
              <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                <span>Total:</span>
                <span>${totalPrice}</span>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm & Pay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}