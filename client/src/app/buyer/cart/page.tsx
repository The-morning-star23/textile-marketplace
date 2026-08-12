/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useContext } from "react";
import Link from "next/link";
import { CartContext } from "../../../context/CartContext";

export default function BuyerCart() {
  const cartContext = useContext(CartContext) as any;

  if (!cartContext) {
    return <div className="p-10 text-cyan-50 text-center animate-pulse">Loading cart...</div>;
  }

  const { cart, removeFromCart, updateQuantity, cartTotal } = cartContext;

  const handleDecrease = (productId: string, currentQuantity: number, moq: number) => {
    // Prevent going below MOQ, or below 1 if no MOQ is set
    const minimum = moq || 1;
    if (currentQuantity > minimum) {
      updateQuantity(productId, currentQuantity - 1);
    }
  };

  const handleIncrease = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  // Smart input handlers for direct typing
  const handleInputChange = (productId: string, value: string) => {
    if (value === "") {
      // Temporarily set to 0 so they can clear the box and type a new number
      updateQuantity(productId, 0);
      return;
    }
    const val = parseInt(value);
    if (!isNaN(val)) {
      updateQuantity(productId, val);
    }
  };

  const handleInputBlur = (productId: string, currentQuantity: number, moq: number) => {
    // When they click away, ensure the number respects the Minimum Order Quantity
    const minimum = moq || 1;
    if (currentQuantity < minimum) {
      updateQuantity(productId, minimum);
    }
  };

  // Mock standard shipping rules for B2B wholesale
  const shippingCost = cartTotal > 5000 ? 0 : cartTotal > 0 ? 150 : 0;
  const finalTotal = cartTotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">Your Sourcing Cart</h1>
        <p className="text-indigo-300/80 mt-1">Review your fabric selections and proceed to checkout.</p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-24 bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 shadow-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl border border-indigo-500/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-cyan-50">Your cart is empty</h2>
          <p className="text-indigo-300/70 mt-2 mb-8 max-w-md text-center">
            Looks like you have not added any fabrics to your cart yet.
          </p>
          <Link href="/marketplace" className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-8 py-3.5 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all">
            Start Sourcing Now
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3 space-y-4">
            {cart.map((item: any) => (
              <div key={item.productId} className="bg-[#0B1120]/60 backdrop-blur-md rounded-3xl border border-indigo-500/20 p-5 shadow-xl flex flex-col sm:flex-row gap-6 items-center">
                
                {/* Image */}
                <div className="w-full sm:w-32 h-32 bg-slate-900 rounded-2xl overflow-hidden shrink-0 border border-indigo-500/30 relative group">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-indigo-400/50 font-bold uppercase">No Image</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link href={`/product/${item.productId}`} className="font-extrabold text-cyan-50 text-xl hover:text-cyan-400 transition-colors line-clamp-1">
                        {item.title}
                      </Link>
                      
                      {/* Show the selected color in the cart! */}
                      {item.color && item.color !== "Standard" && (
                        <p className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-wider">{item.color}</p>
                      )}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="p-2 text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                      title="Remove from cart"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-emerald-400 font-bold mb-4">${item.price.toFixed(2)} <span className="text-indigo-400 font-medium text-xs">/ meter</span></p>

                  <div className="flex flex-wrap items-center gap-6 mt-auto">
                    {/* Smart Quantity Controls (Buttons + Typing) */}
                    <div className="flex items-center bg-indigo-900/30 border border-indigo-500/30 rounded-xl overflow-hidden">
                      <button 
                        onClick={() => handleDecrease(item.productId, item.quantity, item.moq)}
                        disabled={item.quantity <= (item.moq || 1)}
                        className="px-4 py-2 text-cyan-400 hover:bg-indigo-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                      </button>
                      
                      <input 
                        type="number"
                        value={item.quantity === 0 ? "" : item.quantity}
                        onChange={(e) => handleInputChange(item.productId, e.target.value)}
                        onBlur={() => handleInputBlur(item.productId, item.quantity, item.moq)}
                        className="w-20 py-2 bg-transparent font-bold text-cyan-50 text-center border-x border-indigo-500/30 outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      
                      <button 
                        onClick={() => handleIncrease(item.productId, item.quantity)}
                        className="px-4 py-2 text-cyan-400 hover:bg-indigo-500/20 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>

                    <div className="text-sm">
                      <span className="text-indigo-300/60 font-medium">Subtotal: </span>
                      <span className="text-cyan-50 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {item.quantity === item.moq && (
                    <p className="text-xs text-amber-400/80 mt-3 font-medium">
                      * Minimum Order Quantity (MOQ) reached.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sticky Card */}
          <div className="w-full lg:w-1/3 sticky top-28 bg-[#0B1120]/80 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-cyan-50 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-300/80 font-medium">Subtotal</span>
                <span className="text-cyan-50 font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-300/80 font-medium">Estimated Freight / Shipping</span>
                <span className="text-cyan-50 font-bold">{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-indigo-400/60 mt-1">Free shipping on wholesale orders over $5,000</p>
              )}
            </div>
            
            <div className="pt-6 border-t border-indigo-500/20 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-base font-bold text-indigo-200">Total Order</span>
                <span className="text-3xl font-extrabold text-emerald-400">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <Link 
              href="/buyer/checkout"
              className="w-full bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center justify-center gap-2"
            >
              Secure Checkout
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-indigo-300/50">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              SSL Encrypted Checkout
            </div>
          </div>

        </div>
      )}
    </div>
  );
}