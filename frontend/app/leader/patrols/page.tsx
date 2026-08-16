'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { safeFetch } from '@/utils/safeFetch';

export default function PatrolManagement() {
  const [patrols, setPatrols] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Create state
  const [patrolName, setPatrolName] = useState('');
  const [patrolLeaderId, setPatrolLeaderId] = useState('');
  const [selectedScouts, setSelectedScouts] = useState<string[]>([]);
  const [availableScouts, setAvailableScouts] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);

  // Edit state
  const [editPatrolId, setEditPatrolId] = useState<number | null>(null);
  const [editPatrolName, setEditPatrolName] = useState('');
  const [editPatrolLeaderId, setEditPatrolLeaderId] = useState('');
  const [editSelectedScouts, setEditSelectedScouts] = useState<string[]>([]);
  const [editAvailableScouts, setEditAvailableScouts] = useState<any[]>([]); // Current members + Unassigned
  const [editResult, setEditResult] = useState<any>(null);

  const fetchPatrols = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const profileRes = await safeFetch('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (!profileRes || !profileRes.ok) {
        setLoading(false);
        return;
      }

      const profile = await profileRes.json();

      if (profile?.troop_id) {
        const res = await safeFetch(`http://localhost:5000/api/leader/troop/patrols?troop_id=${profile.troop_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setPatrols(data);
        }
      }
    } catch (error) {
      console.warn("Failed to fetch patrols:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnassignedScouts = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return [];
      const profileRes = await safeFetch('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (!profileRes || !profileRes.ok) return [];
      const profile = await profileRes.json();
      if (profile?.troop_id) {
        const res = await safeFetch(`http://localhost:5000/api/leader/scouts?troop_id=${profile.troop_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setAvailableScouts(data);
            return data;
          }
        }
      }
    } catch (err) {
      console.warn("Error fetching unassigned scouts:", err);
    }
    return [];
  };

  useEffect(() => {
    fetchPatrols();
    if (typeof window !== 'undefined' && window.location.search.includes('add=true')) {
      openCreateModal();
    }
  }, []);

  const openCreateModal = async () => {
    await fetchUnassignedScouts();
    setPatrolName('');
    setPatrolLeaderId('');
    setSelectedScouts([]);
    setResult(null);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      const profileRes = await fetch('http://localhost:5000/api/users/profile', { headers: { Authorization: `Bearer ${token}` } });
      if (!profileRes.ok) return;
      const profile = await profileRes.json();

      if (!profile?.troop_id) return;

      const res = await fetch('http://localhost:5000/api/leader/patrols', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          name: patrolName, 
          troop_id: profile.troop_id,
          patrol_leader_id: patrolLeaderId,
          scout_ids: selectedScouts 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        fetchPatrols();
        setTimeout(() => setShowCreateModal(false), 1500);
      } else {
        const errData = await res.json().catch(() => ({ message: 'Failed to create patrol' }));
        setResult(errData);
      }
    } catch (err) {
      console.error("Error creating patrol:", err);
      setResult({ message: 'Network error creating patrol' });
    }
  };

  const openEditModal = async (patrolId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      setEditResult(null);
      
      const res = await fetch(`http://localhost:5000/api/leader/patrols/${patrolId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setEditPatrolId(patrolId);
        setEditPatrolName(data.patrol.name);
        setEditPatrolLeaderId(data.patrol.patrol_leader_id?.toString() || '');
        
        const currentMemberIds = data.members.map((m: any) => m.id.toString());
        setEditSelectedScouts(currentMemberIds);

        const unassigned = await fetchUnassignedScouts();
        setEditAvailableScouts([...data.members, ...unassigned]);
        
        setShowEditModal(true);
      }
    } catch (err) {
      console.error("Error opening edit modal:", err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPatrolId) return;

    try {
      const token = sessionStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/leader/patrols/${editPatrolId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          name: editPatrolName, 
          patrol_leader_id: editPatrolLeaderId,
          scout_ids: editSelectedScouts 
        })
      });
      if (res.ok) {
        const data = await res.json();
        setEditResult(data);
        fetchPatrols();
        setTimeout(() => setShowEditModal(false), 1500);
      } else {
        const errData = await res.json().catch(() => ({ message: 'Failed to update patrol' }));
        setEditResult(errData);
      }
    } catch (err) {
      console.error("Error updating patrol:", err);
      setEditResult({ message: 'Network error updating patrol' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8 px-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Patrol Management</h1>
        <Button onClick={openCreateModal}>Create New Patrol</Button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading patrols...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patrols.map(patrol => (
            <Card key={patrol.id} className="flex flex-col">
              <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                <CardTitle className="text-xl">{patrol.name}</CardTitle>
                <p className="text-sm text-slate-500 font-mono">ID: {patrol.patrol_id}</p>
              </CardHeader>
              <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Patrol Leader:</span>
                    <span className="font-medium">
                      {patrol.pl_first_name ? `${patrol.pl_first_name} ${patrol.pl_last_name}` : 'Not assigned'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Members:</span>
                    <span className="font-medium bg-blue-50 text-blue-700 px-2 rounded-full">{patrol.member_count}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openEditModal(patrol.id)}>
                  Edit Patrol
                </Button>
              </CardContent>
            </Card>
          ))}
          {patrols.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              No patrols have been created yet.
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Register New Patrol</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-black">&times;</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleCreateSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Patrol Name</label>
                  <input required value={patrolName} onChange={e => setPatrolName(e.target.value)} className="mt-1 w-full border rounded-lg p-2 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Patrol Leader</label>
                  <select required value={patrolLeaderId} onChange={e => setPatrolLeaderId(e.target.value)} className="w-full border rounded-lg p-2 text-gray-900 bg-white">
                    <option value="">-- Select PL --</option>
                    {availableScouts.map(s => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.scout_reg_no})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Patrol Members (including PL)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-4 rounded-lg bg-slate-50">
                    {availableScouts.map(s => (
                      <label key={s.id} className="flex items-center gap-2 bg-white p-2 border rounded cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={selectedScouts.includes(s.id.toString())} onChange={() => {
                          const idStr = s.id.toString();
                          setSelectedScouts(prev => prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]);
                        }} />
                        <span className="text-sm">{s.first_name} {s.last_name}</span>
                      </label>
                    ))}
                    {availableScouts.length === 0 && <p className="text-sm text-gray-500 col-span-2">No unassigned scouts available.</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full">Create Patrol</Button>
                {result && (
                  <div className={`mt-4 p-4 border rounded-lg ${result.patrol_id ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    <p className="font-bold">{result.message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-bold">Edit Patrol</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-black">&times;</button>
            </div>
            <div className="p-6">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium">Patrol Name</label>
                  <input required value={editPatrolName} onChange={e => setEditPatrolName(e.target.value)} className="mt-1 w-full border rounded-lg p-2 text-gray-900 bg-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Patrol Leader</label>
                  <select required value={editPatrolLeaderId} onChange={e => setEditPatrolLeaderId(e.target.value)} className="w-full border rounded-lg p-2 text-gray-900 bg-white">
                    <option value="">-- Select PL --</option>
                    {editAvailableScouts.map(s => (
                      <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.scout_reg_no})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Patrol Members (including PL)</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-4 rounded-lg bg-slate-50">
                    {editAvailableScouts.map(s => (
                      <label key={s.id} className="flex items-center gap-2 bg-white p-2 border rounded cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" checked={editSelectedScouts.includes(s.id.toString())} onChange={() => {
                          const idStr = s.id.toString();
                          setEditSelectedScouts(prev => prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]);
                        }} />
                        <span className="text-sm">{s.first_name} {s.last_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full">Save Changes</Button>
                {editResult && (
                  <div className={`mt-4 p-4 border rounded-lg ${editResult.message === 'Patrol updated successfully' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                    <p className="font-bold">{editResult.message}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
