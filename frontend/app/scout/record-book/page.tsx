'use client';
/**
 * /scout/record-book
 * 5 Award Levels that unlock one by one.
 * Task details come from the local badges.ts data (1st version).
 * Progress status is merged from the backend API.
 */
import React, { useState, useEffect } from 'react';
import {
  CheckCircle2, Clock, AlertCircle, Lock,
  ChevronDown, ChevronRight, Upload, Crown, Medal, Award, Star, Shield
} from 'lucide-react';
import { LangToggle, useLang } from '@/context/LangContext';
import { badgesData } from '@/data/badges';

const API = 'http://localhost:5000/api';

/* ── Level config ───────────────────────────────────────────── */
const LEVELS = [
  { key: 'membership', icon: '/images/badges/membership-badge.png', Icon: Shield,  accent: '#22c55e', light: '#f0fdf4', border: '#bbf7d0', desc: 'The foundation of your scouting journey' },
  { key: 'scout',      icon: '/images/badges/scout-award.png', Icon: Star,    accent: '#3b82f6', light: '#eff6ff', border: '#bfdbfe', desc: 'Developing core scouting skills' },
  { key: 'chief',      icon: '/images/badges/chief-commissioner-award.png', Icon: Award,   accent: '#f59e0b', light: '#fffbeb', border: '#fde68a', desc: 'Advanced leadership and service' },
  { key: 'pm',         icon: '/images/badges/prime-minister-award.png', Icon: Medal,   accent: '#a855f7', light: '#faf5ff', border: '#e9d5ff', desc: 'Excellence in scouting and community' },
  { key: 'president',  icon: '/images/badges/president-award.png', Icon: Crown,   accent: '#ef4444', light: '#fef2f2', border: '#fecaca', desc: 'The highest honour in Sri Lanka Scouts' },
];

type Status = 'pending' | 'pending_pl' | 'pl_approved' | 'verified' | 'rejected';

