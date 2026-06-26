'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ScoutIdentityCard } from '@/components/profile/ScoutIdentityCard';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { OverviewStats } from '@/components/profile/OverviewStats';
import { BadgeProgressList } from '@/components/profile/BadgeProgressList';
import { EarnedBadgesGrid } from '@/components/profile/EarnedBadgesGrid';
import { AdditionalAchievements } from '@/components/profile/AdditionalAchievements';

export default function ScoutProfilePage() {
  const { badges, scouts, detailedScouts, updateScoutProfile } = useAppContext();
  const [targetId, setTargetId] = useState<number>(999);

  // Extract ID from window URL in useEffect to prevent SSR/Build-time failures
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setTargetId(parseInt(id, 10));
      }
    }
  }, []);

  // Find the target detailed scout
  const myDetailedScout = detailedScouts.find(ds => ds.id === targetId) || detailedScouts.find(ds => ds.id === 999) || detailedScouts[0];
  const targetScoutBasic = scouts.find(s => s.id === targetId) || scouts[0];

  // Save changes callback
  const handleSaveProfile = (updatedProfile: any) => {
    updateScoutProfile(targetId, updatedProfile);
  };

  // Calculate stats based on target scout
  const badgesEarned = targetScoutBasic.completedBadges || 0;
  const completedRequirements = Math.round((targetScoutBasic.progress / 100) * 12);

  const stats = {
    badgesEarned,
    requirementsCompleted: completedRequirements,
    upcomingMilestones: targetScoutBasic.progress === 100 ? 0 : 2,
    activityPoints: 850 + (completedRequirements * 10)
  };

  const isOwnProfile = targetId === 999;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Subtle top background pattern/gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />
      
      <div className="relative space-y-12 max-w-[1400px] mx-auto px-4 sm:px-8 pt-8">
        
        {/* Back navigation button if not own profile */}
        {!isOwnProfile && (
          <div className="mb-4">
            <button 
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
        )}

        {/* 1. Scout Identity Card Component */}
        <ScoutIdentityCard 
          scout={myDetailedScout} 
          onSave={handleSaveProfile} 
          isOwnProfile={isOwnProfile}
        />

        {/* 3. Overview Stats Component */}
        <OverviewStats stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            {/* 4. Badge Progress List Component */}
            <BadgeProgressList badges={badges} />

            {/* 5. Earned Badges Grid Component */}
            <EarnedBadgesGrid badges={badges} />

            {/* 6. Additional Achievements Component */}
            <AdditionalAchievements achievements={myDetailedScout.achievements || []} />
          </div>

          <div className="space-y-10">
            {/* 2. Recent Activity Component */}
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}

