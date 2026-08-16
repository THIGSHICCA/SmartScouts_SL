'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, Lock, CheckCircle2, Trophy } from 'lucide-react';
import { Badge } from '@/data/badges';

interface EarnedBadgesGridProps {
  badges: Badge[];
}

export function EarnedBadgesGrid({ badges }: EarnedBadgesGridProps) {
  return (
    <Card className="p-8 border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] hover:shadow-xl transition-shadow duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100/50 flex items-center justify-center">
            <Trophy size={20} className="text-amber-500" />
          </div>
          Achievement Portfolio
        </h2>
        <span className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-600">
          {badges.filter(b => b.status === 'completed').length} Earned
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {badges.map((badge, idx) => {
          const isCompleted = badge.status === 'completed';
          const isInProgress = badge.status === 'in_progress' && !badge.isLocked;
          
          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center text-center p-5 rounded-[1.5rem] transition-all duration-500 relative group cursor-pointer ${
                isCompleted ? 'bg-gradient-to-b from-white to-slate-50 border-2 border-amber-100/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(251,191,36,0.15)] hover:-translate-y-2' : 
                isInProgress ? 'bg-white border-2 border-blue-50 hover:border-blue-100 hover:shadow-md' : 
                'bg-slate-50/50 border-2 border-transparent opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500'
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3 z-10">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                  </div>
                ) : badge.isLocked ? (
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                    <Lock size={12} className="text-slate-400" />
                  </div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-500/20" />
                )}
              </div>

              <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-4xl mb-4 transition-transform duration-500 relative ${
                isCompleted ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 shadow-inner group-hover:scale-110 group-hover:rotate-6' : 'bg-slate-100/50'
              }`}>
                <span className="relative z-10 drop-shadow-md flex items-center justify-center w-full h-full">
                  {badge.icon.startsWith('/') || badge.icon.includes('.') ? (
                    <img src={badge.icon} alt={badge.title} className="w-10 h-10 object-contain" />
                  ) : (
                    badge.icon
                  )}
                </span>
                {isCompleted && (
                  <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}
              </div>
              
              <h3 className={`text-[11px] font-black uppercase tracking-tight leading-tight transition-colors duration-300 ${
                isCompleted ? 'text-slate-800 group-hover:text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
              }`}>
                {badge.title}
              </h3>
              
              {isInProgress && (
                <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${badge.progress}%` }} />
                </div>
              )}

              {/* Tooltip on Hover */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl z-20">
                {isCompleted ? 'Earned on Oct 2023' : isInProgress ? `${badge.progress}% Completed` : 'Locked'}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
