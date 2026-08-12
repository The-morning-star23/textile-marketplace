/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useState, useEffect, ReactNode } from "react";

// Define what a single item in the cart looks like
export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  supplierId: string;
  moq: number;
  color?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage when the app starts
  useEffect(() => {
    const savedCart = localStorage.getItem("threadmarket_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart from local storage", e);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("threadmarket_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (newItem: CartItem) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItemIndex = prevCart.findIndex((item) => item.productId === newItem.productId);
      
      if (existingItemIndex >= 0) {
        // If it exists, just update the quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return updatedCart;
      }
      
      // If it's new, add it to the array
      return [...prevCart, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => 
      prevCart.map((item) => 
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // FIX: itemCount is now just the number of unique products in the cart!
  const itemCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};