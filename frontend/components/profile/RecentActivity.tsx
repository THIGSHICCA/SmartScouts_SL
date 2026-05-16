'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { CheckCircle2, Clock, Award, Shield, BookOpen } from 'lucide-react';

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

export function RecentActivity() {
  return (
    <Card className="p-8 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem]">
      <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <Clock size={24} className="text-indigo-500" />
        Recent Activity
      </h2>
      
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:border-l-2 before:border-slate-50 before:h-full">
        {defaultActivities.map((activity) => (
          <div key={activity.id} className="relative pl-10 flex items-start gap-4 group">
            {/* Timeline Dot */}
            <div className={`absolute left-[13px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-transform group-hover:scale-150 ${
              activity.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-400'
            }`} />
            
            <div className="flex-1 bg-slate-50/50 p-4 rounded-2xl group-hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-slate-900">{activity.title}</h3>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{activity.date}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">{activity.description}</p>
              
              <div className="mt-3 flex items-center gap-2">
                {activity.status === 'verified' ? (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={10} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Clock size={10} /> Pending
                  </span>
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                  {activity.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-8 py-4 text-sm font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest border-t border-slate-50 transition-colors">
        View All History
      </button>
    </Card>
  );
}
