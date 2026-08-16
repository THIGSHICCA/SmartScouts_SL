'use client';
/**
 * Scout Leader Dashboard
 * Two-tab view: Leader signature queue (Gate 2) + Badge investiture applications.
 */
import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Trophy, Users, FileCheck, BookOpen, UserPlus, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { LangToggle, useLang } from '@/context/LangContext';
import PatrolManagement from '../patrols/page';
import { safeFetch } from '@/utils/safeFetch';

const API = 'http://localhost:5000/api';

interface PendingTask {
  id: number;
  scout_id: number;
  scout_name: string;
  requirement_id: number;
  requirement_text: string;
  requirement_text_ta: string | null;
  requirement_text_si: string | null;
  badge_name: string;
  badge_id: number;
  pl_approved_at: string;
  pl_approver_name: string;
  evidence_url: string | null;
  notes: string | null;
}

interface BadgeApplication {
  id: number;
  scout_id: number;
  scout_name: string;
  badge_id: number;
  badge_name: string;
  submitted_at: string;
  status: string;
}

function TaskVerifyCard({ task, onVerify, onReject }: {
  task: PendingTask;
  onVerify: (id: number) => void;
  onReject: (id: number, notes: string) => void;
}) {
  const { t } = useLang();
  const [rejectMode, setRejectMode] = useState(false);
  const [notes, setNotes] = useState('');
  const text = t(task.requirement_text, task.requirement_text_ta, task.requirement_text_si);

  return (
    <Card className="overflow-hidden border-none shadow-md">
      {/* PL approval strip */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 border-b border-blue-100">
        <Check size={14} className="text-blue-600 flex-shrink-0" />
        <span className="text-xs font-bold text-blue-700">
          PL signed by {task.pl_approver_name ?? 'Patrol Leader'} on {task.pl_approved_at ? new Date(task.pl_approved_at).toLocaleDateString('en-GB') : '—'}
        </span>
      </div>

      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-black flex-shrink-0">
          {task.scout_name.split(' ').map(n => n[0]).join('').slice(0,2)}
        </div>
        <div className="flex-1">
          <span className="font-black text-slate-900 text-sm">{task.scout_name}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-xs font-bold text-slate-500">{task.badge_name}</span>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-800 mb-3">{text}</p>

        {task.evidence_url ? (
          <a
            href={task.evidence_url.startsWith('uploaded:') ? '#' : task.evidence_url}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg mb-3"
          >
            <Eye size={12} /> {task.evidence_url.startsWith('uploaded:') ? task.evidence_url.replace('uploaded:', '') : 'View Evidence'}
          </a>
        ) : null}

        {rejectMode ? (
          <div className="space-y-2 mt-2">
            <textarea
              className="w-full text-sm border border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              placeholder="Reason for rejection…"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRejectMode(false)} className="flex-1">Cancel</Button>
              <Button size="sm" onClick={() => onReject(task.id, notes)} className="flex-1 bg-red-600 hover:bg-red-700 text-white">Confirm Reject</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm"
              className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setRejectMode(true)}>
              <X size={14} className="mr-1" /> Reject
            </Button>
            <Button size="sm"
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black"
              onClick={() => onVerify(task.id)}>
              <Check size={14} className="mr-1" /> Final Sign & Verify
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function formatAge(dobString: string | null) {
  if (!dobString) return 'No DOB';
  const dob = new Date(dobString);
  const today = new Date();
  if (isNaN(dob.getTime())) return 'Invalid DOB';

  let years = today.getFullYear() - dob.getFullYear();
  let lastBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

  if (lastBirthday > today) {
    years--;
    lastBirthday = new Date(today.getFullYear() - 1, dob.getMonth(), dob.getDate());
  }

  const diffTime = today.getTime() - lastBirthday.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return `${years} yrs ${days} days`;
}

function formatDobForInput(dateStr: string | null) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function LeaderDashboard() {
  const [tab, setTab] = useState<'tasks' | 'badges'>('tasks');
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [pendingBadges, setPendingBadges] = useState<BadgeApplication[]>([]);
  const [scoutCount, setScoutCount] = useState<number | null>(null);
  const [patrolCount, setPatrolCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : '';

  useEffect(() => {
    Promise.all([
      safeFetch(`${API}/progress/pending-leader`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r && r.ok ? r.json() : []),
      safeFetch(`${API}/progress/badges/pending`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r && r.ok ? r.json() : []),
      safeFetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r && r.ok ? r.json() : null),
    ]).then(([tasks, badges, profile]) => {
      if (Array.isArray(tasks)) setPendingTasks(tasks);
      if (Array.isArray(badges)) setPendingBadges(badges);

      if (profile?.troop_id) {
        Promise.all([
          safeFetch(`${API}/leader/troop/scouts?troop_id=${profile.troop_id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r && r.ok ? r.json() : []),
          safeFetch(`${API}/leader/troop/patrols?troop_id=${profile.troop_id}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r && r.ok ? r.json() : []),
        ]).then(([scoutsData, patrolsData]) => {
          if (Array.isArray(scoutsData)) setScoutCount(scoutsData.length);
          if (Array.isArray(patrolsData)) setPatrolCount(patrolsData.length);
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleVerify = async (taskId: number) => {
    await safeFetch(`${API}/progress/leader-verify/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes: '' })
    });
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleReject = async (taskId: number, notes: string) => {
    await safeFetch(`${API}/progress/leader-reject/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes })
    });
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleBadgeReview = async (appId: number, status: 'approved' | 'rejected') => {
    await safeFetch(`${API}/progress/badges/applications/${appId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    setPendingBadges(prev => prev.filter(b => b.id !== appId));
  };

  const filteredTasks = pendingTasks.filter(t => !search || t.scout_name.toLowerCase().includes(search.toLowerCase()));

  const TABS = [
    { key: 'tasks',  label: 'Leader Signatures',  count: pendingTasks.length, icon: <FileCheck size={15} /> },
    { key: 'badges', label: 'Badge Investitures',  count: pendingBadges.length, icon: <Trophy size={15} /> },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Scout Leader Panel</h1>
          <p className="text-slate-500 font-medium mt-1">Final authority — sign off tasks and award badges.</p>
        </div>
        <LangToggle />
      </div>

      {/* Top Stat Summary Cards: Total Scouts & Total Patrols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4 border-none shadow-sm bg-blue-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-blue-900">{scoutCount !== null ? scoutCount : '—'}</p>
              <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Total Scouts</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-none shadow-sm bg-purple-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-purple-900">{patrolCount !== null ? patrolCount : '—'}</p>
              <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">Total Patrols</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation Shortcuts & Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-100 p-2 rounded-2xl">
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all ${
                tab === t.key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}>
              {t.icon}
              {t.label}
              {t.count !== null && t.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${tab === t.key ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/leader/scouts?add=true"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm">
            <UserPlus size={15} />
            + Add Scout
          </Link>
          <Link href="/leader/patrols?add=true"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm">
            <UserPlus size={15} />
            + Add Patrol
          </Link>
        </div>
      </div>

      {/* ── TASK SIGNATURES tab ── */}
      {tab === 'tasks' && (
        <div className="space-y-4">
          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by scout name…"
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : filteredTasks.length === 0 ? (
            <Card className="p-16 text-center border-none shadow-md">
              <p className="text-5xl mb-4">✅</p>
              <h3 className="text-xl font-black text-slate-900 mb-1">All Verified!</h3>
              <p className="text-slate-500">No tasks awaiting your final signature.</p>
            </Card>
          ) : (
            filteredTasks.map(task => (
              <TaskVerifyCard key={task.id} task={task} onVerify={handleVerify} onReject={handleReject} />
            ))
          )}

          <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-sm text-purple-800">
            <p className="font-black mb-1">✍ Your signature is the final record</p>
            <p>When you <strong>Final Sign & Verify</strong>, the requirement is fully entered into the scout's digital record book — equivalent to your physical signature in the Progress Record Book.</p>
          </div>
        </div>
      )}

      {/* ── BADGE INVESTITURES tab ── */}
      {tab === 'badges' && (
        <div className="space-y-4">
          {pendingBadges.length === 0 ? (
            <Card className="p-16 text-center border-none shadow-md">
              <p className="text-5xl mb-4">🏅</p>
              <h3 className="text-xl font-black text-slate-900 mb-1">No Pending Investitures</h3>
              <p className="text-slate-500">Scout badge applications will appear here when scouts complete all requirements.</p>
            </Card>
          ) : (
            pendingBadges.map(app => (
              <Card key={app.id} className="p-6 border-none shadow-md border-l-4 border-l-yellow-400">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🏆</span>
                      <h3 className="font-black text-slate-900 text-lg">{app.badge_name}</h3>
                    </div>
                    <p className="text-slate-600 font-semibold">{app.scout_name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">
                      Submitted {app.submitted_at ? new Date(app.submitted_at).toLocaleDateString('en-GB') : ''}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">All requirements verified by PL + Leader. PLC recommended for investiture.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white font-black"
                      onClick={() => handleBadgeReview(app.id, 'approved')}>
                      <Trophy size={14} className="mr-1" /> Award / Invest
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50"
                      onClick={() => handleBadgeReview(app.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
