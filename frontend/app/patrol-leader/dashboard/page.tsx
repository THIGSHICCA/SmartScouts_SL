'use client';
/**
 * Patrol Leader Dashboard
 * Shows tasks that require PL signature (pending_pl) — Gate 1 of the two-gate workflow.
 */
import React, { useState, useEffect } from 'react';
import { Check, X, ChevronRight, Users, Clock, FileCheck, Eye } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { LangToggle, useLang } from '@/context/LangContext';

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
  status: string;
  completed_at: string;
  evidence_url: string | null;
  notes: string | null;
}

function TaskCard({ task, onApprove, onReject }: {
  task: PendingTask;
  onApprove: (id: number) => void;
  onReject: (id: number, notes: string) => void;
}) {
  const { t } = useLang();
  const [rejectMode, setRejectMode] = useState(false);
  const [notes, setNotes] = useState('');

  const text = t(task.requirement_text, task.requirement_text_ta, task.requirement_text_si);
  const initials = task.scout_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hueMap: Record<string, string> = { A: '#22c55e', B: '#3b82f6', C: '#f59e0b', D: '#a855f7', E: '#ef4444', F: '#06b6d4' };
  const color = hueMap[initials[0]] ?? '#64748b';

  return (
    <Card className="overflow-hidden border-none shadow-md">
      {/* Scout identity strip */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100" style={{ backgroundColor: `${color}15` }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
          style={{ backgroundColor: color }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-black text-slate-900 text-sm">{task.scout_name}</span>
          <span className="mx-2 text-slate-300">·</span>
          <span className="text-xs font-bold text-slate-500">{task.badge_name}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {task.completed_at ? new Date(task.completed_at).toLocaleDateString('en-GB') : ''}
        </span>
      </div>

      {/* Requirement */}
      <div className="px-5 py-4">
        <p className="text-sm font-semibold text-slate-800 leading-snug mb-3">{text}</p>

        {/* Evidence */}
        {task.evidence_url ? (
          <a
            href={task.evidence_url.startsWith('uploaded:') ? '#' : task.evidence_url}
            target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg mb-3"
          >
            <Eye size={12} />
            {task.evidence_url.startsWith('uploaded:') ? task.evidence_url.replace('uploaded:', 'File: ') : 'View Evidence'}
          </a>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg mb-3 font-bold">
            <Clock size={12} /> No evidence attached
          </span>
        )}

        {/* Reject notes form */}
        {rejectMode ? (
          <div className="space-y-2 mt-2">
            <textarea
              className="w-full text-sm border border-red-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
              placeholder="Reason for rejection (shown to scout)…"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setRejectMode(false)} className="flex-1">Cancel</Button>
              <Button size="sm" onClick={() => onReject(task.id, notes)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white">Confirm Reject</Button>
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
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black"
              onClick={() => onApprove(task.id)}>
              <Check size={14} className="mr-1" /> Sign & Approve
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function PatrolLeaderDashboard() {
  const [pendingTasks, setPendingTasks] = useState<PendingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchTasks = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const r = await fetch(`${API}/progress/pending-pl`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await r.json();
      if (Array.isArray(data)) setPendingTasks(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleApprove = async (taskId: number) => {
    const token = sessionStorage.getItem('token');
    await fetch(`${API}/progress/pl-approve/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes: '' })
    });
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleReject = async (taskId: number, notes: string) => {
    const token = sessionStorage.getItem('token');
    await fetch(`${API}/progress/pl-reject/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ notes })
    });
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const filtered = pendingTasks.filter(t =>
    !filter || t.scout_name.toLowerCase().includes(filter.toLowerCase()) || t.badge_name.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by scout
  const grouped = filtered.reduce((acc: Record<string, PendingTask[]>, t) => {
    if (!acc[t.scout_name]) acc[t.scout_name] = [];
    acc[t.scout_name].push(t);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Patrol Leader Panel</h1>
          <p className="text-slate-500 font-medium mt-1">Review and sign off on tasks submitted by your patrol.</p>
        </div>
        <LangToggle />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: <Clock size={20} />, value: pendingTasks.length, label: 'Awaiting Signature', color: 'text-orange-500 bg-orange-50' },
          { icon: <Users size={20} />, value: Object.keys(grouped).length, label: 'Scouts Pending', color: 'text-blue-500 bg-blue-50' },
          { icon: <FileCheck size={20} />, value: pendingTasks.filter(t => t.evidence_url).length, label: 'With Evidence', color: 'text-emerald-500 bg-emerald-50' },
        ].map(s => (
          <Card key={s.label} className="p-4 text-center border-none shadow-md">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Search by scout name or badge…"
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white shadow-sm text-sm"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
      </div>

      {/* Task list */}
      {loading ? (
        <div className="text-center py-20"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card className="p-16 text-center border-none shadow-md">
          <p className="text-5xl mb-4">✅</p>
          <h3 className="text-xl font-black text-slate-900 mb-1">All Clear!</h3>
          <p className="text-slate-500">No tasks awaiting your signature right now.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([scoutName, tasks]) => (
            <div key={scoutName}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-black text-slate-900">{scoutName}</h2>
                <span className="text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  {tasks.length} pending
                </span>
              </div>
              <div className="space-y-3">
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} onApprove={handleApprove} onReject={handleReject} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Workflow info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-800">
        <p className="font-black mb-1">🖊 Your role in the record book</p>
        <p>When you <strong>Sign & Approve</strong> a task, it is forwarded to the <strong>Scout Leader</strong> for the second and final signature — just like the physical record book requires both signatures.</p>
      </div>
    </div>
  );
}
