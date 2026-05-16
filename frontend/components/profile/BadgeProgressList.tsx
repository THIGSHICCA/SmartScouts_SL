'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Star } from 'lucide-react';
import { Badge } from '@/data/badges';

interface BadgeProgressListProps {
  badges: Badge[];
}

export function BadgeProgressList({ badges }: BadgeProgressListProps) {
  const inProgressBadges = badges.filter(b => b.status === 'in_progress' && !b.isLocked);

  return (
    <Card className="p-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <TrendingUp size={24} className="text-emerald-500" />
          Ongoing Progression
        </h2>
        <span className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
          {inProgressBadges.length} Active
        </span>
      </div>

      <div className="space-y-10">
        {inProgressBadges.length > 0 ? (
          inProgressBadges.map((badge) => (
            <div key={badge.id} className="group">
              <div className="flex justify-between items-end mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform`}>
                    {badge.icon}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight">{badge.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Level</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 leading-none">{badge.progress}%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Completion</p>
                </div>
              </div>
              
              <div className="relative h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${
                    badge.color === 'green' ? 'bg-emerald-500' :
                    badge.color === 'orange' ? 'bg-orange-500' :
                    badge.color === 'blue' ? 'bg-blue-600' :
                    badge.color === 'yellow' ? 'bg-yellow-500' :
                    'bg-purple-600'
                  }`}
                  style={{ width: `${badge.progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center flex flex-col items-center gap-4">
            <Star size={48} className="text-slate-100" />
            <p className="text-slate-400 font-bold">No active badge progress found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
