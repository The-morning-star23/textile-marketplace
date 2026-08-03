"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message);
      
      if (authContext) {
        authContext.login(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join Marketplace</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email Address" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="w-full p-2 border rounded"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          
          <select className="w-full p-2 border rounded bg-white"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
            <option value="buyer">I am a Buyer</option>
            <option value="supplier">I am a Supplier</option>
          </select>

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
            Create Account
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </div>
    </div>
  );
}