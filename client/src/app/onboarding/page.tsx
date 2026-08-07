/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context/AuthContext";

export default function BuyerOnboarding() {
  const [mode, setMode] = useState<"ai" | "manual">("ai");
  const [description, setDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  // Comprehensive Manual Form covering ALL rubric requirements
  const [manualForm, setManualForm] = useState({
    businessType: "",
    industry: "",
    categoriesOfInterest: "",
    preferredFabrics: "",
    typicalOrderQuantity: "",
    budgetRange: "",
    additionalPreferences: ""
  });

  const auth = useContext(AuthContext) as any;
  const router = useRouter();

  // --- VOICE RECOGNITION LOGIC ---
  const recognitionRef = useRef<any>(null);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please type instead.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let currentTranscript = "";
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setDescription(currentTranscript);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const handleAIOnboarding = async () => {
    if (!description.trim() || description.length < 15) {
      alert("Please tell us a bit more about your business, categories, and fabric preferences!");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/api/onboarding/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: auth.user?._id, description }),
      });
      if (res.ok) {
        const updatedUser = { ...auth.user, isOnboarded: true };
        auth.login(updatedUser, auth.token);
        router.push("/marketplace"); // Redirect to marketplace after successful onboarding
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const res = await fetch("http://localhost:5000/api/onboarding/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: auth.user?._id, preferences: manualForm }),
      });
      if (res.ok) {
        const updatedUser = { ...auth.user, isOnboarded: true };
        auth.login(updatedUser, auth.token);
        router.push("/marketplace");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-cyan-600/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      
      <div className="max-w-2xl w-full bg-[#0B1120]/85 backdrop-blur-xl border border-indigo-500/30 p-8 sm:p-10 rounded-3xl shadow-2xl z-10 relative">
        
        {/* Toggle Switch */}
        <div className="flex bg-indigo-950/50 rounded-xl p-1 mb-8 border border-indigo-500/20">
          <button 
            onClick={() => setMode("ai")}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === "ai" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-300 hover:text-white"}`}
          >
            AI Voice Assistant
          </button>
          <button 
            onClick={() => setMode("manual")}
            className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === "manual" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-300 hover:text-white"}`}
          >
            Manual Form
          </button>
        </div>

        {mode === "ai" ? (
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-cyan-50 mb-3">AI Profile Assistant</h1>
            <p className="text-indigo-200/80 mb-6 text-sm leading-relaxed">
              Tap the microphone or type below. Mention your <strong>business type, industry, product categories, preferred fabrics, order quantities, budget range,</strong> and any other preferences!
            </p>

            <div className="relative mb-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., I run a boutique fashion brand in Milan. We focus on apparel, preferring organic cotton and silk. Typical orders are around 100 meters, budget $10-$25/meter..."
                className="w-full h-44 bg-slate-900/50 border border-indigo-500/30 rounded-2xl p-5 pr-16 text-cyan-50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              />
              <button 
                onClick={toggleListen}
                className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening ? "bg-red-500 animate-pulse text-white shadow-[0_0_20px_rgba(239,68,68,0.6)]" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            </div>

            <button onClick={handleAIOnboarding} disabled={isProcessing} className="w-full bg-linear-to-r from-cyan-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50">
              {isProcessing ? "Extracting via AI..." : "Generate My Profile"}
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualOnboarding} className="space-y-4">
            <h1 className="text-2xl font-extrabold text-cyan-50 mb-4 text-center">Complete Your Profile</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Business Type (e.g. Boutique)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, businessType: e.target.value})} />
              <input type="text" placeholder="Industry (e.g. Fashion)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, industry: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Categories (e.g. Apparel, Luxury)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, categoriesOfInterest: e.target.value})} />
              <input type="text" placeholder="Preferred Fabrics (e.g. Silk, Cotton)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, preferredFabrics: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" placeholder="Typical Order Qty (e.g. 100 meters)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, typicalOrderQuantity: e.target.value})} />
              <input type="text" placeholder="Budget Range (e.g. $10-$25/m)" required className="p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm" onChange={(e) => setManualForm({...manualForm, budgetRange: e.target.value})} />
            </div>

            <textarea placeholder="Additional preferences or special requirements..." className="w-full h-24 p-4 bg-slate-900/50 border border-indigo-500/30 rounded-xl text-white focus:border-cyan-400 focus:outline-none text-sm resize-none" onChange={(e) => setManualForm({...manualForm, additionalPreferences: e.target.value})} />

            <button type="submit" disabled={isProcessing} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl mt-2 hover:bg-indigo-500 transition-all disabled:opacity-50">
              {isProcessing ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}