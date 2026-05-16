'use client';

import React from 'react';
import { useAppContext } from '@/context/AppContext';
import { ScoutIdentityCard } from '@/components/profile/ScoutIdentityCard';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { OverviewStats } from '@/components/profile/OverviewStats';
import { BadgeProgressList } from '@/components/profile/BadgeProgressList';
import { EarnedBadgesGrid } from '@/components/profile/EarnedBadgesGrid';

export default function ScoutProfilePage() {
  const { badges, scouts } = useAppContext();
  
  // Find the current scout (My Profile)
  const myScout = scouts.find(s => s.id === 999) || scouts[0];
  
  // Mock data for extended profile details
  const scoutDetails = {
    name: 'Alex Johnson',
    role: 'Senior Scout • Patrol Leader',
    troop: '1st Colombo Scout Group',
    batch: 'Batch of 2022',
    scoutId: 'SL-2022-045',
    joinDate: 'March 2022',
    district: 'Colombo South',
    email: 'alex.scout@gmail.com',
  };

  // Calculate stats
  const badgesEarned = badges.filter(b => b.status === 'completed').length;
  const completedRequirements = badges.reduce((acc, b) => {
    let count = 0;
    b.categories.forEach(cat => {
      cat.requirements.forEach(req => {
        if (req.status === 'completed') count++;
      });
    });
    return acc + count;
  }, 0);

  const stats = {
    badgesEarned,
    requirementsCompleted: completedRequirements,
    upcomingMilestones: 3,
    activityPoints: 850 + (completedRequirements * 10)
  };

  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto px-4 md:px-0">
      {/* 1. Scout Identity Card Component */}
      <ScoutIdentityCard scout={scoutDetails} />

      {/* 3. Overview Stats Component */}
      <OverviewStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* 4. Badge Progress List Component */}
          <BadgeProgressList badges={badges} />

          {/* 5. Earned Badges Grid Component */}
          <EarnedBadgesGrid badges={badges} />
        </div>

        <div className="space-y-10">
          {/* 2. Recent Activity Component */}
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

