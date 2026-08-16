'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Search, Loader2, Users, Shield, MapPin, UserPlus, CheckCircle2, Eye } from 'lucide-react';

const API = 'http://localhost:5000/api';
const tkn = () => sessionStorage.getItem('token');
const hdr = () => ({ Authorization: `Bearer ${tkn()}`, 'Content-Type': 'application/json' });

interface Scout {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  scout_reg_no: string;
  scout_district: string;
  created_at: string;
  troop_id: number | null;
  troop_name: string | null;
  troop_code: string | null;
}

export default function RegisteredScouts() {
  const [scouts, setScouts] = useState<Scout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/admin/scouts`, { headers: hdr() })
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data)) setScouts(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return scouts;
    const q = search.toLowerCase();
    return scouts.filter(s =>
      s.first_name?.toLowerCase().includes(q) ||
      s.last_name?.toLowerCase().includes(q) ||
      s.scout_reg_no?.toLowerCase().includes(q) ||
      s.scout_district?.toLowerCase().includes(q)
    );
  }, [scouts, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registered Scouts</h1>
          <p className="text-gray-500 mt-1">View all scouts registered in the system.</p>
        </div>
      </div>

      {/* Search & filter bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, reg number, or district..."
          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-sm"
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 flex flex-col items-center text-slate-400">
          <Users size={40} className="mb-3" />
          <p className="font-semibold text-lg">{scouts.length === 0 ? 'No scouts registered yet' : 'No results match your search'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(scout => (
            <Card key={scout.id} className="p-6 overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {scout.first_name?.[0]}{scout.last_name?.[0]}
                </div>
                {scout.troop_id ? (
                  <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Assigned
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    <UserPlus size={12} /> Unassigned
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900">{scout.first_name} {scout.last_name}</h3>
              <p className="text-sm text-slate-500 mb-4">{scout.email}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Shield size={14} className="text-slate-400" />
                  <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-xs">{scout.scout_reg_no || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin size={14} className="text-slate-400" />
                  <span>{scout.scout_district || 'N/A District'}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                {scout.troop_id ? (
                  <div>
                    <p className="text-xs text-slate-500 font-medium mb-1">Assigned Troop</p>
                    <p className="text-sm font-bold text-slate-800">{scout.troop_name}</p>
                    <p className="text-xs font-mono text-slate-500">{scout.troop_code}</p>
                  </div>
                ) : (
                  <div className="text-center py-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Needs Troop Assignment</p>
                  </div>
                )}
              </div>

              {/* View Profile button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  href={`/admin/scout-profile?id=${scout.id}`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  <Eye size={14} /> View Full Profile
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
