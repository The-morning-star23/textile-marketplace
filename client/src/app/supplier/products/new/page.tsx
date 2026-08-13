"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../../context/AuthContext";

// Interface for our new Color Variant
interface ColorVariant {
  name: string;
  hexCode: string;
  imageFile: File | null;
}

export default function AddProductPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  
  const [uploading, setUploading] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  
  // Dynamic Color Variants Array
  const [colors, setColors] = useState<ColorVariant[]>([
    { name: "", hexCode: "#ffffff", imageFile: null }
  ]);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fabricType: "Cotton",
    price: "",
    moq: "",
    availableStock: "",
    width: "",
    weight: "",
    composition: "",
  });

  const handleAddColor = () => {
    setColors([...colors, { name: "", hexCode: "#ffffff", imageFile: null }]);
  };

  const handleRemoveColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleColorChange = (index: number, field: keyof ColorVariant, value: any) => {
    const updatedColors = [...colors];
    updatedColors[index] = { ...updatedColors[index], [field]: value };
    setColors(updatedColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supplierId = auth?.user?._id; 
      const actualToken = auth?.token;      

      if (!supplierId || !actualToken) return alert("Error: Missing auth data. Please log in again.");
      
      setUploading(true);
      let mainImageUrl = "";

      // 1. Helper function to upload a single image to your backend
      const uploadSingleImage = async (file: File) => {
        const imageFormData = new FormData();
        imageFormData.append("image", file);
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/upload", {
          method: "POST",
          headers: { "Authorization": `Bearer ${actualToken}` },
          body: imageFormData,
        });
        if (res.ok) {
          const data = await res.json();
          return data.imageUrl;
        }
        return "";
      };

      // 2. Upload Main Image
      if (mainImageFile) {
        mainImageUrl = await uploadSingleImage(mainImageFile);
      }

      // 3. Upload all Color Variant Images simultaneously
      const processedColors = await Promise.all(
        colors.map(async (color) => {
          let variantImageUrl = "";
          if (color.imageFile) {
            variantImageUrl = await uploadSingleImage(color.imageFile);
          }
          return {
            name: color.name,
            hexCode: color.hexCode,
            imageUrl: variantImageUrl
          };
        })
      );

      // Filter out empty colors
      const finalColors = processedColors.filter(c => c.name.trim() !== "");

      // 4. Create product in database
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/products", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${actualToken}` 
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fabricType: formData.fabricType,
          supplier: supplierId,
          price: Number(formData.price),
          moq: Number(formData.moq),
          availableStock: Number(formData.availableStock),
          availableColors: finalColors,
          specifications: {
            width: formData.width || "N/A",
            weight: formData.weight || "N/A",
            composition: formData.composition || "N/A",
          },
          images: mainImageUrl ? [mainImageUrl] : [],
        }),
      });

      if (res.ok) {
        router.push("/supplier/products");
      } else {
        console.error("Failed to save product to database");
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

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 font-sans w-full z-10 relative">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-cyan-50 tracking-tighter">List New Fabric</h1>
        <p className="text-indigo-300/80 mt-1">Add a new textile offering with color variants.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#0B1120]/80 backdrop-blur-2xl p-8 rounded-3xl border border-indigo-500/30 space-y-8 shadow-2xl">
        
        {/* Basic Details */}
        <div>
          <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-indigo-500/20 pb-2">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Product Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Fabric Type</label>
              <select name="fabricType" value={formData.fabricType} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50">
                <option value="Cotton" className="bg-[#080C17]">Cotton</option>
                <option value="Silk" className="bg-[#080C17]">Silk</option>
                <option value="Linen" className="bg-[#080C17]">Linen</option>
                <option value="Polyester" className="bg-[#080C17]">Polyester</option>
                <option value="Wool" className="bg-[#080C17]">Wool</option>
                <option value="Blend" className="bg-[#080C17]">Blend</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Price per Meter ($)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Main Product Image (Default)</label>
              <input 
                type="file" accept="image/*"
                onChange={(e) => setMainImageFile(e.target.files ? e.target.files[0] : null)}
                className="w-full border border-indigo-500/30 bg-slate-900/60 p-2.5 rounded-xl text-cyan-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-cyan-500/20 file:text-cyan-400 cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* Dynamic Color Variants Section */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-indigo-500/20 pb-2">
            <h2 className="text-lg font-bold text-cyan-400">Color Variants & Images</h2>
            <button type="button" onClick={handleAddColor} className="text-xs font-bold bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/30 transition-colors">
              + Add Another Color
            </button>
          </div>
          
          <div className="space-y-4">
            {colors.map((color, index) => (
              <div key={index} className="bg-slate-900/40 border border-indigo-500/30 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-end relative">
                
                {/* Remove Button */}
                {colors.length > 1 && (
                  <button type="button" onClick={() => handleRemoveColor(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}

                {/* 1. Color Name */}
                <div className="w-full md:w-1/3">
                  <label className="block text-xs font-bold text-indigo-300 uppercase mb-1">Color Name</label>
                  <input 
                    type="text" 
                    value={color.name} 
                    onChange={(e) => handleColorChange(index, "name", e.target.value)} 
                    placeholder="e.g., Champagne Silk"
                    className="w-full bg-[#0B1120] text-cyan-50 border border-indigo-500/30 rounded-lg p-2 text-xs focus:outline-none focus:border-cyan-400 transition-colors" 
                  />
                </div>

                {/* 2. Swatch Hex */}
                <div className="w-full md:w-1/3">
                  <label className="block text-xs font-bold text-indigo-300 uppercase mb-1">Swatch Hex</label>
                  <div className="flex items-center gap-2 border border-indigo-500/30 bg-[#0B1120] p-1.5 rounded-lg focus-within:border-cyan-400 transition-colors">
                    <input 
                      type="color" 
                      value={color.hexCode.length === 7 && color.hexCode.startsWith("#") ? color.hexCode : "#ffffff"} 
                      onChange={(e) => handleColorChange(index, "hexCode", e.target.value)} 
                      className="w-7 h-7 rounded cursor-pointer bg-transparent border-0 shrink-0" 
                    />
                    <input 
                      type="text" 
                      value={color.hexCode} 
                      onChange={(e) => {
                        let val = e.target.value;
                        if (!val.startsWith("#")) {
                          val = "#" + val.replace(/#/g, "");
                        }
                        handleColorChange(index, "hexCode", val);
                      }} 
                      placeholder="#FFFFFF"
                      maxLength={7}
                      className="w-full bg-transparent text-xs text-cyan-50 font-mono uppercase outline-none" 
                    />
                  </div>
                </div>

                {/* 3. Specific Color Image */}
                <div className="w-full md:w-1/3">
                  <label className="block text-xs font-bold text-indigo-300 uppercase mb-1">Specific Color Image</label>
                  <input 
                    type="file" accept="image/*"
                    onChange={(e) => handleColorChange(index, "imageFile", e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-indigo-500/30 bg-[#0B1120] p-1.5 rounded-lg text-cyan-50 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-indigo-500/20 file:text-indigo-300 cursor-pointer text-xs" 
                  />
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Specs & Inventory */}
        <div>
          <h2 className="text-lg font-bold text-cyan-400 mb-4 border-b border-indigo-500/20 pb-2">Inventory & Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Min. Order (Meters)</label>
              <input required type="number" name="moq" value={formData.moq} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Total Stock (Meters)</label>
              <input required type="number" name="availableStock" value={formData.availableStock} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl focus:border-cyan-400 outline-none text-cyan-50" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Width</label>
              <input type="text" name="width" value={formData.width} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl outline-none text-cyan-50" placeholder="e.g. 58/60 inches" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Weight</label>
              <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl outline-none text-cyan-50" placeholder="e.g. 180 GSM" />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Composition</label>
              <input type="text" name="composition" value={formData.composition} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl outline-none text-cyan-50" placeholder="e.g. 100% Cotton" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-indigo-500/30 bg-slate-900/60 p-3.5 rounded-xl outline-none text-cyan-50" rows={4}></textarea>
        </div>
        
        <div className="flex gap-4 pt-4 border-t border-indigo-500/20">
          <button type="submit" disabled={uploading} className="w-full bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? "Uploading Images & Saving..." : "Publish Product with Variants"}
          </button>
        </div>
      </form>
    </div>
  );
}