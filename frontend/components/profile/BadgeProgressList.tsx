'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Star, ChevronRight } from 'lucide-react';
import { Badge } from '@/data/badges';

interface BadgeProgressListProps {
  badges: Badge[];
}

export function BadgeProgressList({ badges }: BadgeProgressListProps) {
  const inProgressBadges = badges.filter(b => b.status === 'in_progress' && !b.isLocked);

  return (
    <Card className="p-8 border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] hover:shadow-xl transition-shadow duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          Active Objectives
        </h2>
        <span className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
          {inProgressBadges.length} Active
        </span>
      </div>

      <div className="space-y-6">
        {inProgressBadges.length > 0 ? (
          inProgressBadges.map((badge, idx) => (
            <div 
              key={badge.id} 
              className="group p-5 rounded-3xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-100 cursor-pointer"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center gap-5">
                  <div className={`w-16 h-16 rounded-[1.25rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md transition-all duration-500`}>
                    {badge.icon.startsWith('/') || badge.icon.includes('.') ? (
                      <img src={badge.icon} alt={badge.title} className="w-10 h-10 object-contain" />
                    ) : (
                      badge.icon
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{badge.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1 flex items-center gap-1">
                      Current Level <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-black text-slate-900 leading-none">{badge.progress}</span>
                    <span className="text-lg font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Completion</p>
                </div>
              </div>
              
              <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    badge.color === 'green' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                    badge.color === 'orange' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                    badge.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                    badge.color === 'yellow' ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]' :
                    'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  }`}
                  style={{ width: `${badge.progress}%` }}
                >
                  {/* Animated glare effect on progress bar */}
                  <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <Star size={32} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-black text-slate-700">No active objectives</h3>
            <p className="text-sm text-slate-400 font-medium">Start working on new badges to see your progress here.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
