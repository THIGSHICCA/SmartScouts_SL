'use client';
/**
 * /scout/proficiency
 * Proficiency Badge Library — scouts upload badge examiner's certificate
 * to claim each proficiency badge.
 */
import React, { useState, useEffect } from 'react';
import { Search, Upload, CheckCircle, Clock, X, FileText, ExternalLink, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { LangToggle } from '@/context/LangContext';
import { proficiencyBadgesData } from '@/data/badges';

const API = 'http://localhost:5000/api';

/* ── Group colours ──────────────────────────────────────────── */
const GROUP_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Public Service Group':        { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-400' },
  'Camp Craft Group':            { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  dot: 'bg-green-400' },
  'Education Group':             { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  'Sports Group':                { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  'Social Group':                { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200',   dot: 'bg-pink-400' },
  'Culture Group':               { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  'Farmer Group':                { bg: 'bg-lime-50',   text: 'text-lime-700',   border: 'border-lime-200',   dot: 'bg-lime-400' },
  'New Explorer Group':          { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-400' },
  'Explorer Group':              { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   dot: 'bg-teal-400' },
  'Seaman Group':                { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   dot: 'bg-cyan-400' },
  'Airman Group':                { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    dot: 'bg-sky-400' },
  'Practical Science Group':     { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-400' },
  'Hobbies Group':               { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   dot: 'bg-rose-400' },
  'Family Life Education Group': { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400' },
};
const DEF_COLOR = { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-400' };

type BadgeEvidence = {
  badgeCode: string;
  status: 'submitted' | 'verified';
  evidenceRef: string;
  submittedAt: string;
  examinerNote?: string;
};

/* ── Certificate Upload Modal ───────────────────────────────── */
function CertificateModal({
  badge,
  existing,
  onClose,
  onSubmit,
  onAskAI,
}: {
  badge: typeof proficiencyBadgesData[0];
  existing?: BadgeEvidence;
  onClose: () => void;
  onSubmit: (badgeCode: string, evidenceRef: string) => void;
  onAskAI: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const colors = GROUP_COLORS[badge.group] ?? DEF_COLOR;

  const canSubmit = !!(file || url.trim());

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    const ref = file ? `certificate:${file.name}` : url.trim();
    await onSubmit(badge.code, ref);
    setBusy(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="bg-slate-900 text-white p-6 flex items-start gap-4">
          <span className="text-4xl">{badge.icon}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                {badge.code}
              </span>
              <span className="text-xs text-slate-400">{badge.group}</span>
            </div>
            <h3 className="font-black text-xl mt-1">{badge.title}</h3>
            <p className="text-slate-400 text-sm mt-0.5">{badge.description}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors mt-1">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Already submitted view */}
          {existing ? (
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={16} className="text-emerald-600" />
                <span className="font-black text-emerald-700 text-sm">Certificate Submitted</span>
              </div>
              <p className="text-xs text-slate-500">Submitted on {new Date(existing.submittedAt).toLocaleDateString('en-GB')}</p>
              <p className="text-xs font-mono text-slate-600 mt-1 truncate">{existing.evidenceRef}</p>
              {existing.evidenceRef.startsWith('http') && (
                <a href={existing.evidenceRef} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-emerald-700 hover:underline">
                  <ExternalLink size={11} /> View Certificate
                </a>
              )}
              <p className="text-xs text-slate-400 mt-2">You can re-upload to replace the certificate below.</p>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <FileText size={18} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-black text-slate-700 text-sm">Badge Examiner's Certificate Required</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Upload the certificate signed and stamped by the registered Badge Examiner
                    confirming you have completed all requirements for this proficiency badge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ask AI button */}
          <button
            onClick={() => { onClose(); onAskAI(); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🤖</span>
            </div>
            <div className="flex-1 text-left">
              <p className="font-black text-yellow-900 text-sm">Ask AI about this badge</p>
              <p className="text-xs text-yellow-700 mt-0.5">Get detailed requirements &amp; preparation tips</p>
            </div>
            <ChevronRight size={16} className="text-yellow-600 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* File upload */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
              Upload Certificate
            </label>
            <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center cursor-pointer hover:border-slate-400 transition-colors">
              <Upload className="mx-auto text-slate-400 mb-2" size={28} />
              <p className="font-bold text-slate-700 text-sm">
                {file ? file.name : 'Click to browse — photo or PDF of certificate'}
              </p>
              <p className="text-xs text-slate-400 mt-1">JPG, PNG, PDF accepted</p>
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={e => { setFile(e.target.files?.[0] ?? null); setUrl(''); }}
              />
            </label>
          </div>

          {/* OR URL */}
          <div>
            <div className="relative flex items-center gap-3 mb-3">
              <div className="flex-1 border-t border-slate-200" />
              <span className="text-xs font-bold text-slate-400">OR paste link</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>
            <input
              type="url"
              placeholder="https://drive.google.com/… (scanned certificate)"
              value={url}
              onChange={e => { setUrl(e.target.value); setFile(null); }}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || busy}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 text-white font-black disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {busy
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
                : <><Upload size={14} />{existing ? 'Re-upload Certificate' : 'Submit Certificate'}</>
              }
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            The certificate will be reviewed by your Scout Leader for final verification.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Badge Card ─────────────────────────────────────────────── */
function BadgeCard({
  badge,
  evidence,
  onClick,
  onAskAI,
}: {
  badge: typeof proficiencyBadgesData[0];
  evidence?: BadgeEvidence;
  onClick: () => void;
  onAskAI: () => void;
}) {
  const colors = GROUP_COLORS[badge.group] ?? DEF_COLOR;
  const submitted = !!evidence;

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md group
        ${submitted
          ? 'border-emerald-300 bg-emerald-50'
          : `${colors.bg} ${colors.border}`
        }`}
    >
      {/* Submitted badge indicator */}
      {submitted && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
          <CheckCircle size={11} className="text-white fill-white" />
        </div>
      )}

      {/* Main clickable area */}
      <div className="flex items-center gap-3 flex-1 min-w-0" onClick={onClick}>
        <span className="text-2xl flex-shrink-0">{badge.icon}</span>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-black truncate ${submitted ? 'text-emerald-800' : colors.text}`} title={badge.title}>
            {badge.title}
          </p>
          <p className="text-[10px] font-mono text-slate-400">{badge.code}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{badge.description}</p>
          {submitted && (
            <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-black text-emerald-600">
              <CheckCircle size={9} /> Certificate Submitted
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Upload */}
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          title="Upload certificate"
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            submitted ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Upload size={12} />
        </button>
        {/* Ask AI */}
        <button
          onClick={e => { e.stopPropagation(); onAskAI(); }}
          title="Ask AI about this badge"
          className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors"
        >
          <span className="text-xs">🤖</span>
        </button>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function ProficiencyBadges() {
  const [levelTab, setLevelTab] = useState<'junior' | 'senior' | 'both'>('junior');
  const [search, setSearch]     = useState('');
  const [groupFilter, setGroupFilter] = useState('All');
  const [selectedBadge, setSelectedBadge] = useState<typeof proficiencyBadgesData[0] | null>(null);

  // Local evidence store (persisted to sessionStorage until API is wired)
  const [evidenceMap, setEvidenceMap] = useState<Record<string, BadgeEvidence>>({});

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      // Guard: Check troop assignment
      fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && !data.troop_id) {
            window.location.href = '/scout/dashboard'; // Fallback redirect if they somehow got here
          }
        })
        .catch(() => {});
    }

    try {
      const saved = sessionStorage.getItem('prof_evidence');
      if (saved) setEvidenceMap(JSON.parse(saved));
    } catch {}
  }, []);

  const saveEvidence = (updated: Record<string, BadgeEvidence>) => {
    setEvidenceMap(updated);
    sessionStorage.setItem('prof_evidence', JSON.stringify(updated));
  };

  const handleSubmitCertificate = async (badgeCode: string, evidenceRef: string) => {
    const token = sessionStorage.getItem('token');

    // Try to POST to backend (non-blocking)
    try {
      await fetch(`${API}/evidence/proficiency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ badge_code: badgeCode, evidence_url: evidenceRef }),
      });
    } catch { /* backend not yet wired — stored locally */ }

    const updated = {
      ...evidenceMap,
      [badgeCode]: {
        badgeCode,
        status: 'submitted' as const,
        evidenceRef,
        submittedAt: new Date().toISOString(),
      },
    };
    saveEvidence(updated);
  };

  const handleAskAI = (badge: typeof proficiencyBadgesData[0]) => {
    window.dispatchEvent(new CustomEvent('ask-ai-badge', { detail: badge }));
  };

  const allBadges = proficiencyBadgesData;
  const levelFiltered = allBadges.filter(b => b.level === levelTab || b.level === 'both');
  const groups = ['All', ...Array.from(new Set(levelFiltered.map(b => b.group)))];

  const shown = levelFiltered.filter(b => {
    const matchGroup = groupFilter === 'All' || b.group === groupFilter;
    const matchSearch = !search
      || b.title.toLowerCase().includes(search.toLowerCase())
      || b.code.toLowerCase().includes(search.toLowerCase())
      || b.description.toLowerCase().includes(search.toLowerCase());
    return matchGroup && matchSearch;
  });

  const grouped = shown.reduce((acc: Record<string, typeof allBadges>, b) => {
    if (!acc[b.group]) acc[b.group] = [];
    acc[b.group].push(b);
    return acc;
  }, {});

  const submittedCount = Object.keys(evidenceMap).length;
  const juniorCount = allBadges.filter(b => b.level === 'junior').length;
  const seniorCount = allBadges.filter(b => b.level === 'senior').length;
  const intlCount   = allBadges.filter(b => b.level === 'both').length;

  const LEVEL_TABS = [
    { key: 'junior' as const, label: 'Junior Scout',  emoji: '⚜️', count: juniorCount },
    { key: 'senior' as const, label: 'Senior Scout',  emoji: '🏅', count: seniorCount },
    { key: 'both'   as const, label: 'International', emoji: '🌏', count: intlCount   },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">

      {/* Certificate Upload Modal */}
      {selectedBadge && (
        <CertificateModal
          badge={selectedBadge}
          existing={evidenceMap[selectedBadge.code]}
          onClose={() => setSelectedBadge(null)}
          onSubmit={handleSubmitCertificate}
          onAskAI={() => handleAskAI(selectedBadge)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">⭐ Proficiency Badge Library</h1>
          <p className="text-slate-500 font-medium mt-1">
            Click any badge to upload your Badge Examiner's certificate
          </p>
        </div>
        <LangToggle />
      </div>

      {/* Stats banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Your Progress</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Junior Badges', value: juniorCount, emoji: '⚜️' },
            { label: 'Senior Badges', value: seniorCount, emoji: '🏅' },
            { label: 'Badges Earned', value: submittedCount, emoji: '✅', highlight: true },
          ].map(item => (
            <div
              key={item.label}
              className={`rounded-2xl p-4 text-center border transition-all ${
                item.highlight
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-slate-50 border-slate-100 hover:bg-slate-100/60'
              }`}
            >
              <div className="text-2xl mb-1">{item.emoji}</div>
              <p className={`text-2xl font-black ${item.highlight ? 'text-emerald-700' : 'text-slate-900'}`}>{item.value}</p>
              <p className={`text-xs font-bold ${item.highlight ? 'text-emerald-800' : 'text-slate-500'}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <p className="font-black text-blue-800 text-sm mb-2">📋 How to Claim a Proficiency Badge</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { step: '1', text: 'Complete all badge requirements with a registered Badge Examiner' },
            { step: '2', text: 'Get the signed & stamped certificate from the Badge Examiner' },
            { step: '3', text: 'Click the badge here and upload a photo/scan of the certificate' },
          ].map(s => (
            <div key={s.step} className="flex items-start gap-2">
              <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{s.step}</span>
              <p className="text-blue-700 text-xs leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Level tabs */}
      <div className="flex gap-2 flex-wrap">
        {LEVEL_TABS.map(l => (
          <button key={l.key}
            onClick={() => { setLevelTab(l.key); setGroupFilter('All'); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition-all ${
              levelTab === l.key
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {l.emoji} {l.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${
              levelTab === l.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{l.count}</span>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, code, or description…"
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm"
          />
        </div>
        <select
          value={groupFilter}
          onChange={e => setGroupFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm font-semibold text-slate-700 min-w-[200px]"
        >
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center border-none shadow-sm bg-slate-50">
          <p className="text-2xl font-black text-slate-900">{levelFiltered.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">In This Level</p>
        </Card>
        <Card className="p-4 text-center border-none shadow-sm bg-slate-50">
          <p className="text-2xl font-black text-slate-900">{shown.length}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Showing</p>
        </Card>
        <Card className="p-4 text-center border-none shadow-sm bg-emerald-50">
          <p className="text-2xl font-black text-emerald-600">{submittedCount}</p>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Submitted</p>
        </Card>
      </div>

      {/* Badge grid */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="p-16 text-center border-none shadow-md">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-black text-slate-900 mb-1">No badges found</h3>
          <p className="text-slate-500">Try adjusting your search or filter.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([groupName, groupBadges]) => {
            const colors = GROUP_COLORS[groupName] ?? DEF_COLOR;
            const groupSubmitted = groupBadges.filter(b => evidenceMap[b.code]).length;
            return (
              <div key={groupName}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                  <h2 className={`font-black text-lg ${colors.text}`}>{groupName}</h2>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${colors.bg} ${colors.border} ${colors.text}`}>
                    {groupBadges.length} badges
                  </span>
                  {groupSubmitted > 0 && (
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                      ✓ {groupSubmitted} submitted
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupBadges.map(badge => (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      evidence={evidenceMap[badge.code]}
                      onClick={() => setSelectedBadge(badge)}
                      onAskAI={() => handleAskAI(badge)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="bg-slate-900 text-white rounded-2xl p-6">
        <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400 mb-3">About Proficiency Badges</h3>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Proficiency badges are earned by demonstrating specific skills to a registered Badge Examiner.
          Upload your signed certificate here after receiving it.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            { level: 'Scout Award',                req: '3 badges required (incl. Happy Home Badge)' },
            { level: "Chief Commissioner's Award", req: '3 compulsory proficiency badges' },
            { level: "Prime Minister's Award",     req: 'Additional badges from specific groups' },
          ].map(item => (
            <div key={item.level} className="bg-white/10 rounded-xl p-3">
              <p className="font-black text-yellow-300 text-xs mb-1">{item.level}</p>
              <p className="text-slate-400 text-xs">{item.req}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
