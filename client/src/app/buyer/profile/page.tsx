/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function BuyerProfile() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const user = auth?.user;
  const actualToken = auth?.token;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessType: "",
    industry: "",
    preferredFabrics: "",
    categoriesOfInterest: "",
    typicalOrderQuantity: "",
    budgetRange: "",
    additionalPreferences: ""
  });

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (user) {
      const prefs = user.preferences || {};
      setFormData({
        name: user.name || "",
        email: user.email || "",
        businessType: prefs.businessType || "",
        industry: prefs.industry || "",
        preferredFabrics: Array.isArray(prefs.preferredFabrics) ? prefs.preferredFabrics.join(", ") : (prefs.preferredFabrics || ""),
        categoriesOfInterest: Array.isArray(prefs.categoriesOfInterest) ? prefs.categoriesOfInterest.join(", ") : (prefs.categoriesOfInterest || ""),
        typicalOrderQuantity: prefs.typicalOrderQuantity || "",
        budgetRange: prefs.budgetRange || "",
        additionalPreferences: prefs.additionalPreferences || ""
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");
    
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/onboard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${actualToken}`
        },
        body: JSON.stringify({
          userId: user._id,
          preferences: {
            businessType: formData.businessType,
            industry: formData.industry,
            categoriesOfInterest: formData.categoriesOfInterest.split(',').map(s => s.trim()).filter(Boolean),
            preferredFabrics: formData.preferredFabrics.split(',').map(s => s.trim()).filter(Boolean),
            typicalOrderQuantity: formData.typicalOrderQuantity,
            budgetRange: formData.budgetRange,
            additionalPreferences: formData.additionalPreferences
          }
        }),
      });

      if (res.ok) {
        const result = await res.json();
        
        const updatedUser = { 
          ...user, 
          preferences: result.data || result.preferences 
        };
        auth.login(updatedUser, actualToken);

        setSuccessMessage("Profile and sourcing preferences updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="p-10 text-cyan-50 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">My Profile & Settings</h1>
        <p className="text-indigo-300/80 mt-1">Review and update the sourcing preferences extracted by our AI.</p>
      </header>

      {successMessage && (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm font-medium">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 pb-12">
        <div className="bg-[#0B1120]/60 backdrop-blur-md p-8 rounded-3xl border border-indigo-500/20 shadow-xl">
          <h2 className="text-xl font-bold text-cyan-50 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Account Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                disabled
                className="w-full bg-slate-900/40 border border-indigo-500/20 text-indigo-300 rounded-xl px-4 py-3 cursor-not-allowed opacity-70" 
              />
            </div>
          </div>
        </div>

        <div className="bg-[#0B1120]/60 backdrop-blur-md p-8 rounded-3xl border border-indigo-500/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-cyan-50 flex items-center gap-2">
              <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Sourcing Preferences
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Business Type</label>
              <input 
                type="text" 
                name="businessType"
                value={formData.businessType} 
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Industry / Niche</label>
              <input 
                type="text" 
                name="industry"
                value={formData.industry} 
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all" 
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Preferred Fabrics (Comma separated)</label>
              <input 
                type="text" 
                name="preferredFabrics"
                value={formData.preferredFabrics} 
                onChange={handleChange}
                placeholder="e.g. Organic Cotton, Mulberry Silk"
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all" 
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Categories of Interest (Comma separated)</label>
              <input 
                type="text" 
                name="categoriesOfInterest"
                value={formData.categoriesOfInterest} 
                onChange={handleChange}
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Typical Order Quantity</label>
              <input 
                type="text" 
                name="typicalOrderQuantity"
                value={formData.typicalOrderQuantity} 
                onChange={handleChange}
                placeholder="e.g. 50-100 meters"
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Budget Range</label>
              <input 
                type="text" 
                name="budgetRange"
                value={formData.budgetRange} 
                onChange={handleChange}
                placeholder="e.g. $15 - $30 / meter"
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-medium" 
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400/70 mb-2">Additional Requirements</label>
              <textarea 
                name="additionalPreferences"
                value={formData.additionalPreferences} 
                onChange={handleChange}
                rows={3}
                className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 transition-all resize-none" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isSaving}
            className="bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-8 py-4 rounded-2xl font-bold hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </button>
        </div>

      </form>
    </div>
  );
}