'use client';

import React, { useEffect, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Bot, X, Send, User, MessageSquare, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { proficiencyBadgesData, badgesData } from '@/data/badges';

export function FloatingAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [currentBadgeName, setCurrentBadgeName] = useState<string | null>(null);
  const pathname = usePathname();
  const params = useParams();

  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: 'Hello! I am your Scout AI Assistant. How can I help you with your progression or proficiency badges today?' }
  ]);

  // Context awareness: Detect which badge the user is viewing
  useEffect(() => {
    let badgeName: string | null = null;
    
    if (pathname.includes('/scout/proficiency/')) {
      const id = params.id;
      const badge = proficiencyBadgesData.find(b => b.id === id);
      if (badge) badgeName = badge.title;
    } else if (pathname.includes('/scout/badges/')) {
      const id = params.id;
      const badge = badgesData.find(b => b.id === id);
      if (badge) badgeName = badge.title;
    }

    if (badgeName && badgeName !== currentBadgeName) {
      setCurrentBadgeName(badgeName);
      setChatHistory([
        { 
          role: 'ai', 
          content: `Hello! I see you are working on the **${badgeName}** badge. I have the full 2022 curriculum details for this skill. Ask me anything about its requirements or how to prepare!` 
        }
      ]);
      // Auto-open if navigating to a specific badge
      setIsOpen(true);
    } else if (!badgeName && currentBadgeName) {
      setCurrentBadgeName(null);
      setChatHistory([
        { role: 'ai', content: 'Hello! I am your Scout AI Assistant. How can I help you with your progression or proficiency badges today?' }
      ]);
    }
  }, [pathname, params, currentBadgeName]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newUserMsg = { role: 'user', content: message };
    setChatHistory(prev => [...prev, newUserMsg]);
    setMessage('');

    // Simulate AI response with context
    setTimeout(() => {
      const contextText = currentBadgeName 
        ? `Regarding the **${currentBadgeName}** badge requirements in the 2022 syllabus: `
        : "";
      
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: `${contextText}You'll need to demonstrate the required skills to an authorized examiner. Once they sign and frank your form, you can upload it right here in the portal for Patrol Leader verification. Would you like me to list the specific sub-tasks for this badge?` 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      {/* Context Badge (Mini notification above the button when closed) */}
      {!isOpen && currentBadgeName && (
        <div className="bg-white border border-primary/20 shadow-xl px-4 py-2 rounded-2xl animate-bounce flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-primary" />
          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
            Need help with {currentBadgeName}?
          </p>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl border border-slate-200 bg-white rounded-[2rem] overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300">
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <p className="font-black text-sm uppercase tracking-widest leading-none">Scout AI Assistant</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-tighter text-slate-300">
                    {currentBadgeName ? `Assisting with ${currentBadgeName}` : 'Online & Ready'}
                  </p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-[#F8FAFC]">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex gap-3 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${chat.role === 'ai' ? 'bg-primary text-white' : 'bg-slate-900 text-white'}`}>
                  {chat.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`p-4 rounded-2xl max-w-[85%] shadow-sm text-sm leading-relaxed font-medium ${
                  chat.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                }`}>
                  {chat.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-5 bg-white border-t border-slate-100">
            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={currentBadgeName ? `Ask about ${currentBadgeName}...` : "Ask about requirements..."}
                className="w-full px-5 py-4 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-white bg-primary rounded-xl disabled:bg-slate-200 disabled:text-slate-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </Card>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-90 group border-4 border-white ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-slate-900 shadow-slate-200'
        }`}
      >
        {isOpen ? (
          <X className="text-white w-8 h-8" />
        ) : (
          <div className="relative">
            <Bot className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
            {!isOpen && !currentBadgeName && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-4 border-slate-900 rounded-full animate-pulse shadow-lg" />
            )}
          </div>
        )}
      </button>
    </div>
  );
}
