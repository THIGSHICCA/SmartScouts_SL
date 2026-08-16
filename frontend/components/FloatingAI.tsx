'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { Bot, X, Send, User, Sparkles, MessageCircle, PlusCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { proficiencyBadgesData, badgesData } from '@/data/badges';
import ReactMarkdown from 'react-markdown';

const API = 'http://localhost:5000/api';

interface ChatMsg { role: 'ai' | 'user'; content: string; }

/* Build a rich context string for a proficiency badge */
function buildBadgeContext(badge: typeof proficiencyBadgesData[0]) {
  return (
    `You are a Sri Lanka Scout Association (SLSA) Scout Assistant. ` +
    `The scout is asking about the "${badge.title}" proficiency badge (code: ${badge.code}). ` +
    `Group: ${badge.group}. Level: ${badge.level === 'both' ? 'International' : badge.level === 'junior' ? 'Junior Scout' : 'Senior Scout'}. ` +
    `Description: ${badge.description}. ` +
    `Explain the requirements to earn this badge, how to prepare, who the Badge Examiner is, ` +
    `and what certificate the scout must upload. Keep the answer friendly and encouraging.`
  );
}

const DEFAULT_WELCOME = { 
  role: 'ai' as const, 
  content: 'Hello! I\'m your Scout Assistant 🤖\n\nAsk me anything about award requirements, proficiency badges, or how to progress through the 5 award levels!' 
};

