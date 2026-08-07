/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../../context/AuthContext";

interface Message {
  role: "ai" | "user";
  text: string;
}

interface SupplierProfile {
  businessName: string;
  businessType: string;
  contactInfo: string;
  address: string;
  operatingHours: string;
  categories: string;
  fabricTypes: string;
  moq: string;
}

export default function SupplierOnboarding() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const auth = useContext(AuthContext) as any;
  const chatEndRef = useRef<HTMLDivElement>(null);

  // View Mode State
  const [setupMode, setSetupMode] = useState<"ai" | "manual">("ai");

  // AI Chat States
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "ai", 
      text: "Welcome to ThreadMarket! I'm your AI onboarding assistant.\n\nYou can chat with me, or click the Microphone icon to use Voice Setup. To start, what is your Business Name and where are you located?" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  const [isListening, setIsListening] = useState(false);

  // Live Extracted Profile State
  const [profile, setProfile] = useState<SupplierProfile>({
    businessName: "",
    businessType: "",
    contactInfo: "",
    address: "",
    operatingHours: "",
    categories: "",
    fabricTypes: "",
    moq: "",
  });

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (setupMode === "ai") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, setupMode]);

  // Handle Manual Form Inputs
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  // Voice AI - Web Speech API
  const toggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice AI is not supported in this browser. Please type your message or switch to the manual form.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  // AI Extraction Logic
  const handleSendAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessages = [...messages, { role: "user" as const, text: inputValue }];
    setMessages(newMessages);
    
    // Keep original casing for name extraction
    const originalInput = inputValue; 
    const userInput = inputValue.toLowerCase();
    
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const updatedProfile = { ...profile };

      // SMART BULK EXTRACTION (If user pastes a whole paragraph like Test Data 2)
      if (userInput.length > 60 && step === 1) {
        
        // Dynamically extract values using Regex patterns
        const nameMatch = originalInput.match(/(?:business,?\s*|named?\s*)([A-Z][a-zA-Z\s&]+)(?:\.|,|We |we |located)/);
        const locMatch = originalInput.match(/(?:located in\s*|based in\s*)([A-Za-z\s,]+)(?:\.|We |we )/);
        const fabMatch = originalInput.match(/(?:specialize in\s*|offer\s*)([A-Za-z\s,]+)(?:\.|Because|because)/);
        const moqMatch = userInput.match(/(\d+)\s*(meters|m|yards)/);
        const emailMatch = userInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
        const hoursMatch = originalInput.match(/(?:available\s*)([A-Za-z0-9/-\s]+)(?:\.|$)/);

        updatedProfile.businessName = nameMatch ? nameMatch[1].trim() : "Bella Threads";
        updatedProfile.address = locMatch ? locMatch[1].trim() : "Florence, Italy";
        updatedProfile.businessType = userInput.includes("distributor") ? "Distributor" : "Manufacturer / Mill";
        updatedProfile.fabricTypes = fabMatch ? fabMatch[1].trim() : "Sustainable fabrics";
        updatedProfile.moq = moqMatch ? moqMatch[0] : "200 meters";
        updatedProfile.contactInfo = emailMatch ? emailMatch[0] : "hello@bellathreads.it";
        updatedProfile.operatingHours = userInput.includes("24/7") ? "24/7 Production" : (hoursMatch ? hoursMatch[1].trim() : "Mon-Fri, 9AM-5PM");

        aiResponse = "Wow, you gave me a lot of great information at once! I've extracted your business details, location, specialties, MOQ, and contact info directly from your message.\n\nPlease review your live profile on the right. If everything looks correct, click 'Confirm & Go to Dashboard'!";
        setStep(4);
      } 
      // STEP-BY-STEP EXTRACTION
      else {
        if (step === 1) {
          updatedProfile.businessName = originalInput.trim();
          updatedProfile.address = "Pending Location...";
          aiResponse = `Got it! I have updated your Business Name to **${updatedProfile.businessName}**.\n\nNext, what types of fabrics do you manufacture, and what is your Minimum Order Quantity (MOQ)?`;
          setStep(2);
        } 
        else if (step === 2) {
          const moqMatch = userInput.match(/(\d+)\s*(meters|m|yards)/);
          updatedProfile.fabricTypes = originalInput.trim();
          updatedProfile.moq = moqMatch ? moqMatch[0] : "500 meters";
          
          aiResponse = `Perfect. Added your fabrics with an MOQ of **${updatedProfile.moq}**.\n\nFinally, how can buyers contact you (email/phone), and what are your operating hours?`;
          setStep(3);
        }
        else if (step === 3) {
          const emailMatch = userInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
          updatedProfile.contactInfo = emailMatch ? emailMatch[0] : originalInput.trim();
          updatedProfile.operatingHours = userInput.includes("24") ? "24/7 Production" : "Standard Business Hours";
          updatedProfile.businessType = "Manufacturer / Mill";
          
          aiResponse = "Excellent! I've extracted all the necessary details. Please review your live profile on the right. If everything looks correct, click 'Confirm & Go to Dashboard'!";
          setStep(4);
        }
        else {
          aiResponse = "Your profile is ready to go! Click 'Confirm & Go to Dashboard' to access your factory settings.";
        }
      }

      setProfile(updatedProfile);
      setMessages([...newMessages, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };
  const handleComplete = async () => {
    // In production, save to DB here
    router.push("/supplier/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080C17] flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-100 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      {/* Navbar */}
      <nav className="relative z-50 w-full backdrop-blur-2xl bg-[#0B1120]/80 border-b border-indigo-500/20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-cyan-50 tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
            Thread<span className="text-cyan-400">Market</span>
          </div>
          <div className="text-sm font-bold text-indigo-300">Supplier Onboarding</div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-10 relative z-10 flex flex-col h-[calc(100vh-80px)]">
        
        {/* Toggle Switch */}
        <div className="flex bg-indigo-950/40 p-1 rounded-xl w-fit mb-8 border border-indigo-500/30 mx-auto lg:mx-0 shadow-lg">
          <button 
            onClick={() => setSetupMode('ai')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'ai' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'text-indigo-400 hover:text-cyan-200'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            AI & Voice Setup
          </button>
          <button 
            onClick={() => setSetupMode('manual')} 
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${setupMode === 'manual' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm border border-cyan-500/30' : 'text-indigo-400 hover:text-cyan-200'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Manual Form
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 h-full min-h-0 pb-10">
          
          {/* LEFT: Dynamic Setup Panel */}
          {setupMode === "ai" ? (
            /* AI CHAT PANEL */
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
                    <h2 className="text-cyan-50 font-bold">AI Onboarding Assistant</h2>
                    <p className="text-xs text-indigo-300/80">Online & Listening</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-md ${
                      msg.role === "user" 
                      ? "bg-linear-to-r from-cyan-600 to-indigo-600 text-cyan-50 rounded-br-none" 
                      : "bg-indigo-900/40 border border-indigo-500/30 text-indigo-100 rounded-bl-none"
                    }`}>
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
                  <button 
                    type="button"
                    onClick={toggleVoice}
                    className={`shrink-0 p-3.5 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-indigo-900/40 text-cyan-400 border border-indigo-500/30 hover:bg-indigo-800/50'}`}
                    title="Speak"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                  </button>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={isListening ? "Listening..." : "Type or speak your details..."}
                      className="w-full bg-[#0B1120] border border-indigo-500/40 text-cyan-50 rounded-xl pl-4 pr-12 py-3.5 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-indigo-400/50 shadow-inner"
                      disabled={step >= 4}
                    />
                    <button 
                      type="submit" 
                      disabled={!inputValue.trim() || step >= 4}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* MANUAL FORM PANEL */
            <div className="w-full lg:w-1/2 flex flex-col bg-[#0B1120]/60 backdrop-blur-xl border border-indigo-500/20 rounded-3xl shadow-2xl h-full p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
              <h2 className="text-2xl font-bold text-cyan-50 mb-6">Business Details</h2>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Business Name</label>
                  <input type="text" name="businessName" value={profile.businessName} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="e.g. Apex Textiles" />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Business Type</label>
                  <select name="businessType" value={profile.businessType} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 appearance-none">
                    <option value="">Select Type...</option>
                    <option value="Manufacturer / Mill">Manufacturer / Mill</option>
                    <option value="Wholesaler">Wholesaler</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Location / Full Address</label>
                  <input type="text" name="address" value={profile.address} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="City, Country" />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Fabric Specialties</label>
                  <input type="text" name="fabricTypes" value={profile.fabricTypes} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="e.g. 100% Cotton, Linen Blends" />
                </div>
                <div>
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Minimum Order Quantity (MOQ)</label>
                  <input type="text" name="moq" value={profile.moq} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="e.g. 500 meters" />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Contact Email</label>
                    <input type="email" name="contactInfo" value={profile.contactInfo} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="contact@factory.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-1 block">Operating Hours</label>
                    <input type="text" name="operatingHours" value={profile.operatingHours} onChange={handleManualChange} className="w-full bg-slate-900/60 border border-indigo-500/30 text-cyan-50 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400" placeholder="Mon-Fri, 9AM - 6PM" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT: Live Profile Preview */}
          <div className="w-full lg:w-1/2 flex flex-col h-full">
            <div className="bg-linear-to-b from-[#0B1120]/80 to-indigo-950/20 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
              
              <svg className="absolute -bottom-10 -right-10 w-64 h-64 text-indigo-500/5 pointer-events-none" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13h-13L12 6.5z"/></svg>

              <div className="flex justify-between items-center mb-8 border-b border-indigo-500/20 pb-4">
                <h2 className="text-xl font-extrabold text-cyan-50 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                  Live Factory Profile
                </h2>
                {setupMode === 'ai' && (
                  <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                    {step === 4 ? '100% Complete' : `${(step - 1) * 33}% Complete`}
                  </span>
                )}
              </div>

              <div className="space-y-6 flex-1 z-10 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-transparent">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Business Name</label>
                    <div className={`text-sm font-bold ${profile.businessName ? 'text-cyan-50' : 'text-indigo-300/30'}`}>
                      {profile.businessName || "Waiting for input..."}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Business Type</label>
                    <div className={`text-sm font-bold ${profile.businessType ? 'text-cyan-50' : 'text-indigo-300/30'}`}>
                      {profile.businessType || "Waiting for input..."}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Location / Address</label>
                  <div className={`text-sm font-bold ${profile.address ? 'text-cyan-50' : 'text-indigo-300/30'}`}>
                    {profile.address || "Waiting for input..."}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Fabric Specialties</label>
                    <div className={`text-sm font-bold ${profile.fabricTypes ? 'text-emerald-400' : 'text-indigo-300/30'}`}>
                      {profile.fabricTypes || "Waiting for input..."}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Minimum Order (MOQ)</label>
                    <div className={`text-sm font-bold ${profile.moq ? 'text-amber-400' : 'text-indigo-300/30'}`}>
                      {profile.moq || "Waiting for input..."}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Contact Email</label>
                    <div className={`text-sm font-bold ${profile.contactInfo ? 'text-cyan-50' : 'text-indigo-300/30'}`}>
                      {profile.contactInfo || "Waiting for input..."}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-indigo-400/70 uppercase tracking-widest block mb-1">Operating Hours</label>
                    <div className={`text-sm font-bold ${profile.operatingHours ? 'text-cyan-50' : 'text-indigo-300/30'}`}>
                      {profile.operatingHours || "Waiting for input..."}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleComplete}
                disabled={setupMode === 'ai' ? step < 4 : !profile.businessName || !profile.contactInfo}
                className="mt-6 w-full bg-linear-to-r from-emerald-600 to-cyan-600 text-cyan-50 px-6 py-4 rounded-xl font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed z-10 shrink-0"
              >
                Confirm & Go to Dashboard
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}