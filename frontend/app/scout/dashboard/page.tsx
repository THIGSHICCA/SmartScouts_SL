'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Upload, CheckCircle, Clock, AlertCircle, BookOpen, Star, Trophy, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { LangToggle } from '@/context/LangContext';
import { proficiencyBadgesData } from '@/data/badges';

const API = 'http://localhost:5000/api';

const BADGE_COLORS = [
  { accent: '#22c55e', light: '#f0fdf4', pill: 'bg-emerald-100 text-emerald-700', icon: '/images/badges/membership-badge.png' },
  { accent: '#f97316', light: '#fff7ed', pill: 'bg-orange-100 text-orange-700',   icon: '/images/badges/scout-award.png' },
  { accent: '#3b82f6', light: '#eff6ff', pill: 'bg-blue-100 text-blue-700',       icon: '/images/badges/chief-commissioner-award.png' },
  { accent: '#eab308', light: '#fefce8', pill: 'bg-yellow-100 text-yellow-700',   icon: '/images/badges/prime-minister-award.png' },
  { accent: '#a855f7', light: '#faf5ff', pill: 'bg-purple-100 text-purple-700',   icon: '/images/badges/president-award.png' },
];

export default function ScoutDashboard() {
  const { user } = useAuth();
  const [recordBook, setRecordBook] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]); // badge codes
  const [troopId, setTroopId] = useState<number | null>(null);



  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    
    // Fetch profile for troop ID
    fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setTroopId(data.troop_id); })
      .catch(() => {});

    fetch(`${API}/progress/record-book`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setRecordBook(data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load proficiency evidence from sessionStorage
    try {
      const saved = sessionStorage.getItem('prof_evidence');
      if (saved) setEarnedBadges(Object.keys(JSON.parse(saved)));
    } catch {}
  }, []);

  // Compute overall stats
  const totalReqs = recordBook.reduce((s, b) => s + (b.requirements?.length ?? 0), 0);
  const verifiedReqs = recordBook.reduce((s, b) => s + (b.requirements?.filter((r: any) => r.status === 'verified').length ?? 0), 0);
  const pendingReqs = recordBook.reduce((s, b) => s + (b.requirements?.filter((r: any) => r.status === 'pending_pl' || r.status === 'pl_approved').length ?? 0), 0);
  const rejectedReqs = recordBook.reduce((s, b) => s + (b.requirements?.filter((r: any) => r.status === 'rejected').length ?? 0), 0);
  const overallPct = totalReqs > 0 ? Math.round((verifiedReqs / totalReqs) * 100) : 0;

  // Current active badge (first incomplete)
  const activeBadgeIndex = recordBook.findIndex(b => {
    const total = b.requirements?.length ?? 0;
    const done = b.requirements?.filter((r: any) => r.status === 'verified').length ?? 0;
    return done < total;
  });
  const activeBadge = activeBadgeIndex >= 0 ? recordBook[activeBadgeIndex] : recordBook[recordBook.length - 1];
  const activeBadgeColors = BADGE_COLORS[activeBadgeIndex >= 0 ? activeBadgeIndex : 0];

  // Recent activity (last 5 non-pending items)
  const recentActivity: any[] = [];
  for (const badge of recordBook) {
    for (const req of (badge.requirements ?? [])) {
      if (req.status && req.status !== 'pending') {
        recentActivity.push({ ...req, badge_name: badge.name });
      }
    }
  }
  recentActivity.sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime());



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!troopId) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900">
              Welcome, {user?.first_name ?? user?.name?.split(' ')[0] ?? 'Scout'}! 👋
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Sri Lanka Scout Association
            </p>
          </div>
          <LangToggle />
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 text-amber-900">
          <div className="flex items-start gap-4">
            <AlertCircle size={24} className="text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-bold mb-1">Awaiting Troop Assignment</h2>
              <p className="mb-3">
                You have successfully registered, but you are not yet assigned to a Scout Troop. 
                Your Scout Leader needs to add you to their troop before you can access the Progress Record, 
                Proficiency Badges, and AI Assistant.
              </p>
              <p className="font-semibold text-sm">
                In the meantime, you can update your basic details in the <Link href="/scout/profile" className="underline hover:text-amber-700">My Profile</Link> section.
              </p>
            </div>
          </div>
        </div>

        <Card className="p-8 border-none shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-4">Quick Setup</h2>
          <p className="text-slate-600 mb-6">Make sure your profile information is complete so your Scout Leader can easily find and add you to your troop.</p>
          
          <Link href="/scout/profile">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50 text-blue-900 hover:bg-blue-100 transition-all cursor-pointer">
              <span className="text-2xl">👤</span>
              <div className="flex-1">
                <p className="font-black text-sm">Update My Profile</p>
                <p className="text-xs opacity-80 font-medium">Add your Date of Birth, Registration Number, and District</p>
              </div>
              <ChevronRight size={16} className="opacity-60" />
            </div>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">

      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back, {user?.first_name ?? user?.name?.split(' ')[0] ?? 'Scout'}! 👋
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Sri Lanka Scout Association — 2022 Curriculum
          </p>
        </div>
        <LangToggle />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${overallPct}%`, sub: `${verifiedReqs}/${totalReqs} verified`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Awaiting Review', value: pendingReqs, sub: 'submitted tasks', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Rejected', value: rejectedReqs, sub: 'need re-submission', color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Award Levels', value: `${recordBook.filter(b => b.requirements?.every((r: any) => r.status === 'verified')).length}/${recordBook.length}`, sub: 'completed', color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className={`p-5 border-none shadow-sm ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-black text-slate-600 mt-0.5 uppercase tracking-wider">{s.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Current Active Badge + Proficiency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Active Award Level */}
        <Link href="/scout/record-book" className="flex flex-col h-full">
          <Card className="p-7 border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden relative rounded-3xl h-full flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl" style={{ backgroundColor: activeBadgeColors.accent }} />
            <div className="flex items-start justify-between mb-5">
              <div className="text-4xl flex items-center justify-center">
                {activeBadgeColors.icon.startsWith('/') || activeBadgeColors.icon.includes('.') ? (
                  <img src={activeBadgeColors.icon} alt="Badge" className="w-12 h-12 object-contain" />
                ) : (
                  activeBadgeColors.icon
                )}
              </div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">
                  {activeBadge ? Math.round(((activeBadge.requirements?.filter((r: any) => r.status === 'verified').length ?? 0) / Math.max(activeBadge.requirements?.length ?? 1, 1)) * 100) : 0}%
                </span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">complete</p>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{activeBadge?.name ?? 'Loading…'}</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              {activeBadge?.requirements?.filter((r: any) => r.status === 'verified').length ?? 0} of {activeBadge?.requirements?.length ?? 0} requirements verified
            </p>
            {/* Mini progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-700"
                style={{
                  width: `${activeBadge ? Math.round(((activeBadge.requirements?.filter((r: any) => r.status === 'verified').length ?? 0) / Math.max(activeBadge.requirements?.length ?? 1, 1)) * 100) : 0}%`,
                  backgroundColor: activeBadgeColors.accent
                }}
              />
            </div>
            <div className="flex items-center gap-1 mt-4 text-xs font-black text-slate-500 uppercase tracking-widest mt-auto pt-4">
              Open Progress Record <ChevronRight size={12} />
            </div>
          </Card>
        </Link>

        {/* Proficiency Badges */}
        <Link href="/scout/proficiency" className="flex flex-col h-full">
          <Card className="p-7 border-none shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden relative rounded-3xl h-full flex flex-col">
            {/* Yellow top accent bar — mirrors the left card */}
            <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-3xl" style={{ backgroundColor: '#eab308' }} />
            <div className="flex items-start justify-between mb-5">
              <div className="text-4xl flex items-center justify-center">⭐</div>
              <div className="text-right">
                <span className="text-3xl font-black text-slate-900">{earnedBadges.length}</span>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">earned</p>
                <span className="text-sm font-bold text-slate-400">/ 130</span>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">Proficiency Badges</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">
              {earnedBadges.length > 0
                ? `${earnedBadges.length} certificate${earnedBadges.length > 1 ? 's' : ''} submitted · ${130 - earnedBadges.length} remaining`
                : '130 badges across 14 skill groups'
              }
            </p>
            {/* Mini progress bar — earned out of 130 */}
            <div className="w-full bg-slate-100 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${Math.round((earnedBadges.length / 130) * 100)}%`, backgroundColor: '#eab308' }}
              />
            </div>
            <div className="flex items-center gap-1 text-xs font-black text-slate-500 uppercase tracking-widest mt-auto pt-4">
              🌐 {earnedBadges.length > 0 ? 'View & Upload More' : 'Browse Badge Library'} <ChevronRight size={12} />
            </div>
          </Card>
        </Link>
      </div>

      {/* All Award Levels Overview */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black text-slate-900">Award Journey</h2>
          <Link href="/scout/record-book" className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest">
            Full Progress Record →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {recordBook.length > 0 ? recordBook.map((badge, i) => {
            const colors = BADGE_COLORS[i] ?? BADGE_COLORS[0];
            const total = badge.requirements?.length ?? 0;
            const done = badge.requirements?.filter((r: any) => r.status === 'verified').length ?? 0;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isComplete = pct === 100;
            const prevPct = i === 0 ? 100 : (() => {
              const prev = recordBook[i - 1];
              const pt = prev?.requirements?.length ?? 0;
              const pd = prev?.requirements?.filter((r: any) => r.status === 'verified').length ?? 0;
              return pt > 0 ? Math.round((pd / pt) * 100) : 0;
            })();
            const isLocked = prevPct < 100;
            return (
              <Link href="/scout/record-book" key={badge.id}>
                <div
                  className={`p-4 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                    isLocked
                      ? 'border-slate-100 bg-slate-50 opacity-60'
                      : isComplete
                      ? 'hover:-translate-y-0.5 hover:shadow-md'
                      : 'border-slate-100 bg-white hover:-translate-y-0.5 hover:shadow-md'
                  }`}
                  style={isComplete ? { borderColor: colors.accent, backgroundColor: colors.light } : {}}
                >
                  <div className="text-2xl mb-2 flex items-center justify-center">
                    {isLocked ? '🔒' : (
                      colors.icon.startsWith('/') || colors.icon.includes('.') ? (
                        <img src={colors.icon} alt="Badge" className="w-8 h-8 object-contain" />
                      ) : (
                        colors.icon
                      )
                    )}
                  </div>
                  <p className={`text-xs font-black leading-snug mb-2 ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}
                    style={isComplete ? { color: colors.accent } : {}}>
                    {badge.name.replace(' Badge', '').replace(' Award', '')}
                  </p>
                  {isLocked ? (
                    <p className="text-[10px] text-slate-400">Locked</p>
                  ) : (
                    <>
                      <p className="text-lg font-black" style={{ color: colors.accent }}>{pct}%</p>
                      <p className="text-[10px] text-slate-400">{done}/{total} tasks</p>
                      {isComplete && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-white mt-1 inline-block" style={{ backgroundColor: colors.accent }}>COMPLETE</span>}
                    </>
                  )}
                </div>
              </Link>
            );
          }) : (
            Array.from({ length: 5 }, (_, i) => {
              const colors = BADGE_COLORS[i];
              const isLocked = i > 0;
              return (
                <Link href="/scout/record-book" key={i}>
                  <div className={`p-4 rounded-2xl border-2 border-slate-100 text-center transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${isLocked ? 'bg-slate-50 opacity-60' : 'bg-white'}`}>
                    <div className="text-2xl mb-2 flex items-center justify-center">
                      {isLocked ? '🔒' : (
                        colors.icon.startsWith('/') || colors.icon.includes('.') ? (
                          <img src={colors.icon} alt="Badge" className="w-8 h-8 object-contain" />
                        ) : (
                          colors.icon
                        )
                      )}
                    </div>
                    <p className="text-xs font-black text-slate-400 mb-2">
                      {['Membership', 'Scout', "Chief Comm.", "Prime Min.", "President's"][i]}
                    </p>
                    <p className="text-[10px] text-slate-300">{isLocked ? 'Locked' : 'not started'}</p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </section>

      {/* Earned Proficiency Badges */}
      {earnedBadges.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-black text-slate-900">⭐ Earned Proficiency Badges</h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {earnedBadges.length} certificate{earnedBadges.length > 1 ? 's' : ''} submitted — awaiting Scout Leader verification
              </p>
            </div>
            <Link href="/scout/proficiency" className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest">
              All Badges →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {earnedBadges.map(code => {
              const badge = proficiencyBadgesData.find(b => b.code === code);
              if (!badge) return null;
              return (
                <Link key={code} href="/scout/proficiency">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border-2 border-emerald-200 hover:-translate-y-0.5 hover:shadow-md transition-all cursor-pointer relative">
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                      <CheckCircle size={11} className="text-white fill-white" />
                    </div>
                    <span className="text-3xl">{badge.icon}</span>
                    <div className="text-center">
                      <p className="text-xs font-black text-slate-900 leading-snug line-clamp-2">{badge.title}</p>
                      <p className="text-[10px] font-mono text-slate-400 mt-0.5">{badge.code}</p>
                    </div>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase tracking-widest">Submitted</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6 border-none shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Recent Activity</h2>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((item, i) => {
                const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
                  verified:   { label: 'Verified ✓✓', color: 'text-emerald-600 bg-emerald-50', icon: <CheckCircle size={14} className="text-emerald-600" /> },
                  pl_approved:{ label: 'PL Signed ✓', color: 'text-blue-600 bg-blue-50',       icon: <CheckCircle size={14} className="text-blue-600" /> },
                  pending_pl: { label: 'Awaiting PL', color: 'text-orange-600 bg-orange-50',   icon: <Clock size={14} className="text-orange-500" /> },
                  rejected:   { label: 'Rejected',    color: 'text-red-600 bg-red-50',         icon: <AlertCircle size={14} className="text-red-500" /> },
                };
                const s = statusMap[item.status] ?? statusMap.pending_pl;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex-shrink-0">{s.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.requirement_text}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{item.badge_name}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${s.color} flex-shrink-0`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Zap size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-400">No activity yet.</p>
              <p className="text-xs text-slate-400 mt-1">Submit your first task to get started!</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 border-none shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-4">Quick Access</h2>
          <div className="space-y-3">
            {[
              { href: '/scout/record-book', emoji: '📒', label: 'Open My Progress Record', desc: 'View all 5 award levels + submit tasks', bg: 'bg-slate-900', text: 'text-white' },
              { href: '/scout/proficiency', emoji: '⭐', label: 'Proficiency Badge Library', desc: '130 badges across 14 skill groups', bg: 'bg-blue-600', text: 'text-white' },
              { href: '/scout/ai-assistant', emoji: '🤖', label: 'Scout AI Assistant', desc: 'Get instant help with requirements & syllabus', bg: 'bg-amber-500', text: 'text-white' },
            ].map(item => (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-4 p-4 rounded-2xl ${item.bg} ${item.text} hover:opacity-90 transition-all cursor-pointer`}>
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1">
                    <p className="font-black text-sm">{item.label}</p>
                    <p className="text-xs opacity-70 font-medium">{item.desc}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-60" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>


      {/* Info Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
        <div>
          <p className="text-sm font-black text-yellow-400 uppercase tracking-widest mb-1">Official 2022 Curriculum</p>
          <p className="text-white font-bold">
            97 award tasks across 5 levels + 130 proficiency badges — all trilingual (EN / தமிழ் / සිං)
          </p>
        </div>
        <LangToggle className="flex-shrink-0" />
      </div>
    </div>
  );
}
