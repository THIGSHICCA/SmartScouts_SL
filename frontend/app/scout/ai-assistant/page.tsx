'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Calendar, Star, Users, Award, Shield, Crown, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';

const API = 'http://localhost:5000/api';

interface ChatMsg {
  role: 'ai' | 'user';
  content: string;
}

interface BadgePlanItem {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  description: string;
  icon: string;
}

export default function ScoutAssistantPage() {
  const [activeTab, setActiveTab] = useState<'chat' | 'plan'>('chat');

  // Chat State
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = (window as any).localStorage?.getItem('scout-ai-assistant-page-history');
      if (saved) {
        try {
          setChatHistory(JSON.parse(saved));
        } catch {
          setChatHistory([{ role: 'ai', content: 'Hello! I am your Scout Assistant. Ask me anything about award requirements, proficiency badges, or how to progress!' }]);
        }
      } else {
        setChatHistory([{ role: 'ai', content: 'Hello! I am your Scout Assistant. Ask me anything about award requirements, proficiency badges, or how to progress!' }]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      (window as any).localStorage?.setItem('scout-ai-assistant-page-history', JSON.stringify(chatHistory));
    }
  }, [chatHistory, isLoaded]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  // Plan State
  const [dob, setDob] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [plan, setPlan] = useState<BadgePlanItem[]>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, activeTab]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || busy) return;

    const userText = message;
    setChatHistory(prev => [...prev, { role: 'user', content: userText }]);
    setMessage('');
    setBusy(true);

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ question: userText })
      });
      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', content: data.answer ?? data.reply ?? data.message ?? 'Sorry, I had trouble answering that.' }
      ]);
    } catch {
      setChatHistory(prev => [
        ...prev,
        { role: 'ai', content: "I'm having trouble connecting right now. Please ensure the backend server is running." }
      ]);
    } finally {
      setBusy(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dob || !joiningDate) {
      setPlanError('Please provide both Date of Birth and Joining Date.');
      return;
    }
    setPlanError('');
    setPlanLoading(true);

    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/progress/badges/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dob, joiningDate })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPlan(data.plan);
      } else {
        setPlanError(data.message || 'Failed to generate plan.');
      }
    } catch (err) {
      setPlanError('Network error while generating the plan.');
    } finally {
      setPlanLoading(false);
    }
  };

  const startNewChat = () => {
    setChatHistory([{ role: 'ai', content: 'Hello! I am your Scout Assistant. Ask me anything about award requirements, proficiency badges, or how to progress!' }]);
  };

  const renderBadgeImage = (id: string) => {
    let filename = 'scout-award.png';
    switch (id) {
      case 'membership': filename = 'membership-badge.png'; break;
      case 'scout_award': filename = 'scout-award.png'; break;
      case 'cc_award': filename = 'chief-commissioner-award.png'; break;
      case 'pm_award': filename = 'prime-minister-award.png'; break;
      case 'president_award': filename = 'president-award.png'; break;
    }
    return <img src={`/images/badges/${filename}`} alt="badge" className="w-8 h-8 object-contain" />;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] min-h-[600px]">
      {/* Header & Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scout Assistant</h1>

        {/* Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit shadow-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Bot size={18} />
            Chat Assistant
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
              activeTab === 'plan'
                ? 'bg-white text-indigo-700 shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <Calendar size={18} />
            Generate Badge Plan
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'chat' && (
          <Card className="h-full flex flex-col bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 px-6 bg-white border-b border-slate-200 shadow-sm z-10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <Bot size={20} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900 leading-tight">Scout Assistant</h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <p className="text-xs font-bold text-slate-500">Online & Ready</p>
                  </div>
                </div>
              </div>
              <button
                onClick={startNewChat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 border border-transparent hover:border-indigo-100"
              >
                <PlusCircle size={16} />
                New Chat
              </button>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-6 md:p-8 overflow-y-scroll custom-scrollbar space-y-6 bg-slate-50">
              {chatHistory.map((chat, i) => (
                <div key={i} className={`flex gap-4 ${chat.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-black shadow-md ${chat.role === 'ai' ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                    {chat.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  <div className={`p-5 rounded-2xl max-w-[85%] text-base leading-snug whitespace-pre-wrap shadow-sm ${
                    chat.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                  }`}>
                    {chat.role === 'ai' ? (
                      <div className="prose prose-slate max-w-none prose-p:my-1.5 prose-p:leading-snug prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 prose-pre:bg-slate-800 prose-pre:text-slate-100">
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
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md text-white">
                    <Bot size={20} />
                  </div>
                  <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
                    {[0, 1, 2].map(d => (
                      <div key={d} className="w-2.5 h-2.5 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: `${d * 150}ms` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 md:p-5 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex gap-3 w-full">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Ask your question here..."
                  className="flex-1 px-5 py-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-base font-medium transition-all"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || busy}
                  className="w-14 h-14 flex items-center justify-center bg-indigo-600 text-white rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex-shrink-0"
                >
                  <Send size={22} className={!message.trim() || busy ? 'opacity-50' : ''} />
                </button>
              </form>
            </div>
          </Card>
        )}

        {activeTab === 'plan' && (
          <div className="h-full flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Form Section */}
            <Card className="w-full md:w-1/3 p-6 bg-white border border-slate-200 shadow-xl rounded-2xl h-fit">
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Calendar className="text-indigo-600" /> Plan Generator
              </h2>
              <p className="text-sm text-slate-500 mb-6">Enter your details to generate a timeline for your scouting journey.</p>
              
              <form onSubmit={handleGeneratePlan} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={e => setJoiningDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm font-medium"
                    required
                  />
                </div>
                
                {planError && <p className="text-red-500 text-sm font-bold">{planError}</p>}
                
                <button
                  type="submit"
                  disabled={planLoading}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {planLoading ? 'Generating...' : 'Generate Plan'}
                </button>
              </form>
            </Card>

            {/* Timeline Section */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl p-6 overflow-y-auto custom-scrollbar shadow-inner relative">
              {plan.length === 0 && !planLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                    <Star size={40} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-500">Your journey awaits</p>
                    <p className="text-sm">Fill out the form to generate your personalized timeline.</p>
                  </div>
                </div>
              ) : (
                <div className="relative pl-6 md:pl-8 border-l-2 border-indigo-200 space-y-8 py-4">
                  {plan.map((item, idx) => (
                    <div key={item.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[35px] md:-left-[43px] top-1 w-10 h-10 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center shadow-sm">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {renderBadgeImage(item.id)}
                        </div>
                      </div>
                      
                      <Card className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                          <div className="flex gap-2">
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100">
                              Earliest Completion: {item.endDate}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-3">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                            <Calendar size={14} /> Start: {item.startDate}
                          </div>
                          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded">
                            <Star size={14} /> Min. Duration: {item.duration}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
