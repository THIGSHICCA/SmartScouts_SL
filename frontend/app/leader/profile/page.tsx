'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { safeFetch } from '@/utils/safeFetch';
import {
  Users, MapPin, Hash, Building2, Shield, Edit3, Save, X, Award, Mail, Loader2
} from 'lucide-react';

const API = 'http://localhost:5000/api';

export default function TroopLeaderProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await safeFetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (res && (res.status === 401 || res.status === 404)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        if (res && res.ok) {
          const data = await res.json();
          setProfile(data);
          setDraft(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const token = sessionStorage.getItem('token');
    try {
      const res = await safeFetch(`${API}/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(draft),
      });
      if (res && res.ok) {
        setProfile(draft);
        setEditing(false);
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        const data = res ? await res.json() : null;
        setMessage({ text: data?.message || 'Update failed.', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Network error.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, placeholder, mono = false }: { label: string; field: string; placeholder?: string; mono?: boolean }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
      {editing ? (
        <input
          className={`px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 bg-slate-50 transition-all ${mono ? 'font-mono' : 'font-semibold'}`}
          value={draft[field] || ''}
          placeholder={placeholder || ''}
          onChange={e => setDraft((p: any) => ({ ...p, [field]: e.target.value }))}
        />
      ) : (
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono' : 'font-semibold'} ${!profile?.[field] ? 'text-slate-400 italic' : ''}`}>
          {profile?.[field] || 'Not set'}
        </p>
      )}
    </div>
  );

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-slate-400" size={32} /></div>;
  }

  const initials = `${profile?.first_name?.[0] || ''}${profile?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-green-50/70 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8">

        {message && (
          <div className={`p-4 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* Hero Card */}
        <Card className="overflow-hidden border-t-8 border-t-green-500">
          <div className="p-8 md:p-10 bg-gradient-to-br from-green-50/60 to-white flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-3xl bg-green-100 flex items-center justify-center text-green-700 font-black text-5xl flex-shrink-0 shadow-sm border-4 border-white">
              {initials || '?'}
            </div>

            {/* Identity */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1">Scout Leader</p>
                  <h1 className="text-3xl font-black text-slate-900">{profile?.first_name} {profile?.last_name}</h1>
                  <p className="text-slate-500 font-medium mt-1">{profile?.email}</p>
                  {profile?.scout_reg_no && (
                    <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-black rounded-full uppercase tracking-widest font-mono">
                      🎖️ {profile.scout_reg_no}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 justify-center md:justify-end flex-shrink-0">
                  {editing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={() => { setEditing(false); setDraft(profile); }} className="gap-1.5">
                        <X size={14} /> Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5 bg-green-600 hover:bg-green-700 text-white">
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                      <Edit3 size={14} /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <Users size={16} className="text-green-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Personal Information</h2>
            </div>
            <Field label="First Name" field="first_name" placeholder="First Name" />
            <Field label="Last Name" field="last_name" placeholder="Last Name" />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Mail size={10} /> Email
              </label>
              <p className="text-sm font-semibold text-slate-500 italic">{profile?.email} (cannot be changed)</p>
            </div>
          </Card>

          {/* Scout Leader Registration */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <Award size={16} className="text-purple-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Scout Leader Details</h2>
            </div>
            <Field
              label="Scout Registration No."
              field="scout_reg_no"
              placeholder="e.g. SL/BT/001"
              mono
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                Leader Registration ID
              </label>
              <p className="text-sm font-semibold text-slate-800 font-mono">
                {profile?.leader_registration_id || <span className="text-slate-400 italic font-sans">Not set</span>}
              </p>
            </div>
            <Field
              label="District"
              field="scout_district"
              placeholder="e.g. Batticaloa"
            />
            <Field
              label="District Reg. Number"
              field="scout_district_reg_no"
              placeholder="e.g. DIS-BT-001"
              mono
            />
          </Card>

          {/* Troop Information */}
          <Card className="p-6 space-y-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <Building2 size={16} className="text-blue-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Troop Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Building2 size={10} /> Assigned Troop</label>
                <p className="text-sm font-semibold text-slate-800">{profile?.troop_name ? profile.troop_name : (profile?.troop_id ? `Troop #${profile.troop_id}` : <span className="text-amber-600">Not yet assigned to a troop</span>)}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><Shield size={10} /> Role</label>
                <span className="inline-flex w-fit px-3 py-1 bg-green-100 text-green-700 text-xs font-black rounded-full uppercase tracking-widest">Scout Leader</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><MapPin size={10} /> District</label>
                <p className="text-sm font-semibold text-slate-800">{profile?.scout_district || <span className="text-slate-400 italic">Not set</span>}</p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}
