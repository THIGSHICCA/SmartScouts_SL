'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Award, Star } from 'lucide-react';

interface AdditionalAchievementsProps {
  achievements: string[];
}

export function AdditionalAchievements({ achievements }: AdditionalAchievementsProps) {
  return (
    <Card className="p-8 border-2 border-transparent shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] hover:shadow-xl transition-shadow duration-500">
      <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Award size={20} className="text-indigo-600" />
          </div>
          Extra Achievements
        </h2>
        <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600">
          {achievements.length} Total
        </span>
      </div>

      <div className="space-y-4">
        {achievements.length > 0 ? (
          achievements.map((achievement, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-3 group-hover:border-indigo-200 transition-all duration-300 shrink-0">
                <Star size={18} className="fill-indigo-50 text-indigo-500" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-slate-900 transition-colors">
                  {achievement}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
              <Award size={28} className="text-slate-300" />
            </div>
            <h3 className="text-base font-black text-slate-700">No extra achievements</h3>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              Add your custom achievements and badges in the "Edit Profile" menu to display them here.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