/* ── Status pill ────────────────────────────────────────────── */
function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { label: string; cls: string; icon: React.ReactNode }> = {
    pending:     { label: 'Not Started',   cls: 'bg-slate-100 text-slate-500',     icon: <Clock size={10}/> },
    pending_pl:  { label: 'Awaiting PL',   cls: 'bg-orange-100 text-orange-700',   icon: <Clock size={10}/> },
    pl_approved: { label: 'PL Signed ✓',   cls: 'bg-blue-100 text-blue-700',       icon: <CheckCircle2 size={10}/> },
    verified:    { label: 'Verified ✓✓',   cls: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={10}/> },
    rejected:    { label: 'Rejected',      cls: 'bg-red-100 text-red-600',         icon: <AlertCircle size={10}/> },
  };
  const { label, cls, icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${cls}`}>
      {icon}{label}
    </span>
  );
}

/* ── Evidence Modal Removed ─────────────────────────────────────────── */

/* ── Requirement Row ────────────────────────────────────────── */
function RequirementRow({ req, index, accent, onSubmit }: {
  req: any; index: number; accent: string;
  onSubmit: (id: number, text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const status: Status = req.apiStatus ?? 'pending';
  const hasSubs = req.subTasks?.length > 0;

  return (
    <>
      <tr className={`border-b border-slate-100 transition-colors ${
        status === 'verified' ? 'bg-emerald-50/40' : status === 'rejected' ? 'bg-red-50/30' : 'hover:bg-slate-50/60'
      }`}>
        {/* No. */}
        <td className="px-4 py-3 text-center w-12">
          <span className="w-7 h-7 inline-flex items-center justify-center rounded-full text-xs font-black text-white"
            style={{ backgroundColor: accent }}>{index + 1}</span>
        </td>

        {/* Requirement text */}
        <td className="px-4 py-3">
          <div className="flex items-start gap-2">
            {hasSubs && (
              <button onClick={() => setOpen(o => !o)} className="mt-0.5 text-slate-400 flex-shrink-0">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            )}
            <div>
              <p className="text-sm font-semibold text-slate-800">{req.text}</p>
              <StatusPill status={status} />
            </div>
          </div>
        </td>

        {/* Date Passed */}
        <td className="px-4 py-3 text-center w-28">
          <span className="text-xs text-slate-500 font-mono">
            {req.completedDate ?? (req.completed_at ? new Date(req.completed_at).toLocaleDateString('en-GB') : '—')}
          </span>
        </td>

        {/* Patrol Leader */}
        <td className="px-4 py-3 text-center w-32">
          {req.pl_approved_at ? (
            <div className="text-xs">
              <span className="block font-bold text-blue-700">{req.pl_approver_name ?? 'PL'}</span>
              <span className="text-slate-400 font-mono">{new Date(req.pl_approved_at).toLocaleDateString('en-GB')}</span>
            </div>
          ) : <span className="text-slate-300 text-xs">—</span>}
        </td>

        {/* Scout Leader */}
        <td className="px-4 py-3 text-center w-32">
          {req.verified_at ? (
            <div className="text-xs">
              <span className="block font-bold text-emerald-700">{req.leader_name ?? 'SL'}</span>
              <span className="text-slate-400 font-mono">{new Date(req.verified_at).toLocaleDateString('en-GB')}</span>
            </div>
          ) : <span className="text-slate-300 text-xs">—</span>}
        </td>

        {/* Action */}
        <td className="px-4 py-3 text-right w-28">
          <input 
            type="checkbox"
            checked={status !== 'pending' && status !== 'rejected'}
            disabled={status !== 'pending' && status !== 'rejected'}
            className={`w-5 h-5 rounded focus:ring-slate-900 ${
              (status === 'pending' || status === 'rejected') 
                ? 'text-slate-900 border-slate-300 cursor-pointer' 
                : 'text-emerald-600 border-emerald-300 cursor-not-allowed opacity-70'
            }`}
            onChange={() => {
              if (status === 'pending' || status === 'rejected') {
                onSubmit(req.apiId, req.text);
              }
            }}
            title={status === 'pending' || status === 'rejected' ? "Tick to mark as completed" : undefined}
          />
        </td>
      </tr>

      {/* Sub-tasks */}
      {hasSubs && open && req.subTasks.map((sub: any, si: number) => {
        const subStatus: Status = sub.apiStatus ?? 'pending';
        return (
          <tr key={sub.id} className="bg-slate-50 border-b border-slate-100">
            <td className="px-4 py-2 text-center">
              <span className="text-[10px] font-mono text-slate-400">{index + 1}.{si + 1}</span>
            </td>
            <td className="px-4 py-2 pl-12">
              <span className="text-xs text-slate-600">{sub.text}</span>
              <span className="ml-3">
                <StatusPill status={subStatus} />
              </span>
            </td>
            <td className="px-4 py-2 text-center">
              {sub.completed_at && (
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(sub.completed_at).toLocaleDateString('en-GB')}
                </span>
              )}
            </td>
            <td className="px-4 py-2 text-center"></td>
            <td className="px-4 py-2 text-center"></td>
            <td className="px-4 py-2 text-right">
              <input 
                type="checkbox"
                checked={subStatus !== 'pending' && subStatus !== 'rejected'}
                disabled={subStatus !== 'pending' && subStatus !== 'rejected'}
                className={`w-4 h-4 rounded focus:ring-slate-900 ${
                  (subStatus === 'pending' || subStatus === 'rejected') 
                    ? 'text-slate-900 border-slate-300 cursor-pointer' 
                    : 'text-emerald-600 border-emerald-300 cursor-not-allowed opacity-70'
                }`}
                onChange={() => {
                  if (subStatus === 'pending' || subStatus === 'rejected') {
                    onSubmit(sub.apiId, sub.text);
                  }
                }}
                title={subStatus === 'pending' || subStatus === 'rejected' ? "Tick to mark as completed" : undefined}
              />
            </td>
          </tr>
        );
      })}
    </>
  );
}

/* ── Locked Level Card ──────────────────────────────────────── */
function LockedLevel({ level, prevName, prevPct }: {
  level: typeof LEVELS[0]; prevName: string; prevPct: number;
}) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mb-2">
        <Lock size={28} className="text-slate-400" />
      </div>
      <span className="text-5xl flex items-center justify-center">
        {level.icon.startsWith('/') || level.icon.includes('.') ? (
          <img src={level.icon} alt={level.key} className="w-20 h-20 object-contain grayscale opacity-60" />
        ) : (
          level.icon
        )}
      </span>
      <div>
        <h3 className="text-xl font-black text-slate-400">
          {badgesData.find(b => b.id === level.key)?.title ?? level.key}
        </h3>
        <p className="text-sm text-slate-400 mt-1 max-w-xs">
          Complete all tasks in <strong className="text-slate-600">{prevName}</strong> to unlock this level.
        </p>
      </div>
      <div className="w-full max-w-xs">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
          <span>Previous level</span><span>{prevPct}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="h-2 rounded-full bg-slate-400 transition-all" style={{ width: `${prevPct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ── Active Level Section ───────────────────────────────────── */
function ActiveLevel({ mergedReqs, badgeTitle, level, badgeId, onSubmit, onBadgeSubmit }: {
  mergedReqs: any[]; badgeTitle: string; level: typeof LEVELS[0]; badgeId: number;
  onSubmit: (id: number, text: string) => void;
  onBadgeSubmit: (badgeId: number) => void;
}) {
  const verified = mergedReqs.filter(r => r.apiStatus === 'verified').length;
  const total = mergedReqs.length;
  const pct = total > 0 ? Math.round((verified / total) * 100) : 0;

  return (
    <div className="rounded-3xl overflow-hidden shadow-lg border-2" style={{ borderColor: level.border, backgroundColor: level.light }}>
      {/* Header */}
      <div className="p-6 flex items-center gap-6" style={{ borderBottom: `2px solid ${level.border}` }}>
        <span className="text-5xl flex items-center justify-center">
          {level.icon.startsWith('/') || level.icon.includes('.') ? (
            <img src={level.icon} alt={badgeTitle} className="w-24 h-24 object-contain" />
          ) : (
            level.icon
          )}
        </span>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-black text-slate-900">{badgeTitle}</h2>
              {pct === 100 && (
                <span className="text-xs font-black px-3 py-1 rounded-full text-white" style={{ backgroundColor: level.accent }}>
                  COMPLETE ✓
                </span>
              )}
            </div>
            
            {/* Submit Badge Button */}
            {mergedReqs.every(r => r.apiStatus !== 'pending' && r.apiStatus !== 'rejected') && (
              <button 
                onClick={() => onBadgeSubmit(badgeId)}
                className="mt-2 sm:mt-0 text-xs px-4 py-2 rounded-xl bg-slate-900 text-white font-black hover:bg-slate-700 transition-colors shadow"
              >
                Submit Badge to Leader
              </button>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{level.desc}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[150px] max-w-xs bg-white/70 rounded-full h-2.5 overflow-hidden">
              <div className="h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: level.accent }} />
            </div>
            <span className="text-sm font-black text-slate-700">{verified}/{total} verified</span>
            <span className="text-sm font-black" style={{ color: level.accent }}>{pct}%</span>
          </div>
        </div>
      </div>

      {/* Requirements table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-slate-400 font-black border-b border-slate-200">
              <th className="px-4 py-3 text-center w-12">No.</th>
              <th className="px-4 py-3 text-left">Requirement</th>
              <th className="px-4 py-3 text-center w-28">Date Passed</th>
              <th className="px-4 py-3 text-center w-32">Patrol Leader ✍</th>
              <th className="px-4 py-3 text-center w-32">Scout Leader ✍</th>
              <th className="px-4 py-3 text-right w-28">Action</th>
            </tr>
          </thead>
          <tbody>
            {mergedReqs.map((req, i) => (
              <RequirementRow key={req.id} req={req} index={i} accent={level.accent} onSubmit={onSubmit} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function RecordBook() {
  const [apiData, setApiData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const router = import('next/navigation').then(mod => mod.useRouter).catch(() => null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    // Guard: Check troop assignment
    fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && !data.troop_id) {
          window.location.href = '/scout/dashboard'; // Fallback redirect if they somehow got here
        }
      })
      .catch(() => {});

    fetch(`${API}/progress/record-book`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setApiData(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /**
   * Merge local badge data (rich text) with API progress (status + dates).
   * Local badgesData[i] categories → flatten to requirements list.
   * API data is matched by order_number / index.
   */
  const merged = badgesData.map((localBadge, bi) => {
    const apiEntry = apiData[bi]; // same order as level_order

    // Flatten all categories into one requirements list
    const allReqs: any[] = [];
    localBadge.categories.forEach(cat => {
      cat.requirements.forEach(req => allReqs.push(req));
    });

    // Build a map of API requirements by index (order-based matching)
    const apiReqs: any[] = apiEntry?.requirements ?? [];
    const apiMap = new Map<number, any>();
    apiReqs.forEach((ar: any, idx: number) => apiMap.set(idx, ar));

    const mergedReqs = allReqs.map((localReq, idx) => {
      const apiReq = apiMap.get(idx);

      const subTasks = localReq.subTasks?.map((localSub: any, sIdx: number) => {
        const apiSub = apiReq?.sub_tasks?.[sIdx];
        return {
          ...localSub,
          apiId: apiSub?.id ?? localSub.id,
          apiStatus: (apiSub?.status ?? 'pending') as Status,
          completed_at: apiSub?.completed_at,
        };
      }) || [];

      return {
        ...localReq,
        apiId: apiReq?.id ?? localReq.id,
        apiStatus: (apiReq?.status ?? 'pending') as Status,
        completed_at: apiReq?.completed_at,
        pl_approved_at: apiReq?.pl_approved_at,
        pl_approver_name: apiReq?.pl_approver_name,
        verified_at: apiReq?.verified_at,
        leader_name: apiReq?.leader_name,
        evidence_url: apiReq?.evidence_url,
        subTasks,
      };
    });

    const verified = mergedReqs.filter(r => r.apiStatus === 'verified').length;
    const pct = mergedReqs.length > 0 ? Math.round((verified / mergedReqs.length) * 100) : 0;

    return { localBadge, mergedReqs, pct, apiEntry };
  });

  // A level is unlocked if previous is 100%
  const isUnlocked = (i: number) => i === 0 || merged[i - 1]?.pct === 100;

  const handleSubmit = async (reqId: number, text: string) => {
    console.log("Checkbox clicked! reqId:", reqId, "text:", text);
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API}/progress/submit-task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requirement_id: reqId, evidence_url: '' })
      });
      const data = await res.json();
      console.log("Submit API response:", res.status, data);

      if (!res.ok) {
        alert("Failed to submit task. Make sure you are logged in correctly.");
        return;
      }

      // Optimistically update status
      setApiData(prev => prev.map(badge => ({
        ...badge,
        requirements: badge.requirements?.map((req: any) => {
          if (String(req.id) === String(reqId)) {
            return { ...req, status: 'pending_pl', completed_at: new Date().toISOString() };
          }
          if (req.sub_tasks) {
            return {
              ...req,
              sub_tasks: req.sub_tasks.map((s: any) => 
                String(s.id) === String(reqId) ? { ...s, status: 'pending_pl', completed_at: new Date().toISOString() } : s
              )
            };
          }
          return req;
        })
      })));
    } catch (error) {
      console.error('Error submitting task:', error);
    }
  };

  const handleBadgeSubmit = async (badgeId: number) => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`${API}/progress/badges/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ badge_id: badgeId })
      });
      alert('Badge completion request sent to your Scout Leader!');
      // Could optimistically update local state if we tracked badge apps locally, but alert is fine for now
    } catch (error) {
      console.error('Error submitting badge:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500">Loading your Record Book…</p>
        </div>
      </div>
    );
  }

  const activeLevel = LEVELS[activeTab];
  const activeData = merged[activeTab];

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">📒 My Progress Record</h1>
          <p className="text-slate-500 font-medium mt-1">Sri Lanka Scout Association — 2022 Curriculum</p>
        </div>
        <LangToggle />
      </div>

      {/* Award Journey banner */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white">
        <p className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">Your Award Journey</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {LEVELS.map((lv, i) => {
            const pct = merged[i]?.pct ?? 0;
            const unlocked = isUnlocked(i);
            const complete = pct === 100;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => unlocked && setActiveTab(i)}
                  disabled={!unlocked}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 transition-all ${
                    unlocked ? 'opacity-100 cursor-pointer' : 'opacity-35 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border-2 transition-all ${
                      activeTab === i && unlocked ? 'scale-110 shadow-lg' : ''
                    } ${complete ? 'border-white' : unlocked ? 'border-white/30' : 'border-white/10'}`}
                    style={activeTab === i ? { backgroundColor: lv.accent, borderColor: lv.accent } : { backgroundColor: '#1e293b' }}
                  >
                    {complete ? '✓' : unlocked ? (
                      lv.icon.startsWith('/') || lv.icon.includes('.') ? (
                        <img src={lv.icon} alt={lv.key} className="w-8 h-8 object-contain" />
                      ) : (
                        lv.icon
                      )
                    ) : '🔒'}
                  </div>
                  <span className="text-[10px] font-black text-slate-300 leading-tight text-center w-16">
                    {badgesData[i]?.title.replace(' Badge','').replace(' Award','').replace(" Scout",'').replace("'s Award",'') ?? ''}
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: unlocked ? lv.accent : '#475569' }}>{pct}%</span>
                </button>
                {i < LEVELS.length - 1 && (
                  <div className={`flex-shrink-0 ${pct === 100 ? 'opacity-100' : 'opacity-25'}`}>
                    <div className="w-8 h-0.5 rounded" style={{ backgroundColor: pct === 100 ? lv.accent : '#475569' }} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {LEVELS.map((lv, i) => {
          const unlocked = isUnlocked(i);
          const pct = merged[i]?.pct ?? 0;
          return (
            <button key={i}
              onClick={() => unlocked && setActiveTab(i)}
              disabled={!unlocked}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-sm transition-all ${
                !unlocked
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : activeTab === i
                  ? 'text-white shadow-lg'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
              style={activeTab === i && unlocked ? { backgroundColor: lv.accent } : {}}
            >
              {!unlocked && <Lock size={11} />}
              {lv.icon.startsWith('/') || lv.icon.includes('.') ? (
                <img src={lv.icon} alt={lv.key} className="w-5 h-5 object-contain" />
              ) : (
                lv.icon
              )}{' '}
              {badgesData[i]?.title.replace(' Badge','').replace(' Award','') ?? `Level ${i+1}`}
              {pct === 100 && <span className="text-[10px]">✓</span>}
            </button>
          );
        })}
      </div>

      {/* Level content */}
      {activeData && isUnlocked(activeTab) ? (
        <ActiveLevel
          mergedReqs={activeData.mergedReqs}
          badgeTitle={activeData.localBadge.title}
          level={activeLevel}
          badgeId={activeTab + 1}
          onSubmit={handleSubmit}
          onBadgeSubmit={handleBadgeSubmit}
        />
      ) : !isUnlocked(activeTab) ? (
        <LockedLevel
          level={activeLevel}
          prevName={badgesData[activeTab - 1]?.title ?? 'previous level'}
          prevPct={merged[activeTab - 1]?.pct ?? 0}
        />
      ) : null}

      {/* Workflow legend */}
      <div className="bg-slate-900 text-white rounded-2xl p-6">
        <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400 mb-4">Approval Workflow</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { step: '1', label: 'Tick to Submit',       desc: 'Mark task as complete',     color: 'bg-slate-700' },
            { step: '2', label: 'Patrol Leader Signs',  desc: 'PL reviews & countersigns', color: 'bg-blue-600' },
            { step: '3', label: 'Scout Leader Signs',   desc: 'Final verification',        color: 'bg-purple-600' },
            { step: '✓', label: 'Fully Verified',       desc: 'Recorded in your book',     color: 'bg-emerald-600' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-3">
              <span className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full text-xs font-black ${s.color}`}>{s.step}</span>
              <div>
                <p className="font-black">{s.label}</p>
                <p className="text-slate-400 text-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
