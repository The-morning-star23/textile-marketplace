/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";

interface Message {
  role: "ai" | "user";
  text: string;
}

interface BuyerProfile {
  businessType: string;
  industry: string;
  categoriesOfInterest: string;
  preferredFabrics: string;
  typicalOrderQuantity: string;
  budgetRange: string;
  additionalPreferences: string;
}

export default function BuyerOnboarding() {
  const router = useRouter();
  const auth = useContext(AuthContext) as any;
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [setupMode, setSetupMode] = useState<"ai" | "manual">("ai");

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      text: "Welcome to ThreadMarket! I'm your AI sourcing assistant.\n\nYou can chat with me, use voice input, or switch to the manual form. To start, what is your business type and what industry are you in?" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Live Extracted Profile State
  const [profile, setProfile] = useState<BuyerProfile>({
    businessType: "",
    industry: "",
    categoriesOfInterest: "",
    preferredFabrics: "",
    typicalOrderQuantity: "",
    budgetRange: "",
    additionalPreferences: "",
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (setupMode === "ai") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, setupMode]);

  // Handle Manual Form Inputs
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Voice AI - Web Speech API
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice AI is not supported in this browser. Please type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // AI Extraction Logic via Backend Gemini Route
  const handleSendAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userInput = inputValue;
    const newMessages = [...messages, { role: "user" as const, text: userInput }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      if (!auth?.user?._id || !auth?.token) {
        throw new Error("Authentication missing.");
      }

      const res = await fetch(`http://localhost:5000/api/auth/onboard/ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          userId: auth.user._id,
          description: userInput
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const data = result.data;

        if (data) {
          setProfile(prev => ({
            ...prev,
            businessType: data.businessType || prev.businessType,
            industry: data.industry || prev.industry,
            categoriesOfInterest: Array.isArray(data.categoriesOfInterest) ? data.categoriesOfInterest.join(', ') : (data.categoriesOfInterest || prev.categoriesOfInterest),
            preferredFabrics: Array.isArray(data.preferredFabrics) ? data.preferredFabrics.join(', ') : (data.preferredFabrics || prev.preferredFabrics),
            typicalOrderQuantity: data.typicalOrderQuantity || prev.typicalOrderQuantity,
            budgetRange: data.budgetRange || prev.budgetRange,
            additionalPreferences: data.additionalPreferences || prev.additionalPreferences,
          }));
        }

        setMessages([...newMessages, { 
          role: "ai", 
          text: "I've successfully parsed your preferences! Review your live buyer profile on the right. If everything looks good, click 'Confirm & Go to Marketplace'!" 
        }]);
      } else {
        setMessages([...newMessages, { role: "ai", text: "I had a bit of trouble processing that. Could you provide your details again clearly?" }]);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { role: "ai", text: "Network error connecting to the AI brain. Please try the manual form if this persists." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleComplete = async () => {
    try {
      if (!auth?.user?._id || !auth?.token) {
        alert("Authentication missing. Please log in again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/auth/onboard`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth.token}`
        },
        body: JSON.stringify({
          userId: auth.user._id,
          preferences: {
            ...profile,
            categoriesOfInterest: profile.categoriesOfInterest.split(',').map(s => s.trim()).filter(Boolean),
            preferredFabrics: profile.preferredFabrics.split(',').map(s => s.trim()).filter(Boolean),
          }
        }),
      });

      if (res.ok) {
        const result = await res.json();
        const updatedUser = { 
          ...auth.user, 
          isOnboarded: true,
          preferences: result.data || result.preferences
        };
        auth.login(updatedUser, auth.token);
        router.push("/marketplace");
      } else {
        alert("Failed to save onboarding data. Please try again.");
      }
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("An error occurred while saving your profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <nav className="relative z-50 w-full backdrop-blur-2xl bg-[#0B1120]/80 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </div>
          <div className="text-sm font-bold text-indigo-300">Buyer Onboarding</div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10 relative z-10 flex flex-col h-[calc(100vh-80px)]">
        <div className="flex bg-indigo-950/40 p-1 rounded-xl w-fit mb-8 border border-indigo-500/30 mx-auto lg:mx-0 shadow-lg">
          <button onClick={() => setSetupMode('ai')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'ai' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'text-indigo-400 hover:text-cyan-200'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            AI & Voice Setup
          </button>
          <button onClick={() => setSetupMode('manual')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'manual' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'text-indigo-400 hover:text-cyan-200'}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Manual Form
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 h-full min-h-0 pb-10">
          {setupMode === "ai" ? (
            <div className="w-full lg:w-1/2 flex flex-col bg-[#0B1120]/60 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden shadow-2xl h-full">
              <div className="bg-indigo-950/40 border-b border-indigo-500/20 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center border border-cyan-400/50">
                      <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0B1120] rounded-full"></span>
                  </div>
                  <div>
                    <h2 className="text-cyan-50 font-bold">AI Sourcing Assistant</h2>
                    <p className="text-xs text-indigo-300/80">Online & Listening</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-md ${msg.role === "user" ? "bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 rounded-br-none" : "bg-indigo-900/40 border border-indigo-500/30 text-indigo-100 rounded-bl-none"}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-indigo-900/40 border border-indigo-500/30 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form onSubmit={handleSendAI} className="p-4 bg-slate-900/40 border-t border-indigo-500/20">
                <div className="relative flex items-center gap-2">
                  <button type="button" onClick={toggleVoice} className={`shrink-0 p-3.5 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-indigo-900/40 text-cyan-400 border border-indigo-500/30 hover:bg-indigo-800/50'}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
                  <div className="relative flex-1">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={isListening ? "Listening..." : "Tell AI your sourcing preferences..."} className="w-full bg-[#0B1120] border border-indigo-500/40 text-cyan-50 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-indigo-400/50 shadow-inner" disabled={isTyping} />
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full lg:w-1/2 flex flex-col bg-[#0B1120]/60 backdrop-blur-xl border border-indigo-500/20 rounded-3xl shadow-2xl h-full p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
              <h2 className="text-2xl font-bold text-cyan-50 mb-6">Sourcing Preferences</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Business Type</label>
                    <input type="text" name="businessType" value={profile.businessType} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. Boutique Brand" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Industry</label>
                    <input type="text" name="industry" value={profile.industry} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. Fashion / Apparel" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Categories of Interest</label>
                    <input type="text" name="categoriesOfInterest" value={profile.categoriesOfInterest} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. Luxury, Womenswear" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Preferred Fabrics</label>
                    <input type="text" name="preferredFabrics" value={profile.preferredFabrics} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. Silk, Organic Cotton" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Typical Order Quantity</label>
                    <input type="text" name="typicalOrderQuantity" value={profile.typicalOrderQuantity} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. 150 meters" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Budget Range</label>
                    <input type="text" name="budgetRange" value={profile.budgetRange} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400" placeholder="e.g. $10 - $30 / meter" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Additional Preferences</label>
                  <textarea name="additionalPreferences" value={profile.additionalPreferences} onChange={handleManualChange} rows={3} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 resize-none" placeholder="Certifications, shipping requirements..." />
                </div>
              </div>
            </div>
          )}

          <div className="w-full lg:w-1/2 flex flex-col h-full">
            <div className="bg-linear-to-b from-[#0B1120]/80 to-indigo-950/20 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b border-indigo-500/20 pb-4">
                <h2 className="text-xl font-extrabold text-cyan-50 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Live Buyer Profile
                </h2>
              </div>

              <div className="space-y-6 flex-1 z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Business Type</label>
                    <div className={`text-sm font-bold ${profile.businessType ? 'text-cyan-50' : 'text-indigo-300/30'}`}>{profile.businessType || "Waiting for input..."}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Industry</label>
                    <div className={`text-sm font-bold ${profile.industry ? 'text-emerald-400' : 'text-indigo-300/30'}`}>{profile.industry || "Waiting for input..."}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Categories of Interest</label>
                    <div className={`text-sm font-bold ${profile.categoriesOfInterest ? 'text-cyan-300' : 'text-indigo-300/30'}`}>{profile.categoriesOfInterest || "Waiting for input..."}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Preferred Fabrics</label>
                    <div className={`text-sm font-bold ${profile.preferredFabrics ? 'text-cyan-300' : 'text-indigo-300/30'}`}>{profile.preferredFabrics || "Waiting for input..."}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Typical Order Quantity</label>
                    <div className={`text-sm font-bold ${profile.typicalOrderQuantity ? 'text-amber-400' : 'text-indigo-300/30'}`}>{profile.typicalOrderQuantity || "Waiting for input..."}</div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Budget Range</label>
                    <div className={`text-sm font-bold ${profile.budgetRange ? 'text-emerald-400' : 'text-indigo-300/30'}`}>{profile.budgetRange || "Waiting for input..."}</div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Additional Preferences</label>
                  <div className={`text-sm font-bold ${profile.additionalPreferences ? 'text-cyan-50' : 'text-indigo-300/30'}`}>{profile.additionalPreferences || "Waiting for input..."}</div>
                </div>
              </div>

              <button onClick={handleComplete} disabled={!profile.businessType || !profile.industry} className="mt-6 w-full bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed z-10 shrink-0">
                Confirm & Go to Marketplace
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}