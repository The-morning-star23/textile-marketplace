/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CartContext } from "../../../context/CartContext";
import { AuthContext } from "../../../context/AuthContext";

export default function CheckoutPage() {
  const router = useRouter();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartContext = useContext(CartContext) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Shipping Form State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    companyName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  // Redirect if cart is empty and order hasn't been placed
  useEffect(() => {
    if (cartContext?.cart.length === 0 && !orderPlaced) {
      router.push("/buyer/cart");
    }
  }, [cartContext?.cart.length, orderPlaced, router]);

  if (!cartContext) return null;

  const { cart, cartTotal, clearCart } = cartContext;
  const shippingCost = cartTotal > 5000 ? 0 : cartTotal > 0 ? 150 : 0;
  const finalTotal = cartTotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = auth?.token;
      const buyerId = auth?.user?._id;

      if (token && buyerId) {
        // We format the address into a single string for the database
        const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}, ${shippingInfo.country}`;
        
        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ 
            items: cart, 
            shippingAddress: fullAddress
          })
        });

        if (!response.ok) throw new Error("Failed to place order");
      }
      
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong placing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= ORDER CONFIRMATION SCREEN =================
  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 font-sans min-h-[70vh] flex items-center justify-center">
        <div className="bg-[#0B1120]/80 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)] w-full relative overflow-hidden">
          {/* Confetti / Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-emerald-500/20 rounded-full border-2 border-emerald-400 flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-cyan-50 tracking-tighter mb-4">Order Confirmed!</h1>
          <p className="text-lg text-indigo-200/80 mb-2">Thank you for sourcing with ThreadMarket.</p>
          <p className="text-sm text-indigo-400/60 mb-10 max-w-md mx-auto">
            Your order has been successfully placed. We will review your requirements and an invoice will be sent to <strong>{shippingInfo.email || 'your email'}</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/buyer/orders" 
              className="bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
            >
              View My Orders
            </Link>
            <Link 
              href="/marketplace" 
              className="bg-indigo-900/40 text-cyan-100 border border-indigo-500/30 px-8 py-3.5 rounded-xl font-bold hover:bg-indigo-800/50 hover:border-cyan-400/50 transition-all"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= CHECKOUT FORM SCREEN =================
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans relative">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">Secure Checkout</h1>
        <p className="text-indigo-300/80 mt-1">Review your items and enter your shipping details.</p>
      </header>

      <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT COLUMN: Shipping Information */}
        <div className="w-full lg:w-2/3 space-y-8">
          
          <div className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-8 shadow-xl">
            <h2 className="text-xl font-bold text-cyan-50 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-cyan-400 border border-indigo-500/30">1</span>
              Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Full Name</label>
                <input required type="text" name="fullName" value={shippingInfo.fullName} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Company Name</label>
                <input required type="text" name="companyName" value={shippingInfo.companyName} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="Apparel Co." />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Email Address</label>
                <input required type="email" name="email" value={shippingInfo.email} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="john@company.com" />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Street Address</label>
                <input required type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="123 Warehouse Row" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">City</label>
                <input required type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="Los Angeles" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">State / Province</label>
                <input required type="text" name="state" value={shippingInfo.state} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="CA" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">ZIP / Postal Code</label>
                <input required type="text" name="zipCode" value={shippingInfo.zipCode} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" placeholder="90001" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Country</label>
                <select required name="country" value={shippingInfo.country} onChange={handleInputChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all appearance-none">
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-8 shadow-xl opacity-75">
            <h2 className="text-xl font-bold text-cyan-50 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600/30 flex items-center justify-center text-cyan-400 border border-indigo-500/30">2</span>
              Payment Method
            </h2>
            <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div>
                <h3 className="text-cyan-50 font-bold">Standard B2B Invoice</h3>
                <p className="text-xs text-indigo-300/80">Net 30 terms upon credit approval. No credit card required today.</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Order Summary & Placement */}
        <div className="w-full lg:w-1/3 sticky top-28 space-y-6">
          <div className="bg-[#0B1120]/80 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-cyan-50 mb-6 border-b border-indigo-500/20 pb-4">Order Review</h2>
            
            {/* Mini Cart Items */}
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {cart.map((item: any) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden border border-indigo-500/30 shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[8px] text-indigo-400/50 uppercase">No Img</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-cyan-50 line-clamp-1">{item.title}</h4>
                    
                    {/* ADDED: Color display in the checkout summary! */}
                    {item.color && item.color !== "Standard" && (
                      <p className="text-xs font-bold text-amber-400 my-0.5 uppercase tracking-wider">{item.color}</p>
                    )}
                    
                    <p className="text-xs text-indigo-300/80">Qty: {item.quantity} m</p>
                    <p className="text-sm font-bold text-emerald-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Calculations */}
            <div className="space-y-3 mb-6 pt-4 border-t border-indigo-500/20">
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-300/80 font-medium">Subtotal</span>
                <span className="text-cyan-50 font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-300/80 font-medium">Estimated Freight</span>
                <span className="text-cyan-50 font-bold">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-indigo-500/20 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-indigo-200">Total</span>
                <span className="text-3xl font-extrabold text-emerald-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-cyan-50 border-t-transparent rounded-full animate-spin"></div>
                  Processing Order...
                </>
              ) : (
                <>
                  Place Order Now
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
            <p className="text-center text-xs text-indigo-400/50 mt-4">By placing this order, you agree to our B2B Terms of Service.</p>
          </div>
        </div>
      </form>
    </div>
  );
}