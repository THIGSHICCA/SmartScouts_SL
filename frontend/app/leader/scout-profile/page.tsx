'use client';

import React, { useState, useEffect } from 'react';
import { ScoutIdentityCard } from '@/components/profile/ScoutIdentityCard';
import { OverviewStats } from '@/components/profile/OverviewStats';
import { BadgeProgressList } from '@/components/profile/BadgeProgressList';
import { EarnedBadgesGrid } from '@/components/profile/EarnedBadgesGrid';
import { AdditionalAchievements } from '@/components/profile/AdditionalAchievements';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield } from 'lucide-react';
import { badgesData as initialBadgesData, Badge, RequirementStatus, BadgeStatus } from '@/data/badges';

const API = 'http://localhost:5000/api';

interface ScoutProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  scout_reg_no: string | null;
  scout_district: string | null;
  dob: string | null;
  role: string;
  troop_id: number | null;
  troop_name: string | null;
  troop_code: string | null;
  patrol_name: string | null;
  recent_badge: string | null;
  created_at?: string;
}

interface RecordBadge {
  id: string;
  name: string;
  requirements: {
    id: number;
    status: string | null;
    sub_tasks?: { id: number; status: string | null }[];
  }[];
}

export default function LeaderScoutProfilePage() {
  const router = useRouter();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [profile, setProfile] = useState<ScoutProfile | null>(null);
  const [recordBook, setRecordBook] = useState<RecordBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setTargetId(parseInt(id, 10));
      } else {
        setError('No scout ID provided.');
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (targetId === null) return;
    const token = sessionStorage.getItem('token');
    if (!token) {
      setError('Not authenticated.');
      setLoading(false);
      return;
    }

    // Fetch scout profile & record book progress in parallel
    Promise.all([
      fetch(`${API}/users/scouts/${targetId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API}/progress/record-book?scout_id=${targetId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
    ])
      .then(([prof, rb]) => {
        if (prof) {
          setProfile(prof);
        } else {
          setError('Scout not found in your troop.');
        }
        if (Array.isArray(rb)) {
          setRecordBook(rb);
        }
      })
      .catch(() => setError('Failed to load scout profile.'))
      .finally(() => setLoading(false));
  }, [targetId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500">Loading scout profile…</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <p className="text-red-500 font-bold text-lg mb-4">{error || 'Scout not found'}</p>
        <button onClick={() => router.back()} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">← Go Back</button>
      </div>
    );
  }

  // Map backend user to DetailedScout shape required by ScoutIdentityCard
  const myDetailedScout = {
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`.trim(),
    roles: [profile.role === 'patrol_leader' ? 'Patrol Leader' : 'Scout'],
    troop: profile.troop_name ? `${profile.troop_name} (${profile.troop_code})` : 'Unassigned',
    batch: 'Batch of ' + new Date(profile.created_at || Date.now()).getFullYear(),
    scoutId: profile.scout_reg_no || 'N/A',
    joinDate: profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
    district: profile.scout_district || 'N/A',
    email: profile.email,
    achievements: profile.recent_badge ? [profile.recent_badge] : [],
  };

  // Map record book progress to badges array
  const mappedBadges: Badge[] = initialBadgesData.map(badgeTemplate => {
    const dbBadge = recordBook.find(b => b.id === badgeTemplate.id);
    if (!dbBadge) return badgeTemplate;

    const mappedCategories = badgeTemplate.categories.map(cat => {
      const mappedReqs = cat.requirements.map(req => {
        const dbReq = dbBadge.requirements?.find(r => r.id === req.id);
        const reqStatus: RequirementStatus = dbReq?.status === 'verified'
          ? 'completed'
          : (dbReq?.status === 'pending_leader' || dbReq?.status === 'pending_pl')
            ? 'pending_pl'
            : 'incomplete';

        const mappedSubtasks = req.subTasks?.map(st => {
          const dbSub = dbReq?.sub_tasks?.find(s => s.id === st.id);
          const subStatus: RequirementStatus = dbSub?.status === 'verified'
            ? 'completed'
            : (dbSub?.status === 'pending_leader' || dbSub?.status === 'pending_pl')
              ? 'pending_pl'
              : 'incomplete';
          return {
            ...st,
            status: subStatus
          };
        });

        return {
          ...req,
          status: reqStatus,
          subTasks: mappedSubtasks
        };
      });

      return {
        ...cat,
        requirements: mappedReqs
      };
    });

    const total = dbBadge.requirements?.length ?? 0;
    const done = dbBadge.requirements?.filter(r => r.status === 'verified').length ?? 0;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    let badgeStatus: BadgeStatus = 'in_progress';
    if (progress === 100) {
      badgeStatus = 'completed';
    } else if (dbBadge.requirements?.some(r => r.status === 'pending_leader')) {
      badgeStatus = 'pending_leader';
    }

    return {
      ...badgeTemplate,
      progress,
      status: badgeStatus,
      categories: mappedCategories,
      isLocked: false
    };
  });

  // Calculate overall stats
  const totalReqs = recordBook.reduce((s, b) => s + (b.requirements?.length ?? 0), 0);
  const verifiedReqs = recordBook.reduce((s, b) => s + (b.requirements?.filter(r => r.status === 'verified').length ?? 0), 0);

  const stats = {
    badgesEarned: mappedBadges.filter(b => b.status === 'completed').length,
    requirementsCompleted: verifiedReqs,
    upcomingMilestones: totalReqs === 0 ? 0 : Math.max(0, totalReqs - verifiedReqs),
    activityPoints: verifiedReqs * 100,
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Subtle background gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />

      <div className="relative space-y-12 max-w-[1400px] mx-auto px-4 sm:px-8 pt-8">

        {/* Header bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          {/* Read-only badge so it's clear this is a view-only page */}
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-black uppercase tracking-widest shadow-sm">
            <Shield size={14} />
            Leader View — Read Only
          </div>
        </div>

        {/* Scout Identity Card — read-only (isOwnProfile=false, no onSave) */}
        <ScoutIdentityCard
          scout={myDetailedScout}
          onSave={() => {}}
          isOwnProfile={false}
        />

        {/* Overview Stats */}
        <OverviewStats stats={stats} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            {/* Badge Progress */}
            <BadgeProgressList badges={mappedBadges} />

            {/* Earned Badges */}
            <EarnedBadgesGrid badges={mappedBadges} />

            {/* Achievements */}
            <AdditionalAchievements achievements={myDetailedScout.achievements || []} />
          </div>

          <div className="space-y-10">
            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </div>

      </div>
    </div>
  );
}
