'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Eye, Search, UserPlus, X, PlusCircle, Check, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { safeFetch } from '@/utils/safeFetch';

function formatAge(dobString: string | null) {
  if (!dobString) return '-';
  const dob = new Date(dobString);
  const today = new Date();
  if (isNaN(dob.getTime())) return '-';

  let years = today.getFullYear() - dob.getFullYear();
  let lastBirthday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

  if (lastBirthday > today) {
    years--;
    lastBirthday = new Date(today.getFullYear() - 1, dob.getMonth(), dob.getDate());
  }

  const diffTime = today.getTime() - lastBirthday.getTime();
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return `${years} years ${days} days`;
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

export default function ScoutList() {
  const [scouts, setScouts] = useState<any[]>([]);
  const [patrols, setPatrols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingScout, setEditingScout] = useState<any>(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', scout_reg_no: '', dob: '', email: '', patrol_id: '', recent_badge_id: '' });
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addMode, setAddMode] = useState<'register' | 'search'>('register');
  const [scoutSearchQ, setScoutSearchQ] = useState('');
  const [searchedScouts, setSearchedScouts] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addForm, setAddForm] = useState({ first_name: '', last_name: '', scout_reg_no: '', dob: '', email: '', patrol_id: '', recent_badge_id: '' });
  const [troopId, setTroopId] = useState<number | null>(null);

  const mainBadges = [
    { id: 1, name: "Scout Membership Badge" },
    { id: 2, name: "Scout Award" },
    { id: 3, name: "Chief Commissioner's Award" },
    { id: 4, name: "Prime Minister's Scout Award" },
    { id: 5, name: "President's Scout Award" }
  ];

  const API = 'http://localhost:5000/api';

  const fetchScouts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const profileRes = await safeFetch(`${API}/users/profile`, { 
          headers: { Authorization: `Bearer ${token}` } 
      });

      if (!profileRes || !profileRes.ok) {
        setLoading(false);
        return;
      }

      const profile = await profileRes.json();

      if (profile?.troop_id) {
        setTroopId(profile.troop_id);
        const [scoutsRes, patrolsRes] = await Promise.all([
          safeFetch(`${API}/leader/troop/scouts?troop_id=${profile.troop_id}`, { headers: { Authorization: `Bearer ${token}` } }),
          safeFetch(`${API}/leader/troop/patrols?troop_id=${profile.troop_id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        if (scoutsRes && scoutsRes.ok) {
          const scoutsData = await scoutsRes.json();
          if (Array.isArray(scoutsData)) setScouts(scoutsData);
        }

        if (patrolsRes && patrolsRes.ok) {
          const patrolsData = await patrolsRes.json();
          if (Array.isArray(patrolsData)) setPatrols(patrolsData);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch scouts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScouts();
    if (typeof window !== 'undefined' && window.location.search.includes('add=true')) {
      setIsAddOpen(true);
    }
  }, []);

  const openEdit = (scout: any) => {
    setEditingScout(scout);
    setEditForm({
      first_name: scout.first_name,
      last_name: scout.last_name,
      scout_reg_no: scout.scout_reg_no || '',
      dob: formatDobForInput(scout.dob),
      email: scout.email,
      patrol_id: scout.patrol_id || '',
      recent_badge_id: ''
    });
    setIsEditing(true);
  };

  const handleUpdate = async () => {
    if (!editingScout) return;
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/leader/scouts/${editingScout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          scout_reg_no: editForm.scout_reg_no,
          dob: editForm.dob,
          email: editForm.email,
          patrol_id: editForm.patrol_id || null,
          recent_badge_id: editForm.recent_badge_id || null
        })
      });
      if (res.ok) {
        setIsEditing(false);
        setEditingScout(null);
        fetchScouts();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to update scout');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating scout');
    }
  };

  const handleRemove = async (scout: any) => {
    if (!confirm(`Are you sure you want to remove ${scout.first_name} ${scout.last_name} from the troop?`)) return;
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/leader/scouts/${scout.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchScouts();
      } else {
        alert('Failed to remove scout');
      }
    } catch (err) {
      console.error(err);
      alert('Error removing scout');
    }
  };

  const handleAddScout = async (selectedScoutObj?: any) => {
    if (!troopId) {
      alert('Your leader account is not assigned to a troop yet.');
      return;
    }
    const token = sessionStorage.getItem('token');
    try {
      const res = await fetch(`${API}/leader/scouts/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          scout_id: selectedScoutObj ? selectedScoutObj.id : null,
          troop_id: troopId,
          first_name: addForm.first_name,
          last_name: addForm.last_name,
          scout_reg_no: addForm.scout_reg_no,
          dob: addForm.dob,
          email: addForm.email,
          patrol_id: addForm.patrol_id || null,
          recent_badge_id: addForm.recent_badge_id || null
        })
      });
      if (res.ok) {
        setIsAddOpen(false);
        setAddForm({ first_name: '', last_name: '', scout_reg_no: '', dob: '', email: '', patrol_id: '', recent_badge_id: '' });
        fetchScouts();
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to add scout');
      }
    } catch (e) {
      alert('Error adding scout');
    }
  };

  const handleSearchUnassigned = async () => {
    if (!scoutSearchQ.trim()) return;
    setSearchLoading(true);
    const token = sessionStorage.getItem('token');
    try {
      const q = encodeURIComponent(scoutSearchQ);
      let res = await fetch(`${API}/leader/scouts/search?email=${q}`, { headers: { Authorization: `Bearer ${token}` } });
      let data = await res.json();
      if (!data || data.length === 0) {
        res = await fetch(`${API}/leader/scouts/search?scout_reg_no=${q}`, { headers: { Authorization: `Bearer ${token}` } });
        data = await res.json();
      }
      setSearchedScouts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!filteredScouts || filteredScouts.length === 0) {
      alert('No scout records available to export.');
      return;
    }

    const headers = [
      'First Name',
      'Last Name',
      'Registration No',
      'Date of Birth',
      'Age',
      'Email',
      'Patrol Name',
      'Recent Badge'
    ];

    const rows = filteredScouts.map(scout => [
      `"${(scout.first_name || '').replace(/"/g, '""')}"`,
      `"${(scout.last_name || '').replace(/"/g, '""')}"`,
      `"${(scout.scout_reg_no || '-').replace(/"/g, '""')}"`,
      `"${scout.dob ? new Date(scout.dob).toLocaleDateString('en-GB') : '-'}"`,
      `"${scout.dob ? formatAge(scout.dob) : '-'}"`,
      `"${(scout.email || '').replace(/"/g, '""')}"`,
      `"${(scout.patrol_name || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(scout.recent_badge || 'None').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const todayStr = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `SmartScouts_Troop_Scouts_Overview_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredScouts = scouts.filter(s => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();
    const fullName = `${s.first_name || ''} ${s.last_name || ''}`.toLowerCase();
    const email = (s.email || '').toLowerCase();
    const regNo = (s.scout_reg_no || '').toLowerCase();
    const patrol = (s.patrol_name || '').toLowerCase();
    return fullName.includes(q) || email.includes(q) || regNo.includes(q) || patrol.includes(q);
  });

  if (loading) {
    return <div className="p-8 text-center font-bold text-slate-600">Loading scouts overview...</div>;
  }

  return (
    <div className="w-full space-y-6 px-1 sm:px-3 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Scouts Overview</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Manage and track all registered scouts in your troop.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            title="Download Scouts Overview in Excel format"
          >
            <Download size={18} />
            Download Excel
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            <UserPlus size={18} />
            Add Scout to Troop
          </button>
        </div>
      </div>

      {/* Main Card with Search Bar */}
      <Card className="border border-slate-200 shadow-md rounded-2xl overflow-hidden bg-white">
        {/* Search Bar Bar Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-96">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search scouts by name, email, reg no, or patrol..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 text-sm font-medium transition-all shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
          </div>
          <span className="text-xs font-bold text-slate-500">
            Showing <strong className="text-slate-900">{filteredScouts.length}</strong> of {scouts.length} scouts
          </span>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase tracking-wider text-[11px] font-black">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Reg. No</th>
                  <th className="px-6 py-4">DOB / Age</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Patrol</th>
                  <th className="px-6 py-4">Recent Badge</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                  <th className="px-6 py-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredScouts.map(scout => (
                  <tr key={scout.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-black text-slate-900">
                      {scout.first_name} {scout.last_name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">{scout.scout_reg_no || '-'}</td>
                    <td className="px-6 py-4 text-slate-600">
                      {scout.dob ? (
                        <div className="flex flex-col">
                          <span className="font-bold text-xs">{new Date(scout.dob).toLocaleDateString('en-GB')}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{formatAge(scout.dob)}</span>
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{scout.email}</td>
                    <td className="px-6 py-4">
                      {scout.patrol_name ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          {scout.patrol_name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {scout.recent_badge ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 shadow-sm">
                          🏅 {scout.recent_badge}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button onClick={() => openEdit(scout)} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wider">Edit</button>
                      <button onClick={() => handleRemove(scout)} className="text-red-600 hover:text-red-800 text-xs font-bold uppercase tracking-wider">Remove</button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/leader/scout-profile?id=${scout.id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-xs font-bold inline-flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-colors"
                      >
                        <Eye size={14} /> View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredScouts.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500 font-medium">
                      {searchTerm ? `No scouts found matching "${searchTerm}".` : 'No scouts found in this troop.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Scout Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg shadow-2xl border-0">
            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg text-slate-900 font-bold">Edit Scout Profile</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">First Name</label>
                    <input 
                      type="text" 
                      value={editForm.first_name} 
                      onChange={e => setEditForm(prev => ({...prev, first_name: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      value={editForm.last_name} 
                      onChange={e => setEditForm(prev => ({...prev, last_name: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={editForm.email} 
                    onChange={e => setEditForm(prev => ({...prev, email: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-slate-50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Registration No</label>
                    <input 
                      type="text" 
                      value={editForm.scout_reg_no} 
                      onChange={e => setEditForm(prev => ({...prev, scout_reg_no: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Date of Birth</label>
                    <input 
                      type="date"
                      value={editForm.dob} 
                      onChange={e => setEditForm(prev => ({...prev, dob: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Patrol (Optional)</label>
                  <select
                    value={editForm.patrol_id}
                    onChange={e => setEditForm(prev => ({...prev, patrol_id: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                  >
                    <option value="">-- No Patrol --</option>
                    {patrols.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Assign New Badge (Optional)</label>
                  <select
                    value={editForm.recent_badge_id}
                    onChange={e => setEditForm(prev => ({...prev, recent_badge_id: e.target.value}))}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                  >
                    <option value="">-- Leave Unchanged / No Action --</option>
                    {mainBadges.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Select a badge only if you want to record a newly earned main badge.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  onClick={() => { setIsEditing(false); setEditingScout(null); }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Scout Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <Card className="w-full max-w-xl shadow-2xl border-0 overflow-hidden my-8">
            <CardHeader className="bg-slate-900 text-white p-5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-emerald-400" />
                <CardTitle className="text-lg font-bold text-white">Add Scout to Troop</CardTitle>
              </div>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </CardHeader>

            <div className="flex border-b border-slate-200 bg-slate-100 p-1">
              <button
                onClick={() => setAddMode('register')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  addMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                + Register New Scout
              </button>
              <button
                onClick={() => setAddMode('search')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  addMode === 'search' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔍 Search Unassigned Scout
              </button>
            </div>

            <CardContent className="p-6">
              {addMode === 'register' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                      <input 
                        type="text" 
                        value={addForm.first_name} 
                        onChange={e => setAddForm(prev => ({...prev, first_name: e.target.value}))}
                        placeholder="e.g. Ruwan"
                        className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                      <input 
                        type="text" 
                        value={addForm.last_name} 
                        onChange={e => setAddForm(prev => ({...prev, last_name: e.target.value}))}
                        placeholder="e.g. Perera"
                        className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      value={addForm.email} 
                      onChange={e => setAddForm(prev => ({...prev, email: e.target.value}))}
                      placeholder="e.g. scout@example.com"
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Registration No</label>
                      <input 
                        type="text" 
                        value={addForm.scout_reg_no} 
                        onChange={e => setAddForm(prev => ({...prev, scout_reg_no: e.target.value}))}
                        placeholder="e.g. SL/BT/0088"
                        className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input 
                        type="date"
                        value={addForm.dob} 
                        onChange={e => setAddForm(prev => ({...prev, dob: e.target.value}))}
                        className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assign to Patrol (Optional)</label>
                    <select
                      value={addForm.patrol_id}
                      onChange={e => setAddForm(prev => ({...prev, patrol_id: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    >
                      <option value="">-- No Patrol (Unassigned) --</option>
                      {patrols.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Initial Badge (Optional)</label>
                    <select
                      value={addForm.recent_badge_id}
                      onChange={e => setAddForm(prev => ({...prev, recent_badge_id: e.target.value}))}
                      className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    >
                      <option value="">-- None --</option>
                      {mainBadges.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleAddScout()}
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-black rounded-xl shadow-md transition-all"
                    >
                      Add Scout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-500 font-medium">Search for an existing registered scout by email or reg number to add them to your troop.</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scoutSearchQ}
                      onChange={e => setScoutSearchQ(e.target.value)}
                      placeholder="Enter email or registration number..."
                      className="flex-1 px-3.5 py-2 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
                    />
                    <button
                      onClick={handleSearchUnassigned}
                      disabled={searchLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      {searchLoading ? 'Searching...' : 'Search'}
                    </button>
                  </div>

                  {searchedScouts.length > 0 && (
                    <div className="space-y-2 mt-4 max-h-60 overflow-y-auto">
                      {searchedScouts.map(s => (
                        <div key={s.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{s.first_name} {s.last_name}</p>
                            <p className="text-xs text-slate-500">{s.email} • {s.scout_reg_no || 'No Reg No'}</p>
                          </div>
                          <button
                            onClick={() => handleAddScout(s)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            + Add to Troop
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {scoutSearchQ && !searchLoading && searchedScouts.length === 0 && (
                    <p className="text-xs text-amber-600 font-medium text-center py-4">No unassigned scouts found matching "{scoutSearchQ}".</p>
                  )}

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setIsAddOpen(false)}
                      className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-900"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
