'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, CheckSquare, Target } from 'lucide-react';

interface OverviewStatsProps {
  stats?: {
    badgesEarned: number;
    requirementsCompleted: number;
    upcomingMilestones: number;
    activityPoints: number;
  };
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  const displayStats = stats || {
    badgesEarned: 12,
    requirementsCompleted: 48,
    upcomingMilestones: 3,
    activityPoints: 850
  };

  const statConfig = [
    { label: 'Badges Earned', value: displayStats.badgesEarned, icon: Award, color: 'text-blue-600', bg: 'bg-blue-100/50', border: 'group-hover:border-blue-200', glow: 'group-hover:shadow-blue-500/20' },
    { label: 'Tasks Done', value: displayStats.requirementsCompleted, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-100/50', border: 'group-hover:border-emerald-200', glow: 'group-hover:shadow-emerald-500/20' },
    { label: 'Upcoming', value: displayStats.upcomingMilestones, icon: Target, color: 'text-purple-600', bg: 'bg-purple-100/50', border: 'group-hover:border-purple-200', glow: 'group-hover:shadow-purple-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statConfig.map((stat, i) => (
        <Card 
          key={i} 
          className={`relative p-6 border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${stat.border} ${stat.glow} overflow-hidden`}
        >
          {/* Subtle background glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-[1.25rem] ${stat.bg} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            
            <div className="relative">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </h3>
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-2 group-hover:text-slate-600 transition-colors">
              {stat.label}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
