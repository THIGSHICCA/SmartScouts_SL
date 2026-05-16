import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col items-center justify-center">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-green-50/50 to-transparent -z-10"></div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-green-600 flex items-center justify-center shadow-lg transform rotate-3">
            <span className="text-white font-bold text-3xl">S</span>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Digitizing the <span className="text-green-600">Scouting Journey</span> in Sri Lanka
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
          The modern platform for scouts and leaders to track progress, verify achievements, and manage proficiency badges with ease.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button className="w-full sm:w-auto h-14 px-8 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg transform transition hover:-translate-y-0.5">
              Start Your Journey
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
              Existing Member Login
            </Button>
          </Link>
        </div>

        {/* Minimal Feature Highlights (optional, but keep it minimal as requested) */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900">Digital Record Book</h3>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900">Real-time Verification</h3>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h3 className="font-bold text-slate-900">Progress Insights</h3>
          </div>
        </div>
      </main>
    </div>
  );
}
