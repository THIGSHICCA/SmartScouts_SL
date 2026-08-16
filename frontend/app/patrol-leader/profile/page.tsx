'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users, MapPin, Hash, Building2, Calendar, Phone, Mail,
  Shield, Edit3, Save, X, Flag
} from 'lucide-react';

interface PatrolLeaderProfile {
  // Personal
  leaderName: string;
  leaderScoutId: string;
  leaderEmail: string;
  leaderPhone: string;
  // Patrol
  patrolName: string;
  patrolNumber: string;
  totalScoutsInPatrol: number;
  // Troop
  troopName: string;
  troopNumber: string;
  // District
  districtName: string;
  districtRegNumber: string;
  province: string;
  divisionName: string;
}

const INITIAL_PROFILE: PatrolLeaderProfile = {
  leaderName: 'Mr. Kasun Perera',
  leaderScoutId: 'PL-COL-2015-007',
  leaderEmail: 'kasun.perera@scouts.lk',
  leaderPhone: '+94 71 987 6543',
  patrolName: 'Eagle Patrol',
  patrolNumber: 'PAT-COL-001',
  totalScoutsInPatrol: 6,
  troopName: '1st Colombo Scout Group',
  troopNumber: 'CSG-001',
  districtName: 'Colombo South',
  districtRegNumber: 'SLSA-COL-S-2001',
  province: 'Western Province',
  divisionName: 'Colombo City Division',
};

export default function PatrolLeaderProfilePage() {
  const [profile, setProfile] = useState<PatrolLeaderProfile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<PatrolLeaderProfile>(INITIAL_PROFILE);

  const startEdit = () => { setDraft(profile); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const saveEdit = () => { setProfile(draft); setEditing(false); };

  const field = (label: string, value: string | number, key: keyof PatrolLeaderProfile, icon: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
        {icon} {label}
      </label>
      {editing ? (
        <input
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          value={draft[key] as string}
          onChange={e => setDraft(prev => ({ ...prev, [key]: e.target.value }))}
        />
      ) : (
        <p className="text-sm font-semibold text-slate-800">{value}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-orange-50/70 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-8 space-y-8">

        {/* ── Hero card ── */}
        <Card className="overflow-hidden border-t-8 border-t-orange-500">
          <div className="p-8 md:p-10 bg-gradient-to-br from-orange-50/60 to-white flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-3xl bg-orange-100 flex items-center justify-center text-orange-700 font-black text-5xl flex-shrink-0 shadow-sm border-4 border-white">
              {profile.leaderName.charAt(0)}
            </div>

            {/* Identity */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1">Patrol Leader</p>
                  <h1 className="text-3xl font-black text-slate-900">{profile.leaderName}</h1>
                  <p className="text-slate-500 font-medium mt-1">{profile.patrolName} · {profile.troopName}</p>
                  <span className="inline-block mt-2 px-3 py-0.5 bg-orange-100 text-orange-700 text-xs font-black rounded-full uppercase tracking-widest">
                    ID: {profile.leaderScoutId}
                  </span>
                </div>

                <div className="flex gap-2 justify-center md:justify-end flex-shrink-0">
                  {editing ? (
                    <>
                      <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-1.5">
                        <X size={14} /> Cancel
                      </Button>
                      <Button size="sm" onClick={saveEdit} className="gap-1.5 bg-orange-500 hover:bg-orange-600">
                        <Save size={14} /> Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={startEdit} className="gap-1.5">
                      <Edit3 size={14} /> Edit Profile
                    </Button>
                  )}
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: 'Scouts in Patrol', value: profile.totalScoutsInPatrol, icon: <Users size={16} /> },
                  { label: 'Patrol', value: profile.patrolName.split(' ')[0], icon: <Flag size={16} /> },
                  { label: 'District', value: profile.districtName.split(' ')[0], icon: <MapPin size={16} /> },
                ].map(stat => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center shadow-sm">
                    <div className="text-orange-500 flex justify-center mb-1">{stat.icon}</div>
                    <p className="text-xl font-black text-slate-900">{stat.value}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Patrol Details ── */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center">
                <Flag size={16} className="text-orange-600" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Patrol Details</h2>
            </div>
            {field('Patrol Name', profile.patrolName, 'patrolName', <Flag size={12} />)}
            {field('Patrol Number', profile.patrolNumber, 'patrolNumber', <Hash size={12} />)}
            {field('Scouts in Patrol', profile.totalScoutsInPatrol, 'totalScoutsInPatrol', <Users size={12} />)}
          </Card>

          {/* ── Troop Details ── */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <Shield size={16} className="text-green-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Troop Details</h2>
            </div>
            {field('Troop Name', profile.troopName, 'troopName', <Building2 size={12} />)}
            {field('Troop Number', profile.troopNumber, 'troopNumber', <Hash size={12} />)}
          </Card>

          {/* ── District & Division ── */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <MapPin size={16} className="text-blue-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">District & Division</h2>
            </div>
            {field('District Name', profile.districtName, 'districtName', <MapPin size={12} />)}
            {field('District Reg. Number', profile.districtRegNumber, 'districtRegNumber', <Hash size={12} />)}
            {field('Province', profile.province, 'province', <MapPin size={12} />)}
            {field('Division Name', profile.divisionName, 'divisionName', <Building2 size={12} />)}
          </Card>

          {/* ── Contact ── */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users size={16} className="text-purple-700" />
              </div>
              <h2 className="font-black text-slate-900 uppercase tracking-widest text-xs">Contact Information</h2>
            </div>
            {field('Full Name', profile.leaderName, 'leaderName', <Users size={12} />)}
            {field('Email', profile.leaderEmail, 'leaderEmail', <Mail size={12} />)}
            {field('Phone', profile.leaderPhone, 'leaderPhone', <Phone size={12} />)}
          </Card>

        </div>
      </div>
    </div>
  );
}
