'use client';

import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Plus, X, Loader2, UploadCloud, FileText, Tag, CheckCircle2, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import DocumentUploader from '@/components/admin/DocumentUploader';

import { safeFetch } from '@/utils/safeFetch';

const API = 'http://localhost:5000/api';
const tkn = () => sessionStorage.getItem('token');
const hdr = () => ({ Authorization: `Bearer ${tkn()}`, 'Content-Type': 'application/json' });

const emptyLeader = () => ({ first_name: '', last_name: '', name: '', scout_reg_no: '', email: '' });
const emptyTroop = () => ({ name: '', address: '', phone_number: '', email: '', scout_leaders: [emptyLeader()] });

export default function AdminDashboard() {
  // Register Troop modal
  const [showTroop, setShowTroop] = useState(false);
  const [troopForm, setTroopForm] = useState(emptyTroop());
  const [creating, setCreating] = useState(false);
  const [troopResult, setTroopResult] = useState<any>(null);
  const [troopError, setTroopError] = useState('');

  // Ingest Document modal
  const [showIngest, setShowIngest] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({ district: 'Loading...', troops: 0, scouts: 0, leaders: 0 });

  useEffect(() => {
    const token = tkn();
    if (!token) return;

    safeFetch(`${API}/admin/dashboard-stats`, { headers: hdr() })
      .then(res => {
        if (res && (res.status === 401 || res.status === 404)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return null;
        }
        return res && res.ok ? res.json() : null;
      })
      .then(data => {
        if (data) setStats(data);
      })
      .catch(console.error);
  }, []);

  const handleLeaderChange = (i: number, field: string, val: string) => {
    const ls = [...troopForm.scout_leaders];
    const updated = { ...ls[i], [field]: val };
    const first = field === 'first_name' ? val : (updated.first_name || '');
    const last = field === 'last_name' ? val : (updated.last_name || '');
    updated.name = `${first} ${last}`.trim() || updated.name || '';
    ls[i] = updated;
    setTroopForm({ ...troopForm, scout_leaders: ls });
  };

  const handleCreateTroop = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setTroopError('');
    try {
      const res = await fetch(`${API}/admin/troops`, {
        method: 'POST',
        headers: hdr(),
        body: JSON.stringify(troopForm),
      });
      const data = await res.json();
      if (res.ok) setTroopResult(data);
      else setTroopError(data.message || 'Error creating troop');
    } catch { setTroopError('Network error'); }
    finally { setCreating(false); }
  };

  const closeTroop = () => {
    setShowTroop(false);
    setTroopForm(emptyTroop());
    setTroopResult(null);
    setTroopError('');
  };

  return (
    <div className="space-y-10">
      {/* Page title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {stats.district !== 'Unassigned' && stats.district !== 'Loading...' ? `${stats.district}'s ` : ''}Admin Control Panel
        </h1>
        <p className="text-gray-500 mt-1">Manage troops, leaders, and the AI knowledge base.</p>
      </div>

      {/* District Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Total Troops</p>
            <p className="text-2xl font-black text-slate-900">{stats.troops}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Total Scouts</p>
            <p className="text-2xl font-black text-slate-900">{stats.scouts}</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Scout Leaders</p>
            <p className="text-2xl font-black text-slate-900">{stats.leaders}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Quick Actions</p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowTroop(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Users size={18} />
            Register New Troop
          </button>
          <button
            onClick={() => setShowIngest(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-900 text-slate-800 px-5 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200"
          >
            <UploadCloud size={18} />
            Ingest New Document
          </button>
        </div>
      </div>

      {/* Navigation Cards */}
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Manage</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/troops" className="group bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md hover:border-slate-900 transition-all duration-200">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Troop Management</h2>
              <p className="text-sm text-slate-500 mt-1">View, edit and manage all troops and scout leaders</p>
            </div>
          </Link>

          <Link href="/admin/knowledge" className="group bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md hover:border-slate-900 transition-all duration-200">
            <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Knowledge Base</h2>
              <p className="text-sm text-slate-500 mt-1">Upload and index scout syllabus documents</p>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── REGISTER TROOP MODAL ─── */}
      {showTroop && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeTroop(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Register New Troop</h2>
              <button onClick={closeTroop} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"><X size={22} /></button>
            </div>
            <div className="p-6">
              {troopResult ? (
                <div className="space-y-4">
                  <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-bold text-green-900 mb-2 text-lg">{troopResult.message}</h3>
                    <p className="font-mono text-sm bg-white border border-green-200 rounded-lg p-2 inline-block">Troop ID: <strong>{troopResult.troop_id}</strong></p>
                  </div>
                  {troopResult.scout_leaders?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-700 mb-2">Generated Leader IDs</h4>
                      <div className="space-y-2">
                        {troopResult.scout_leaders.map((l: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-slate-50 border rounded-xl px-4 py-3">
                            <span className="font-medium text-slate-700">{l.name}</span>
                            <span className="font-mono font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg text-sm">{l.generated_leader_id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <Button onClick={closeTroop} variant="outline" className="flex-1">Close</Button>
                    <Link href="/admin/troops" className="flex-1 bg-slate-900 text-white text-center py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">View All Troops →</Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateTroop} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {([['Troop Name *', 'name', 'text', true], ['Email', 'email', 'email', false], ['Address', 'address', 'text', false], ['Phone', 'phone_number', 'text', false]] as const).map(([label, field, type, required]) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
                        <input
                          type={type}
                          required={required}
                          value={(troopForm as any)[field]}
                          onChange={e => setTroopForm({ ...troopForm, [field]: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    ))}
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Scout Leaders</h3>
                    {troopForm.scout_leaders.map((l, i) => (
                      <div key={i} className="bg-slate-50 border rounded-xl p-4 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {([
                          ['First Name *', 'first_name', 'text', true],
                          ['Last Name', 'last_name', 'text', false],
                          ['Scout Reg No', 'scout_reg_no', 'text', false],
                          ['Email', 'email', 'email', false],
                        ] as const).map(([label, field, type, required]) => (
                          <div key={field}>
                            <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                            <input
                              type={type}
                              required={required}
                              value={(l as any)[field] || ''}
                              onChange={e => handleLeaderChange(i, field, e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                        ))}
                        {troopForm.scout_leaders.length > 1 && (
                          <div className="sm:col-span-2 flex items-center">
                            <button type="button" onClick={() => setTroopForm({ ...troopForm, scout_leaders: troopForm.scout_leaders.filter((_, j) => j !== i) })}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X size={12} /> Remove leader</button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setTroopForm({ ...troopForm, scout_leaders: [...troopForm.scout_leaders, emptyLeader()] })}
                      className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-1">
                      <Plus size={14} /> Add Another Leader
                    </button>
                  </div>
                  {troopError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{troopError}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={closeTroop}>Cancel</Button>
                    <Button type="submit" disabled={creating} className="min-w-[180px]">
                      {creating ? <><Loader2 size={16} className="animate-spin mr-2" />Creating...</> : 'Create Troop & Generate IDs'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── INGEST DOCUMENT MODAL ─── */}
      {showIngest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowIngest(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Ingest New Document</h2>
              <button onClick={() => setShowIngest(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"><X size={22} /></button>
            </div>
            <div className="p-6">
              <DocumentUploader onlyUploadCard onUploadSuccess={() => setShowIngest(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
