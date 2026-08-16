'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, User, Mail, MapPin, Hash, Calendar, Users, BookOpen, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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
}

interface RecordBadge {
  id: number;
  name: string;
  requirements: { id: number; description: string; status: string }[];
}

function formatDate(d: string | null) {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-GB');
}

function formatAge(dob: string | null) {
  if (!dob) return '';
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--;
  return `${age} years old`;
}

export default function AdminScoutProfilePage() {
  const router = useRouter();
  const [targetId, setTargetId] = useState<number | null>(null);
  const [profile, setProfile] = useState<ScoutProfile | null>(null);
  const [recordBook, setRecordBook] = useState<RecordBadge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) setTargetId(parseInt(id, 10));
    else setError('No scout ID provided.');
  }, []);

  useEffect(() => {
    if (targetId === null) return;
    const token = sessionStorage.getItem('token');
    if (!token) { setError('Not authenticated.'); setLoading(false); return; }

    // Fetch profile and record book in parallel
    Promise.all([
      fetch(`${API}/admin/scouts/${targetId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : null),
      fetch(`${API}/progress/record-book?scout_id=${targetId}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : []),
    ])
      .then(([prof, rb]) => {
        if (prof) setProfile(prof);
        else setError('Scout not found.');
        if (Array.isArray(rb)) setRecordBook(rb);
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [targetId]);

  const totalReqs = recordBook.reduce((s, b) => s + (b.requirements?.length ?? 0), 0);
  const verifiedReqs = recordBook.reduce((s, b) => s + (b.requirements?.filter(r => r.status === 'verified').length ?? 0), 0);
  const overallPct = totalReqs > 0 ? Math.round((verifiedReqs / totalReqs) * 100) : 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-bold text-slate-500">Loading scout profile…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
      <button onClick={() => router.back()} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm">← Go Back</button>
    </div>
  );

  if (!profile) return null;

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const initials = `${profile.first_name?.[0] ?? ''}${profile.last_name?.[0] ?? ''}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Scouts
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-xs font-black uppercase tracking-widest">
          <Shield size={14} /> Admin View — Read Only
        </div>
      </div>

      {/* Profile Hero Card */}
      <Card className="overflow-hidden border-none shadow-lg rounded-3xl">
        {/* Cover */}
        <div className="h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        </div>

        {/* Avatar + Info */}
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white flex-shrink-0">
              <span className="text-3xl font-black text-slate-700">{initials}</span>
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-black text-slate-900">{fullName}</h1>
              <p className="text-slate-500 font-medium capitalize">{profile.role?.replace('_', ' ')}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: <Mail size={15} />, label: 'Email', value: profile.email },
              { icon: <Hash size={15} />, label: 'Reg. Number', value: profile.scout_reg_no || 'N/A' },
              { icon: <MapPin size={15} />, label: 'District', value: profile.scout_district || 'N/A' },
              { icon: <Calendar size={15} />, label: 'Date of Birth', value: `${formatDate(profile.dob)}${profile.dob ? ' · ' + formatAge(profile.dob) : ''}` },
              { icon: <Users size={15} />, label: 'Troop', value: profile.troop_name ? `${profile.troop_name} (${profile.troop_code})` : 'Unassigned' },
              { icon: <User size={15} />, label: 'Patrol', value: profile.patrol_name || 'Unassigned' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                <div className="mt-0.5 text-slate-400 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-800">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Progress', value: `${overallPct}%`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Verified Tasks', value: verifiedReqs, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Tasks', value: totalReqs, color: 'text-slate-700', bg: 'bg-slate-50' },
          { label: 'Award Levels', value: `${recordBook.length}`, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map(s => (
          <Card key={s.label} className={`p-5 border-none shadow-sm ${s.bg}`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-black text-slate-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Award Levels Progress */}
      {recordBook.length > 0 && (
        <Card className="p-6 border-none shadow-sm rounded-3xl">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-slate-600" />
            <h2 className="text-lg font-black text-slate-900">Award Journey Progress</h2>
          </div>
          <div className="space-y-4">
            {recordBook.map((badge, i) => {
              const total = badge.requirements?.length ?? 0;
              const done = badge.requirements?.filter(r => r.status === 'verified').length ?? 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const colors = ['#22c55e', '#f97316', '#3b82f6', '#eab308', '#a855f7'];
              const color = colors[i] ?? colors[0];
              return (
                <div key={badge.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-800">{badge.name}</span>
                    <span className="text-xs font-black" style={{ color }}>{done}/{total} verified · {pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Most Recent Badge */}
      {profile.recent_badge && (
        <Card className="p-6 border-none shadow-sm rounded-3xl bg-amber-50">
          <div className="flex items-center gap-3">
            <Star size={20} className="text-amber-500" />
            <div>
              <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Most Recent Badge</p>
              <p className="text-base font-black text-slate-900 mt-0.5">{profile.recent_badge}</p>
            </div>
          </div>
        </Card>
      )}

    </div>
  );
}
