'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, Lock, ChevronRight } from 'lucide-react';
import { badgesData } from '@/data/badges';

export default function BadgeGallery() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Official Progression</h1>
          <p className="text-slate-900 mt-1">Track your journey through the Sri Lanka Scout Association awards.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-xl font-bold shadow-sm border border-yellow-200">
          <Trophy size={20} className="text-yellow-600" />
          <span>0 Awards Earned</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badgesData.map((badge) => (
          <Card key={badge.id} className={`flex flex-col h-full hover:shadow-md transition-all relative overflow-hidden group ${badge.isLocked ? 'opacity-90 grayscale-[0.5]' : ''}`}>
            
            {/* Locked Overlay */}
            {badge.isLocked && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center border-2 border-gray-100 transition-opacity group-hover:opacity-0 pointer-events-none">
                <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                  <Lock size={24} className="text-slate-900" />
                </div>
                <h3 className="font-bold text-slate-900">Locked</h3>
              </div>
            )}

            <div className={`p-6 border-t-4 flex-1 flex flex-col ${
              badge.color === 'green' ? 'border-t-green-500 bg-green-50/30' : 
              badge.color === 'blue' ? 'border-t-blue-500 bg-blue-50/30' : 
              badge.color === 'yellow' ? 'border-t-yellow-500 bg-yellow-50/30' :
              badge.color === 'purple' ? 'border-t-purple-500 bg-purple-50/30' :
              'border-t-orange-500 bg-orange-50/30'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm bg-white`}>
                  {badge.icon}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">{badge.progress}%</span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-2">{badge.title}</h2>
              
              <div className="mt-auto pt-4">
                <div className="flex justify-between text-xs text-slate-900 font-black mb-2">
                  <span>PROGRESS</span>
                  <span>{badge.progress === 100 ? 'COMPLETED' : `${badge.progress}%`}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      badge.color === 'green' ? 'bg-green-500' : 
                      badge.color === 'blue' ? 'bg-blue-500' : 
                      badge.color === 'yellow' ? 'bg-yellow-500' : 
                      badge.color === 'purple' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} 
                    style={{ width: `${badge.progress}%` }}
                  ></div>
                </div>
                
                <Link href={`/scout/badges/${badge.id}`} className="block w-full">
                  <Button variant={badge.isLocked ? "outline" : "primary"} className="w-full justify-between group-hover:shadow-md">
                    {badge.isLocked ? "View Requirements" : "Continue Progress"}
                    <ChevronRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
