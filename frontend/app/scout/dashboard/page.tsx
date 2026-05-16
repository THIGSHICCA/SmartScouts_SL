'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Upload, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ScoutDashboard() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Welcome back, Alex! 👋</h1>
          <p className="text-slate-900 font-bold text-lg">Your scouting journey is progressing beautifully.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-6 py-2 bg-yellow-400 text-slate-900 border-none rounded-xl font-black shadow-lg shadow-yellow-200 uppercase tracking-widest">
            Scout Rank
          </Badge>
        </div>
      </div>

      {/* Main Progression Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-slate-900">Official Progression</h2>
          <Link href="/scout/badges" className="text-sm font-black text-slate-900 hover:text-blue-600 hover:underline uppercase tracking-widest">
            View All Awards →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Badge */}
          <Link href="/scout/badges/membership">
            <Card className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner text-3xl">
                  ⚜️
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">42%</span>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-1">Completion</p>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Membership Badge</h3>
              <p className="text-slate-900 font-bold mb-6">3 of 7 requirements verified by PL.</p>
              <div className="w-full bg-slate-100 rounded-full h-3 shadow-inner">
                <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 shadow-lg shadow-emerald-200" style={{ width: '42%' }}></div>
              </div>
            </Card>
          </Link>

          {/* Proficiency Badges */}
          <Link href="/scout/proficiency">
            <Card className="p-8 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner text-3xl text-blue-600">
                  ⭐
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-slate-900">120+</span>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mt-1">Available</p>
                </div>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Proficiency Badges</h3>
              <p className="text-slate-900 font-bold mb-6">Master specialized skills and earn honors.</p>
              <Button variant="primary" className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-200">
                Explore Skills Library
              </Button>
            </Card>
          </Link>
        </div>
      </section>

      {/* Activity Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Recent Activity</h2>
          <div className="space-y-6">
            <div className="flex gap-4 items-center p-4 rounded-2xl bg-emerald-50 border border-emerald-100 transition-all hover:scale-[1.02]">
              <CheckCircle className="text-emerald-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-black text-slate-900">Scout Promise Recitation</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Approved by Patrol Leader</p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 rounded-2xl bg-orange-50 border border-orange-100 transition-all hover:scale-[1.02]">
              <Clock className="text-orange-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-black text-slate-900">National Anthem Audio</p>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-widest">Pending Review</p>
              </div>
            </div>
            <div className="flex gap-4 items-center p-4 rounded-2xl bg-emerald-50 border border-emerald-100 transition-all hover:scale-[1.02]">
              <CheckCircle className="text-emerald-500 flex-shrink-0" size={24} />
              <div>
                <p className="font-black text-slate-900">Scout Law Recitation</p>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Approved • 2 days ago</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-4 border-dashed border-slate-100 bg-white hover:bg-slate-50 transition-all rounded-[2.5rem] flex flex-col justify-between group">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">Upload Evidence</h2>
            <p className="text-slate-900 font-bold leading-relaxed mb-8">
              Submit your videos, audio recordings, or signed forms to prove your skills.
            </p>
          </div>
          <div className="p-8 border-2 border-dashed border-slate-200 bg-slate-50 rounded-[2rem] cursor-pointer group-hover:bg-slate-100 transition-all text-center">
            <Upload className="mx-auto text-slate-900 mb-3 group-hover:-translate-y-1 transition-transform" size={40} />
            <p className="font-black text-slate-900 uppercase tracking-widest">Browse Local Files</p>
          </div>
        </Card>
      </div>

      {/* Floating Info */}
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-sm font-black text-yellow-400 uppercase tracking-widest">Did you know?</p>
          <p className="text-lg font-bold">You can ask the AI Assistant on the right for badge requirements anytime!</p>
        </div>
        <div className="flex gap-4">
          <Badge className="bg-white/10 text-white border-none px-4 py-2 font-black uppercase tracking-widest">Official 2022 Curriculum</Badge>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  );
}
