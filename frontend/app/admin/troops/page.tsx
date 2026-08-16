'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, X, Search, Pencil, Trash2, Loader2, Users, ChevronDown, ChevronUp } from 'lucide-react';

const API = 'http://localhost:5000/api';
const tkn = () => sessionStorage.getItem('token');
const hdr = () => ({ Authorization: `Bearer ${tkn()}`, 'Content-Type': 'application/json' });

interface Leader {
  id?: number;
  first_name?: string;
  last_name?: string;
  name: string;
  scout_reg_no?: string;
  email: string;
  leader_registration_id?: string;
  registered?: boolean;
}

interface Troop {
  id: number;
  troop_id: string;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  created_at: string;
  leaders: Leader[];
}

const emptyLeader = (): Leader => ({ first_name: '', last_name: '', name: '', scout_reg_no: '', email: '' });
const emptyTroop = () => ({ name: '', address: '', phone_number: '', email: '', scout_leaders: [emptyLeader()] });

export default function TroopManagement() {
  const [troops, setTroops] = useState<Troop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(emptyTroop());
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<any>(null);
  const [createError, setCreateError] = useState('');

  // Edit modal
  const [editTroop, setEditTroop] = useState<Troop | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTroops = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/troops`, { headers: hdr() });
      if (res.ok) setTroops(await res.json());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchTroops(); }, []);

  // Search / filter
  const filtered = useMemo(() => {
    if (!search.trim()) return troops;
    const q = search.toLowerCase();
    return troops.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      t.troop_id?.toLowerCase().includes(q) ||
      t.leaders?.some(l => l.name?.toLowerCase().includes(q) || l.leader_registration_id?.toLowerCase().includes(q))
    );
  }, [troops, search]);

  // CREATE handlers
  const handleCreateLeaderChange = (i: number, field: string, val: string) => {
    const ls = [...createForm.scout_leaders];
    const updated = { ...ls[i], [field]: val };
    const first = field === 'first_name' ? val : (updated.first_name || '');
    const last = field === 'last_name' ? val : (updated.last_name || '');
    updated.name = `${first} ${last}`.trim() || updated.name || '';
    ls[i] = updated;
    setCreateForm({ ...createForm, scout_leaders: ls });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setCreateError('');
    try {
      const res = await fetch(`${API}/admin/troops`, {
        method: 'POST', headers: hdr(),
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (res.ok) {
        setCreateResult(data);
        fetchTroops();
      } else {
        setCreateError(data.message || 'Error creating troop');
      }
    } catch { setCreateError('Network error'); }
    finally { setCreating(false); }
  };

  const closeCreate = () => {
    setShowCreate(false);
    setCreateForm(emptyTroop());
    setCreateResult(null);
    setCreateError('');
  };

  // EDIT handlers
  const openEdit = (troop: Troop) => {
    setEditTroop(troop);
    setEditForm({
      name: troop.name,
      address: troop.address || '',
      phone_number: troop.phone_number || '',
      email: troop.email || '',
      scout_leaders: (troop.leaders || []).map(l => {
        const parts = (l.name || '').trim().split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        return {
          first_name: l.first_name || first,
          last_name: l.last_name || last,
          name: l.name,
          scout_reg_no: l.scout_reg_no || '',
          email: l.email || '',
          leader_registration_id: l.leader_registration_id,
        };
      }),
    });
    setSaveError('');
  };

  const handleEditLeaderChange = (i: number, field: string, val: string) => {
    const ls = [...editForm.scout_leaders];
    const updated = { ...ls[i], [field]: val };
    const first = field === 'first_name' ? val : (updated.first_name || '');
    const last = field === 'last_name' ? val : (updated.last_name || '');
    updated.name = `${first} ${last}`.trim() || updated.name || '';
    ls[i] = updated;
    setEditForm({ ...editForm, scout_leaders: ls });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTroop) return;
    setSaving(true); setSaveError('');
    try {
      const res = await fetch(`${API}/admin/troops/${editTroop.id}`, {
        method: 'PUT', headers: hdr(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEditTroop(null);
        fetchTroops();
      } else {
        setSaveError(data.message || 'Error updating');
      }
    } catch { setSaveError('Network error'); }
    finally { setSaving(false); }
  };

  // DELETE handler
  const handleDelete = async (id: number) => {
    if (!confirm('Delete this troop and all its pre-registered leaders? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`${API}/admin/troops/${id}`, { method: 'DELETE', headers: hdr() });
      if (res.ok) fetchTroops();
    } catch {} finally { setDeletingId(null); }
  };

  const LeaderRow = ({ leaders }: { leaders: Leader[] }) => (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
      {leaders.length === 0 && <p className="text-sm text-slate-400 italic col-span-2">No pre-registered leaders.</p>}
      {leaders.map((l, idx) => (
        <div key={idx} className="bg-slate-50 border rounded-xl p-3 flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-800 truncate">{l.name}</p>
            <p className="text-xs text-slate-500 truncate">{l.email}</p>
            {l.scout_reg_no && (
              <p className="mt-1 font-mono text-[11px] font-bold text-green-700 bg-green-100/50 px-2 py-0.5 rounded-full inline-block border border-green-200/50">
                Reg No: {l.scout_reg_no}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-slate-400 uppercase font-bold">Generated ID</p>
            <p className="font-mono text-sm font-bold text-slate-700">{l.leader_registration_id}</p>
            {l.registered
              ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1 inline-block">Registered</span>
              : <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">Pending</span>
            }
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Troop Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage troops and scout leaders.</p>
        </div>
        <Button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-bold shrink-0"
        >
          <Plus size={18} />
          Register New Troop
        </Button>
      </div>

      {/* Search & filter bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by troop name, troop ID, leader name or leader ID..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
        />
      </div>

      {/* Troop list */}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-slate-400">
          <Users size={40} className="mb-3" />
          <p className="font-semibold text-lg">{troops.length === 0 ? 'No troops registered yet' : 'No results match your search'}</p>
          <p className="text-sm mt-1">Try adjusting your search or register a new troop.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(troop => (
            <Card key={troop.id} className="p-0 overflow-hidden border border-slate-200 shadow-sm">
              {/* Card header row */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-lg font-bold text-slate-800">{troop.name}</h3>
                    <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{troop.troop_id}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 truncate">{[troop.address, troop.email, troop.phone_number].filter(Boolean).join(' · ')}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setExpandedId(expandedId === troop.id ? null : troop.id)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-3 py-2 border rounded-lg transition-colors"
                  >
                    {troop.leaders?.length ?? 0} leaders
                    {expandedId === troop.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(troop)}
                    className="p-2 rounded-lg text-slate-400 hover:bg-yellow-50 hover:text-yellow-600 border border-slate-200 transition-colors"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(troop.id)}
                    disabled={deletingId === troop.id}
                    className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-200 transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deletingId === troop.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>

              {/* Expanded leaders section */}
              {expandedId === troop.id && (
                <div className="border-t border-slate-100 bg-slate-50/60 px-5 pb-5 pt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Pre-registered Scout Leaders</p>
                  <LeaderRow leaders={troop.leaders || []} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* ─── CREATE MODAL ─── */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) closeCreate(); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-800">Register New Troop</h2>
              <button onClick={closeCreate} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"><X size={22} /></button>
            </div>
            <div className="p-6">
              {createResult ? (
                <div className="space-y-4">
                  <div className="p-5 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-bold text-green-900 mb-2 text-lg">{createResult.message}</h3>
                    <p className="font-mono text-sm bg-white border border-green-200 rounded-lg p-2 inline-block">Troop ID: <strong>{createResult.troop_id}</strong></p>
                  </div>
                  {createResult.scout_leaders?.length > 0 && (
                    <div>
                      <h4 className="font-bold text-slate-700 mb-2">Generated Leader IDs</h4>
                      <div className="space-y-2">
                        {createResult.scout_leaders.map((l: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-slate-50 border rounded-xl px-4 py-3">
                            <span className="font-medium text-slate-700">{l.name}</span>
                            <span className="font-mono font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-lg text-sm">{l.generated_leader_id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <Button onClick={closeCreate} className="w-full mt-4">Done</Button>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[['Troop Name *', 'name', 'text', true], ['Email', 'email', 'email', false], ['Address', 'address', 'text', false], ['Phone', 'phone_number', 'text', false]].map(([label, field, type, required]) => (
                      <div key={field as string}>
                        <label className="block text-sm font-medium text-slate-600 mb-1">{label as string}</label>
                        <input
                          type={type as string}
                          required={required as boolean}
                          value={(createForm as any)[field as string]}
                          onChange={e => setCreateForm({ ...createForm, [field as string]: e.target.value })}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                      </div>
                    ))}
                  </div>
                  <hr className="border-slate-100" />
                  <div>
                    <h3 className="font-bold text-slate-800 mb-3">Scout Leaders</h3>
                    {createForm.scout_leaders.map((l, i) => (
                      <div key={i} className="bg-slate-50 border rounded-xl p-4 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          ['First Name *', 'first_name', 'text', true],
                          ['Last Name', 'last_name', 'text', false],
                          ['Scout Reg No', 'scout_reg_no', 'text', false],
                          ['Email', 'email', 'email', false],
                        ].map(([label, field, type, required]) => (
                          <div key={field as string}>
                            <label className="block text-xs font-medium text-slate-500 mb-1">{label as string}</label>
                            <input
                              type={type as string}
                              required={required as boolean}
                              value={(l as any)[field as string] || ''}
                              onChange={e => handleCreateLeaderChange(i, field as string, e.target.value)}
                              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                          </div>
                        ))}
                        {createForm.scout_leaders.length > 1 && (
                          <div className="flex items-end sm:col-span-2">
                            <button type="button" onClick={() => setCreateForm({ ...createForm, scout_leaders: createForm.scout_leaders.filter((_, j) => j !== i) })}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X size={12} /> Remove leader</button>
                          </div>
                        )}
                      </div>
                    ))}
                    <button type="button" onClick={() => setCreateForm({ ...createForm, scout_leaders: [...createForm.scout_leaders, emptyLeader()] })}
                      className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-1">
                      <Plus size={14} /> Add Another Leader
                    </button>
                  </div>
                  {createError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{createError}</p>}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={closeCreate}>Cancel</Button>
                    <Button type="submit" disabled={creating} className="min-w-[160px]">
                      {creating ? <><Loader2 size={16} className="animate-spin mr-2" />Creating...</> : 'Create Troop & Generate IDs'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── EDIT MODAL ─── */}
      {editTroop && editForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setEditTroop(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Edit Troop</h2>
                <p className="text-sm text-slate-400 font-mono">{editTroop.troop_id}</p>
              </div>
              <button onClick={() => setEditTroop(null)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"><X size={22} /></button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[['Troop Name *', 'name', 'text', true], ['Email', 'email', 'email', false], ['Address', 'address', 'text', false], ['Phone', 'phone_number', 'text', false]].map(([label, field, type, required]) => (
                    <div key={field as string}>
                      <label className="block text-sm font-medium text-slate-600 mb-1">{label as string}</label>
                      <input
                        type={type as string}
                        required={required as boolean}
                        value={editForm[field as string]}
                        onChange={e => setEditForm({ ...editForm, [field as string]: e.target.value })}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                    </div>
                  ))}
                </div>
                <hr className="border-slate-100" />
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Scout Leaders</h3>
                  <p className="text-xs text-slate-400 mb-3">Already-registered leaders are preserved. Only unregistered entries will be replaced.</p>
                  {editForm.scout_leaders.map((l: any, i: number) => (
                    <div key={i} className="bg-slate-50 border rounded-xl p-4 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {l.leader_registration_id && (
                        <div className="sm:col-span-2">
                          <span className="font-mono text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">{l.leader_registration_id}</span>
                        </div>
                      )}
                      {[
                        ['First Name *', 'first_name', 'text', true],
                        ['Last Name', 'last_name', 'text', false],
                        ['Scout Reg No', 'scout_reg_no', 'text', false],
                        ['Email', 'email', 'email', false],
                      ].map(([label, field, type, required]) => (
                        <div key={field as string}>
                          <label className="block text-xs font-medium text-slate-500 mb-1">{label as string}</label>
                          <input
                            type={type as string}
                            required={required as boolean}
                            value={l[field as string] || ''}
                            onChange={e => handleEditLeaderChange(i, field as string, e.target.value)}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                      ))}
                      {editForm.scout_leaders.length > 0 && (
                        <div className="flex items-end sm:col-span-2">
                          <button type="button" onClick={() => setEditForm({ ...editForm, scout_leaders: editForm.scout_leaders.filter((_: any, j: number) => j !== i) })}
                            className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"><X size={12} /> Remove</button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => setEditForm({ ...editForm, scout_leaders: [...editForm.scout_leaders, emptyLeader()] })}
                    className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Another Leader
                  </button>
                </div>
                {saveError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{saveError}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setEditTroop(null)}>Cancel</Button>
                  <Button type="submit" disabled={saving} className="min-w-[120px]">
                    {saving ? <><Loader2 size={16} className="animate-spin mr-2" />Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
