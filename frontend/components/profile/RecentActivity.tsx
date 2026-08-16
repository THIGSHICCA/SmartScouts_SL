'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, Activity as ActivityIcon } from 'lucide-react';

interface Activity {
  id: string;
  type: 'requirement' | 'badge' | 'milestone';
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'verified';
}

const defaultActivities: Activity[] = [
  { id: '1', type: 'requirement', title: 'Tie basic knots', description: 'Completed all 5 basic knots for Membership Badge', date: '2 hours ago', status: 'verified' },
  { id: '2', type: 'badge', title: 'Linguist Badge', description: 'Earned the Junior Linguist Proficiency Badge', date: 'Yesterday', status: 'verified' },
  { id: '3', type: 'requirement', title: 'National Anthem', description: 'Demonstrated knowledge of National Anthem history', date: '2 days ago', status: 'completed' },
  { id: '4', type: 'milestone', title: 'Community Service', description: 'Participated in the Colombo Beach Cleanup', date: '4 days ago', status: 'verified' },
  { id: '5', type: 'requirement', title: 'Scout Promise', description: 'Recited and understood the Scout Promise', date: '1 week ago', status: 'verified' },
];

interface RecentActivityProps {
  activities?: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const displayActivities = (activities && activities.length > 0) ? activities : defaultActivities;
  return (
    <Card className="p-8 border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] hover:shadow-xl transition-shadow duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100/50 flex items-center justify-center">
            <ActivityIcon size={20} className="text-indigo-600" />
          </div>
          Recent Activity
        </h2>
      </div>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:border-l-2 before:border-slate-100 before:h-full">
        {displayActivities.map((activity, idx) => (
          <div 
            key={activity.id} 
            className="relative pl-12 flex items-start gap-4 group cursor-pointer"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Glowing Timeline Dot */}
            <div className={`absolute left-[11px] top-2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-all duration-300 group-hover:scale-125 ${
              activity.status === 'verified' ? 'bg-emerald-500 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-amber-400 group-hover:shadow-[0_0_12px_rgba(251,191,36,0.6)]'
            }`} />
            
            <div className="flex-1 bg-white border-2 border-slate-50/50 p-5 rounded-2xl group-hover:bg-slate-50 group-hover:border-slate-100 group-hover:shadow-md transition-all duration-300 transform group-hover:-translate-y-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{activity.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{activity.date}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{activity.description}</p>
              
              <div className="mt-4 flex items-center gap-2">
                {activity.status === 'verified' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                    <Clock size={12} /> Pending
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {activity.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-4 text-xs font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest border-t border-slate-100 hover:bg-slate-50 transition-colors rounded-b-2xl -mb-4">
        View All History
      </button>
    </Card>
  );
}