export function FloatingAI() {
  const pathname  = usePathname();
  const params    = useParams();
  const endRef    = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen]     = useState(false);
  const [message, setMessage]   = useState('');
  const [busy, setBusy]         = useState(false);
  const [activeBadge, setActiveBadge] = useState<typeof proficiencyBadgesData[0] | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = (window as any).localStorage?.getItem('scout-ai-chat-history');
      if (saved) {
        try {
          setChatHistory(JSON.parse(saved));
        } catch {
          setChatHistory([DEFAULT_WELCOME]);
        }
      } else {
        setChatHistory([DEFAULT_WELCOME]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      (window as any).localStorage?.setItem('scout-ai-chat-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory, isLoaded]);

  /* Auto-scroll to bottom */
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatHistory]);

  /* Route-based badge context (badge detail page) */
  useEffect(() => {
    let badge = null;
    if (pathname.includes('/scout/proficiency/')) {
      badge = proficiencyBadgesData.find(b => b.id === params.id) ?? null;
    }
    if (badge) {
      setActiveBadge(badge);
      setChatHistory(prev => [...prev, {
        role: 'ai',
        content: `I see you're looking at the **${badge.title}** (${badge.code}) badge! 🏅\n\n${badge.description}\n\nAsk me what you need to do to earn this badge!`
      }]);
      setIsOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, params]);

  /* Listen for custom event from Proficiency page "Ask AI" button */
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const badge: typeof proficiencyBadgesData[0] = e.detail;
      setActiveBadge(badge);
      setChatHistory(prev => [...prev,
        { role: 'ai', content: `Great choice! Let me tell you about the **${badge.title}** (${badge.code}) proficiency badge. 🏅\n\n📌 *${badge.description}*\n\nType your question below or ask "What do I need to do to earn this badge?"` }
      ]);
      setIsOpen(true);
    };
    window.addEventListener('ask-ai-badge', handler as EventListener);
    return () => window.removeEventListener('ask-ai-badge', handler as EventListener);
  }, []);

  const sendMessage = async (userText: string) => {
    if (!userText.trim() || busy) return;
    const userMsg: ChatMsg = { role: 'user', content: userText };
    setChatHistory(prev => [...prev, userMsg]);
    setMessage('');
    setBusy(true);

    try {
      const token = sessionStorage.getItem('token');
      const systemContext = activeBadge ? buildBadgeContext(activeBadge) : undefined;

      const res = await fetch(`${API}/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question: userText, context: systemContext }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', content: data.answer ?? data.reply ?? data.message ?? 'I had trouble answering that. Please try again.' }]);
    } catch {
      // Fallback local answer when backend unavailable
      const fallback = activeBadge
        ? `To earn the **${activeBadge.title}** badge:\n\n1️⃣ Complete all skill requirements with a registered Badge Examiner.\n2️⃣ The examiner will sign and stamp your completion certificate.\n3️⃣ Upload the certificate in the Proficiency Badge Library.\n4️⃣ Your Scout Leader will verify it.\n\nFor specific requirements, refer to the SLSA 2022 syllabus booklet for ${activeBadge.code}.`
        : "I'm having trouble connecting right now. Please check your backend server is running at localhost:5000.";
      setChatHistory(prev => [...prev, { role: 'ai', content: fallback }]);
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(message); };

  const startNewChat = () => {
    setChatHistory([DEFAULT_WELCOME]);
    setActiveBadge(null);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
    setChatHistory([DEFAULT_WELCOME]);
    setActiveBadge(null);
    if (typeof window !== 'undefined') {
      (window as any).localStorage?.removeItem('scout-ai-chat-history');
    }
  };

  /* Quick prompts for badge context */
  const quickPrompts = activeBadge ? [
    `What do I need to do for ${activeBadge.title}?`,
    'Who is the Badge Examiner?',
    'What certificate do I upload?',
  ] : [
    'What is the Scout Award?',
    'How do I earn a proficiency badge?',
    'What is the President\'s Scout Award?',
  ];

  // Do not show the floating assistant on the dedicated AI assistant page
  if (pathname === '/scout/ai-assistant' || !isLoaded) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3">

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-[440px] sm:w-[480px] h-[640px] min-w-[320px] min-h-[400px] max-w-[92vw] max-h-[85vh] resize overflow-auto flex flex-col shadow-2xl border border-slate-200 bg-white rounded-[2rem]">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center">
                <Bot size={20} className="text-slate-900" />
              </div>
              <div>
                <p className="font-black text-sm leading-none">Scout Assistant</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-bold">
                    {activeBadge ? `📌 ${activeBadge.code} — ${activeBadge.title}` : 'Online & Ready'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={startNewChat} title="New Chat" className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white">
                <PlusCircle size={18} />
              </button>
              <button onClick={handleCloseChat} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Badge context pill */}
          {activeBadge && (
            <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2">
              <span className="text-lg">{activeBadge.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-yellow-800 truncate">{activeBadge.title}</p>
                <p className="text-[10px] text-yellow-600">{activeBadge.group} · {activeBadge.code}</p>
              </div>
              <button onClick={() => setActiveBadge(null)} className="text-yellow-500 hover:text-yellow-700">
                <X size={12} />
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-scroll custom-scrollbar space-y-4 bg-slate-50">
            {chatHistory.map((chat, i) => (
              <div key={i} className={`flex gap-2.5 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-black ${chat.role === 'ai' ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900'}`}>
                  {chat.role === 'ai' ? <Bot size={14} className="text-slate-900" /> : <User size={14} />}
                </div>
                <div className={`p-3.5 rounded-2xl max-w-[84%] text-sm leading-snug whitespace-pre-wrap ${
                  chat.role === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                }`}>
                  {chat.role === 'ai' ? (
                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-1.5 prose-p:leading-snug prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 prose-pre:bg-slate-800 prose-pre:text-slate-100">
                      <ReactMarkdown>
                        {chat.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    chat.content
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-yellow-400 flex items-center justify-center">
                  <Bot size={14} className="text-slate-900" />
                </div>
                <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                  {[0,1,2].map(d => (
                    <div key={d} className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick prompts */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto flex-shrink-0">
            {quickPrompts.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors whitespace-nowrap">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text" value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder={activeBadge ? `Ask about ${activeBadge.title}…` : 'Ask about badges or awards…'}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm font-medium"
              />
              <button type="submit" disabled={!message.trim() || busy}
                className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl disabled:opacity-40 hover:bg-slate-700 transition-colors flex-shrink-0">
                <Send size={16} />
              </button>
            </form>
          </div>
        </Card>
      )}

      {/* Context badge tooltip when closed */}
      {!isOpen && activeBadge && (
        <div className="bg-white border border-slate-200 shadow-xl px-3 py-2 rounded-2xl flex items-center gap-2 animate-bounce">
          <Sparkles size={13} className="text-yellow-500" />
          <p className="text-[11px] font-black text-slate-800">Ask about {activeBadge.title}</p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => {
          if (isOpen) {
            handleCloseChat();
          } else {
            setIsOpen(true);
          }
        }}
        className={`w-14 h-14 rounded-2xl shadow-2xl border-4 border-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${isOpen ? 'bg-slate-700 rotate-12' : 'bg-slate-900'}`}
      >
        {isOpen
          ? <X className="text-white" size={22} />
          : (
            <div className="relative">
              <MessageCircle className="text-white" size={26} />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-400 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
          )
        }
      </button>
    </div>
  );
}
