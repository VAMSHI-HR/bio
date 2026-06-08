import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Disc, User, Bot } from "lucide-react";
import { ChatMessage } from "../types";

interface ChatbotProps {
  darkMode: boolean;
}

export default function Chatbot({ darkMode }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Hello! I am clinical agent MediPredict AI. Ask me about your health inputs, symptoms, preventative diets, or guidelines for cardiovascular, liver, renal, glycemic, and motor-skill monitoring.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error("Chat service was unable to reply.");
      }

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        content: data.text || "I was unable to formulate a precise clinical review. Please verify server endpoints.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: `msg-${Date.now() + 2}`,
        role: "model",
        content: "Error: My connection timed out. Please configure GEMINI_API_KEY in Secrets for live assistant consultation.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          id="chatbot-trigger"
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center bg-gradient-to-tr from-blue-600 to-sky-500 text-white p-4 rounded-full shadow-2xl hover:bg-gradient-to-tr hover:from-blue-700 hover:to-sky-600 transform hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border border-blue-500/20 relative group"
          title="Clinical Assistant"
        >
          <MessageSquare className="w-6 h-6 animate-pulse" />
          <span className="absolute right-full mr-3 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
            AI Health Assistant
          </span>
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 animate-bounce" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          id="chat-window"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-80 sm:w-96 h-[480px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-sky-500 p-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Disc className="w-5 h-5 text-white animate-spin" />
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-xs tracking-wide uppercase">MediPredict Assistant</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  <span className="text-[10px] text-blue-100 font-bold">Online diagnostic copilot</span>
                </div>
              </div>
            </div>
            <button
              id="close-chatbot"
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-md hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/25">
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} items-start gap-2.5`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isUser
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/40 dark:border-slate-800"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    <span
                      className={`block text-[9px] text-right mt-1.5 ${
                        isUser ? "text-blue-200" : "text-slate-400"
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                  {isUser && (
                    <div className="w-7 h-7 rounded-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start items-start gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200/40 dark:border-slate-800 rounded-2xl rounded-bl-none p-3.5 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  Analyzing context metrics...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form
            onSubmit={handleSend}
            className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-2"
          >
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query glucose, motor tremors..."
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 outline-none"
              disabled={loading}
              maxLength={200}
            />
            <button
              id="send-chat"
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl transition duration-150 disabled:opacity-50 disabled:bg-slate-400 cursor-pointer flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
