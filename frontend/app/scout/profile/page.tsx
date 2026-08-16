'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { badgesData, Badge } from '@/data/badges';
import { ScoutIdentityCard } from '@/components/profile/ScoutIdentityCard';
import { RecentActivity } from '@/components/profile/RecentActivity';
import { OverviewStats } from '@/components/profile/OverviewStats';
import { BadgeProgressList } from '@/components/profile/BadgeProgressList';
import { EarnedBadgesGrid } from '@/components/profile/EarnedBadgesGrid';
import { AdditionalAchievements } from '@/components/profile/AdditionalAchievements';
import { safeFetch } from '@/utils/safeFetch';

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return 'Recently';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Recently';
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-GB');
}

export default function ScoutProfilePage() {
  const { badges: contextBadges } = useAppContext();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [scoutProfile, setScoutProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [realBadges, setRealBadges] = useState<Badge[]>(badgesData);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const [stats, setStats] = useState({
    badgesEarned: 0,
    requirementsCompleted: 0,
    upcomingMilestones: 2,
    activityPoints: 0
  });

  // Extract ID from window URL or retrieve from current logged-in user
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        setTargetId(parseInt(id, 10));
      } else {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            setTargetId(u.id);
          } catch (e) {
            setTargetId(999);
          }
        } else {
          setTargetId(999);
        }
      }
    }
  }, []);

  // Fetch target user details from backend database
  useEffect(() => {
    if (targetId === null) return;
    const token = sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const userStr = sessionStorage.getItem('user');
    let loggedInUserId = null;
    if (userStr) {
      try {
        loggedInUserId = JSON.parse(userStr).id;
      } catch (e) {}
    }
    const isOwn = targetId === loggedInUserId || targetId === 999;
    setIsOwnProfile(isOwn);

    const profileUrl = isOwn
      ? `http://localhost:5000/api/users/profile`
      : `http://localhost:5000/api/users/scouts/${targetId}`;

    setLoading(true);
    safeFetch(profileUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res && res.ok ? res.json() : null)
      .then(user => {
        if (user) {
          const joinDateVal = user.join_date || (user.dob ? new Date(user.dob).toLocaleDateString('en-GB') : 'N/A');
          const yearMatch = joinDateVal.match(/\b(19|20)\d{2}\b/);
          const computedBatch = yearMatch ? `Batch of ${yearMatch[0]}` : (user.dob ? `Batch of ${new Date(user.dob).getFullYear()}` : 'Batch of 2022');

          const mapped = {
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name',
            roles: Array.isArray(user.roles) && user.roles.length > 0 
              ? user.roles 
              : [user.role === 'patrol_leader' ? 'Patrol Leader' : 'Senior Scout'],
            troop: user.troop_name || '1st Colombo Scout Group',
            batch: user.batch || computedBatch,
            scoutId: user.scout_reg_no || 'N/A',
            joinDate: joinDateVal,
            district: user.scout_district || 'N/A',
            email: user.email || '',
            avatar: user.avatar || null,
            coverImage: user.cover_image || user.coverImage || null,
            achievements: Array.isArray(user.achievements) && user.achievements.length > 0 
              ? user.achievements 
              : ['Registered Scout Member']
          };
          setScoutProfile(mapped);
        } else {
          setScoutProfile({
            name: 'Alex Johnson',
            roles: ['Senior Scout', 'Patrol Leader'],
            troop: '1st Colombo Scout Group',
            batch: 'Batch of 2022',
            scoutId: 'SL-2022-045',
            joinDate: 'March 2022',
            district: 'Colombo South',
            email: 'alex.scout@gmail.com',
            achievements: ["President's Scout Award Candidate", "Patrol Leader Council Representative"]
          });
        }
      })
      .catch(() => {
        setScoutProfile({
          name: 'Alex Johnson',
          roles: ['Senior Scout', 'Patrol Leader'],
          troop: '1st Colombo Scout Group',
          batch: 'Batch of 2022',
          scoutId: 'SL-2022-045',
          joinDate: 'March 2022',
          district: 'Colombo South',
          email: 'alex.scout@gmail.com',
          achievements: ["President's Scout Award Candidate", "Patrol Leader Council Representative"]
        });
      })
      .finally(() => setLoading(false));
  }, [targetId]);

  // Fetch real statistics, badge progress, and recent activities
  useEffect(() => {
    if (targetId === null) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const userStr = sessionStorage.getItem('user');
    let loggedInUserId = null;
    if (userStr) {
      try {
        loggedInUserId = JSON.parse(userStr).id;
      } catch (e) {}
    }
    const isOwn = targetId === loggedInUserId || targetId === 999;

    const recordBookUrl = isOwn
      ? `http://localhost:5000/api/progress/record-book`
      : `http://localhost:5000/api/progress/record-book?scout_id=${targetId}`;

    fetch(recordBookUrl, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          let totalVerified = 0;
          let earnedCount = 0;
          let pendingCount = 0;
          let firstIncompleteFound = false;

          const baseBadges = contextBadges && contextBadges.length > 0 ? contextBadges : badgesData;

          const updatedBadges = baseBadges.map((defaultBadge, idx) => {
            const backendBadge = data[idx] || data.find((b: any) => 
              b.name?.toLowerCase().includes(defaultBadge.title.toLowerCase()) ||
              b.title?.toLowerCase().includes(defaultBadge.title.toLowerCase())
            );

            if (!backendBadge || !backendBadge.requirements) {
              return defaultBadge;
            }

            const reqs = backendBadge.requirements || [];
            const verified = reqs.filter((r: any) => r.status === 'verified').length;
            const pending = reqs.filter((r: any) => r.status === 'pending_pl' || r.status === 'pl_approved').length;

            totalVerified += verified;
            pendingCount += pending;

            const pct = reqs.length > 0 ? Math.round((verified / reqs.length) * 100) : 0;
            const isCompleted = reqs.length > 0 && verified === reqs.length;

            if (isCompleted) {
              earnedCount += 1;
            }

            let isLocked = false;
            let status: 'completed' | 'in_progress' = 'in_progress';

            if (isCompleted) {
              status = 'completed';
              isLocked = false;
            } else if (!firstIncompleteFound) {
              firstIncompleteFound = true;
              status = 'in_progress';
              isLocked = false;
            } else {
              status = 'in_progress';
              isLocked = true;
            }

            return {
              ...defaultBadge,
              progress: pct,
              status,
              isLocked
            };
          });

          setRealBadges(updatedBadges);

          setStats({
            badgesEarned: earnedCount,
            requirementsCompleted: totalVerified,
            upcomingMilestones: pendingCount > 0 ? pendingCount : 1,
            activityPoints: totalVerified * 10
          });

          const activitiesList: any[] = [];
          data.forEach((badge: any) => {
            (badge.requirements || []).forEach((req: any) => {
              if (req.status && req.status !== 'pending' && req.status !== 'incomplete') {
                activitiesList.push({
                  id: `req-${req.id}`,
                  type: 'requirement',
                  title: req.requirement_text || 'Completed Requirement',
                  description: `Requirement for ${badge.name || badge.title}`,
                  date: formatRelativeTime(req.completed_at),
                  rawDate: req.completed_at ? new Date(req.completed_at).getTime() : Date.now(),
                  status: req.status === 'verified' ? 'verified' : 'completed'
                });
              }
            });
          });

          try {
            const savedProf = sessionStorage.getItem('prof_evidence');
            if (savedProf) {
              const profMap = JSON.parse(savedProf);
              Object.values(profMap).forEach((ev: any) => {
                activitiesList.push({
                  id: `prof-${ev.badgeCode}`,
                  type: 'badge',
                  title: `${ev.badgeCode} Proficiency Badge`,
                  description: 'Submitted Examiner Certificate',
                  date: formatRelativeTime(ev.submittedAt),
                  rawDate: ev.submittedAt ? new Date(ev.submittedAt).getTime() : Date.now(),
                  status: ev.status === 'verified' ? 'verified' : 'completed'
                });
              });
            }
          } catch (e) {}

          activitiesList.sort((a, b) => b.rawDate - a.rawDate);
          if (activitiesList.length > 0) {
            setRecentActivities(activitiesList.slice(0, 5));
          }
        }
      })
      .catch(() => {});
  }, [targetId, contextBadges]);

  const handleSaveProfile = async (updatedProfile: any) => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const parts = updatedProfile.name.trim().split(/\s+/);
    const first_name = parts[0] || '';
    const last_name = parts.slice(1).join(' ') || '';

    try {
      const res = await safeFetch(`http://localhost:5000/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email: updatedProfile.email,
          scout_reg_no: updatedProfile.scoutId,
          scout_district: updatedProfile.district,
          batch: updatedProfile.batch,
          join_date: updatedProfile.joinDate,
          roles: updatedProfile.roles,
          achievements: updatedProfile.achievements,
          avatar: updatedProfile.avatar,
          cover_image: updatedProfile.coverImage
        })
      });

      if (res && res.ok) {
        setScoutProfile(updatedProfile);
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
          const u = JSON.parse(userStr);
          u.first_name = first_name;
          u.last_name = last_name;
          u.email = updatedProfile.email;
          u.scout_reg_no = updatedProfile.scoutId;
          u.scout_district = updatedProfile.district;
          u.batch = updatedProfile.batch;
          u.join_date = updatedProfile.joinDate;
          u.roles = updatedProfile.roles;
          u.achievements = updatedProfile.achievements;
          u.avatar = updatedProfile.avatar;
          u.cover_image = updatedProfile.coverImage;
          sessionStorage.setItem('user', JSON.stringify(u));
        }
      } else {
        alert("Failed to update profile.");
      }
    } catch (e) {
      alert("Error saving profile changes.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!scoutProfile) {
    return (
      <div className="text-center py-10 font-bold text-slate-500">
        Could not load scout details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-50/80 to-transparent pointer-events-none" />
      
      <div className="relative space-y-12 max-w-[1400px] mx-auto px-4 sm:px-8 pt-8">
        
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
          scout={scoutProfile} 
          onSave={handleSaveProfile} 
          isOwnProfile={isOwnProfile}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <div className="xl:col-span-2 space-y-10">
            {/* 4. Badge Progress List Component */}
            <BadgeProgressList badges={realBadges} />

            {/* 5. Earned Badges Grid Component */}
            <EarnedBadgesGrid badges={realBadges} />

            {/* 6. Additional Achievements Component */}
            <AdditionalAchievements achievements={scoutProfile.achievements || []} />
          </div>

          <div className="space-y-10">
            {/* 2. Recent Activity Component */}
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </div>
    </div>
  );
}

