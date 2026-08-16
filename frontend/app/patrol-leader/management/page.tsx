'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Sparkles, UserPlus, Users, Save, Trash2, AlertCircle, CheckCircle } from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function PatrolManagement() {
  const [patrol, setPatrol] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [unassignedScouts, setUnassignedScouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit details state
  const [color, setColor] = useState('');
  const [motto, setMotto] = useState('');
  const [name, setName] = useState('');
  const [submittingDetails, setSubmittingDetails] = useState(false);

  // Add member state
  const [selectedScoutId, setSelectedScoutId] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // Status/Notifications state
  const [infoMsg, setInfoMsg] = useState({ type: '', text: '' });

  const fetchPatrolData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API}/patrols/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPatrol(data.patrol);
        setMembers(data.members);
        setUnassignedScouts(data.unassigned_scouts || []);
        
        // Populate inputs
        setName(data.patrol.name);
        setColor(data.patrol.color || '');
        setMotto(data.patrol.motto || '');
      } else {
        const data = await res.json();
        setInfoMsg({ type: 'error', text: data.message || 'Failed to fetch patrol details.' });
      }
    } catch (err) {
      setInfoMsg({ type: 'error', text: 'Error contacting the server.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrolData();
  }, []);

  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingDetails(true);
    setInfoMsg({ type: '', text: '' });
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/patrols/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ color, motto })
      });
      if (res.ok) {
        setInfoMsg({ type: 'success', text: 'Patrol details updated successfully.' });
        fetchPatrolData();
      } else {
        const data = await res.json();
        setInfoMsg({ type: 'error', text: data.message || 'Failed to update details.' });
      }
    } catch (err) {
      setInfoMsg({ type: 'error', text: 'Failed to connect to the server.' });
    } finally {
      setSubmittingDetails(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScoutId) return;

    setAddingMember(true);
    setInfoMsg({ type: '', text: '' });
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/patrols/me/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ scout_id: parseInt(selectedScoutId) })
      });
      if (res.ok) {
        setInfoMsg({ type: 'success', text: 'Scout added to patrol successfully.' });
        setSelectedScoutId('');
        fetchPatrolData();
      } else {
        const data = await res.json();
        setInfoMsg({ type: 'error', text: data.message || 'Failed to add member.' });
      }
    } catch (err) {
      setInfoMsg({ type: 'error', text: 'Failed to connect to the server.' });
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (scoutId: number) => {
    if (!confirm('Are you sure you want to remove this scout from the patrol?')) return;

    setInfoMsg({ type: '', text: '' });
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API}/patrols/me/members/${scoutId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setInfoMsg({ type: 'success', text: 'Scout removed from patrol successfully.' });
        fetchPatrolData();
      } else {
        const data = await res.json();
        setInfoMsg({ type: 'error', text: data.message || 'Failed to remove member.' });
      }
    } catch (err) {
      setInfoMsg({ type: 'error', text: 'Failed to connect to the server.' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-500">Loading patrol panel…</p>
        </div>
      </div>
    );
  }

  if (!patrol) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card className="border-red-200 bg-red-50 text-red-900 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle size={28} className="text-red-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold">Access Denied / Not Found</h2>
              <p className="mt-2">
                You are currently logged in, but we couldn't find a patrol where you are assigned as the Patrol Leader. Please contact your Troop Leader to assign you.
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Shield size={32} className="text-indigo-600" />
            Patrol Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Manage details and members of the <strong className="text-slate-900">{patrol.name}</strong> Patrol
          </p>
        </div>
        <div 
          className="w-8 h-8 rounded-full shadow-sm border border-slate-200" 
          style={{ backgroundColor: color || '#6366f1' }}
          title={`Patrol Color: ${color || 'Default'}`}
        />
      </div>

      {/* Info Messages */}
      {infoMsg.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold text-sm ${
          infoMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {infoMsg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{infoMsg.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Edit Details & Add Member */}
        <div className="md:col-span-1 space-y-8">
          {/* Patrol Details Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-500" />
                Patrol Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateDetails} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Patrol ID (Read-only)
                  </label>
                  <input
                    type="text"
                    value={patrol.patrol_id}
                    disabled
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Patrol Name (Read-only)
                  </label>
                  <input
                    type="text"
                    value={name}
                    disabled
                    className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Patrol Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color || '#6366f1'}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 border border-slate-200 rounded-xl cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      placeholder="e.g. #ff0000"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Patrol Motto
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter your patrol motto..."
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submittingDetails}
                  className="w-full bg-slate-900 hover:bg-black text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {submittingDetails ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Add Member Card */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <UserPlus size={16} className="text-emerald-500" />
                Add Patrol Member
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Unassigned Troop Scouts
                  </label>
                  {unassignedScouts.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                      No unassigned scouts in your troop.
                    </p>
                  ) : (
                    <select
                      value={selectedScoutId}
                      onChange={(e) => setSelectedScoutId(e.target.value)}
                      required
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                    >
                      <option value="">-- Select a Scout --</option>
                      {unassignedScouts.map((scout) => (
                        <option key={scout.id} value={scout.id}>
                          {scout.first_name} {scout.last_name} ({scout.scout_reg_no || 'No Reg No'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={addingMember || !selectedScoutId}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus size={16} />
                  {addingMember ? 'Adding...' : 'Add to Patrol'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Members List */}
        <div className="md:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-black uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Users size={18} className="text-slate-600" />
                Current Members ({members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {members.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-medium">
                  Your patrol currently has no registered members.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Name</th>
                        <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Email</th>
                        <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest">Role</th>
                        <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((member) => (
                        <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-slate-900">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">
                              Reg No: {member.scout_reg_no || 'N/A'}
                            </p>
                          </td>
                          <td className="p-4 text-sm font-medium text-slate-500">{member.email}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                              member.role === 'patrol_leader' 
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                : 'bg-slate-50 text-slate-700 border border-slate-100'
                            }`}>
                              {member.role === 'patrol_leader' ? 'Patrol Leader' : 'Scout'}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {member.role !== 'patrol_leader' ? (
                              <button
                                onClick={() => handleRemoveMember(member.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                title="Remove member from patrol"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400 font-medium pr-2">Leader</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
