'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, CheckSquare, Target, Zap } from 'lucide-react';

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
    { label: 'Badges Earned', value: displayStats.badgesEarned, icon: Award, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Tasks Done', value: displayStats.requirementsCompleted, icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Upcoming', value: displayStats.upcomingMilestones, icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Scout Points', value: displayStats.activityPoints, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statConfig.map((stat, i) => (
        <Card key={i} className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] group hover:-translate-y-2 transition-all duration-500">
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{stat.label}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
