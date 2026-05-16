'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, Lock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/data/badges';

interface EarnedBadgesGridProps {
  badges: Badge[];
}

export function EarnedBadgesGrid({ badges }: EarnedBadgesGridProps) {
  return (
    <Card className="p-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <Award size={24} className="text-yellow-500" />
          Achievement Portfolio
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {badges.map((badge) => {
          const isCompleted = badge.status === 'completed';
          const isInProgress = badge.status === 'in_progress' && !badge.isLocked;
          
          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-center text-center p-6 rounded-[2rem] transition-all duration-500 relative group ${
                isCompleted ? 'bg-emerald-50/50' : 
                isInProgress ? 'bg-blue-50/50' : 
                'bg-slate-50/50 opacity-60 grayscale'
              }`}
            >
              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {isCompleted ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : badge.isLocked ? (
                  <Lock size={16} className="text-slate-300" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                )}
              </div>

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-500 ${
                isCompleted ? 'bg-white shadow-md scale-110' : 'bg-white/50'
              } group-hover:scale-125`}>
                {badge.icon}
              </div>
              
              <h3 className={`text-xs font-black uppercase tracking-tight leading-tight ${
                isCompleted ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {badge.title}
              </h3>
              
              {isInProgress && (
                <div className="mt-3 w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${badge.progress}%` }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
