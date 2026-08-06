/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function AIAssistant() {
  const auth = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I'm your ThreadMarket AI. I can recommend fabrics, compare specs, or answer questions about our inventory. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isOpen]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    // REMOVED the !auth?.token check so guests can chat
    if (!input.trim()) return;

    const userText = input.trim();
    setInput(""); 
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:5000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Optionally pass token if they HAVE one, but don't require it
          ...(auth?.token ? { Authorization: `Bearer ${auth.token}` } : {})
        },
        body: JSON.stringify({ history: messages, message: userText }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Oops, I had a little trouble connecting to the marketplace. Try again!" }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "ai", text: "Network error. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Web Speech API for Voice Input
  const startListening = () => {
    // @ts-expect-error - Handle cross-browser compatibility for Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); 
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* The Floating Chat Window (Updated for Dark Mode) */}
      {isOpen && (
        <div className="mb-4 w-[90vw] sm:w-96 bg-[#0B1120]/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-linear-to-r from-indigo-950 to-[#0B1120] p-4 flex justify-between items-center border-b border-indigo-500/30 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-cyan-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                <svg className="w-5 h-5 text-cyan-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-extrabold text-cyan-50 text-sm tracking-wide">ThreadMarket AI</h3>
                <p className="text-[10px] font-medium text-cyan-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-indigo-400 hover:text-cyan-400 transition-colors bg-indigo-950/50 p-2 rounded-full">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="h-96 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-indigo-500/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user" 
                    ? "bg-linear-to-br from-cyan-600 to-indigo-600 text-cyan-50 rounded-tr-sm shadow-md" 
                    : "bg-indigo-950/60 border border-indigo-500/20 text-indigo-100 rounded-tl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-indigo-950/60 border border-indigo-500/20 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-indigo-950/40 border-t border-indigo-500/20 flex items-center gap-2 backdrop-blur-md">
            <button 
              type="button"
              onClick={startListening}
              className={`p-2.5 rounded-full transition-all duration-300 ${isListening ? 'bg-red-500/20 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse' : 'bg-indigo-900/50 text-indigo-300 hover:bg-indigo-800 hover:text-cyan-400'}`}
              title="Voice Search"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fabrics..." 
              className="flex-1 px-4 py-2.5 bg-[#0B1120]/50 border border-indigo-500/30 rounded-full text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-cyan-50 placeholder:text-indigo-400/50 transition-all"
            />
            
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-linear-to-r from-cyan-500 to-indigo-500 text-cyan-50 rounded-full hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:grayscale transition-all"
            >
              <svg className="w-5 h-5 translate-x-px translate-y-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* The Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto w-14 h-14 bg-linear-to-br from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-transform hover:scale-110"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </div>
  );
}