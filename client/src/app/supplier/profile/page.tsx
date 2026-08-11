"use client";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";

export default function SupplierProfilePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const actualToken = auth?.token;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const [profileData, setProfileData] = useState({
    businessName: "",
    businessType: "",
    contactEmail: "",
    phoneNumber: "",
    businessAddress: "",
    operatingHours: "",
    productCategories: "",
    fabricTypes: "",
    moq: "",
    gstinNumber: "",
    website: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/supplier/profile", {
          headers: { "Authorization": `Bearer ${actualToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData({
            businessName: data.businessName || "",
            businessType: data.businessType || "",
            contactEmail: data.email || data.contactEmail || "",
            phoneNumber: data.phoneNumber || "",
            businessAddress: data.businessAddress || "",
            operatingHours: data.operatingHours || "",
            // Convert arrays back to comma-separated strings for the input fields
            productCategories: Array.isArray(data.productCategories) ? data.productCategories.join(", ") : (data.productCategories || ""),
            fabricTypes: Array.isArray(data.fabricTypes) ? data.fabricTypes.join(", ") : (data.fabricTypes || ""),
            moq: data.moq || "",
            gstinNumber: data.gstinNumber || "",
            website: data.website || "",
          });
        }
      } catch (error) {
        console.error("Error fetching supplier profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (actualToken) {
      fetchProfile();
    }
  }, [actualToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/supplier/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${actualToken}`,
        },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060913] text-cyan-50 flex items-center justify-center">
        <p className="text-indigo-300 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#060913] text-cyan-50 overflow-x-hidden p-6 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-cyan-50">My Profile</h1>
          <p className="text-indigo-300/80 mt-1">Manage your business details, inventory specialties, and operating hours.</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-xl text-sm font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0B1120]/80 backdrop-blur-2xl p-8 rounded-3xl border border-indigo-500/30 space-y-8 shadow-2xl">
          
          {/* Business & Contact Information */}
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-indigo-500/20 pb-2">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Business Name</label>
                <input required type="text" name="businessName" value={profileData.businessName} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Business Type</label>
                <select name="businessType" value={profileData.businessType} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50 appearance-none">
                  <option value="">Select Type...</option>
                  <option value="Manufacturer / Mill">Manufacturer / Mill</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Distributor">Distributor</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Contact Email</label>
                <input required type="email" name="contactEmail" value={profileData.contactEmail} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Phone Number</label>
                <input required type="text" name="phoneNumber" value={profileData.phoneNumber} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
            </div>
          </div>

          {/* Specialties & Inventory Specs */}
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-indigo-500/20 pb-2">Inventory Capabilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Product Categories (Comma Separated)</label>
                <input type="text" name="productCategories" value={profileData.productCategories} onChange={handleChange} placeholder="e.g. Apparel, Home Decor, Industrial" className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Fabric Types (Comma Separated)</label>
                <input type="text" name="fabricTypes" value={profileData.fabricTypes} onChange={handleChange} placeholder="e.g. Silk, Organic Cotton" className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Standard MOQ</label>
                <input type="text" name="moq" value={profileData.moq} onChange={handleChange} placeholder="e.g. 500 meters" className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
            </div>
          </div>

          {/* Location & Additional Details */}
          <div>
            <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-indigo-500/20 pb-2">Location & Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Business Address</label>
                <textarea required name="businessAddress" value={profileData.businessAddress} onChange={handleChange} rows={2} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Operating Hours</label>
                <input required type="text" name="operatingHours" value={profileData.operatingHours} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Tax ID / GSTIN</label>
                <input type="text" name="gstinNumber" value={profileData.gstinNumber} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Website (Optional)</label>
                <input type="text" name="website" value={profileData.website} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-indigo-500/20">
            <button type="submit" disabled={saving} className="w-full bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer">
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}