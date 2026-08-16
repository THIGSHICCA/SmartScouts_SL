'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { safeFetch } from '@/utils/safeFetch';

const API = 'http://localhost:5000/api';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    commissioner_reg_no: '',
    scout_district: '',
    scout_district_reg_no: '',
  });
  const [loading, setLoading] = useState(true);
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
        const res = await safeFetch(`${API}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res && (res.status === 401 || res.status === 404)) {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          window.location.href = '/login';
          return;
        }
        if (res && res.ok) {
          const data = await res.json();
          setProfile({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            commissioner_reg_no: data.commissioner_reg_no || '',
            scout_district: data.scout_district || '',
            scout_district_reg_no: data.scout_district_reg_no || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const token = sessionStorage.getItem('token');
    try {
      const res = await safeFetch(`${API}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      if (res && res.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      } else {
        const data = res ? await res.json() : null;
        setMessage({ text: data?.message || 'Failed to update profile.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'An error occurred while saving.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-500 font-bold">Loading Profile...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Commissioner Profile</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your administrative account details</p>
      </div>

      <Card className="p-8 border-none shadow-md bg-white rounded-3xl">
        {message && (
          <div className={`p-4 mb-6 rounded-xl text-sm font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">First Name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name}
                onChange={handleChange}
                required
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Email Address</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-100 text-slate-500 font-semibold cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-2 font-medium">Email address cannot be changed currently.</p>
          </div>

          <div>
            <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">Commissioner Reg No.</label>
            <input
              type="text"
              name="commissioner_reg_no"
              value={profile.commissioner_reg_no}
              onChange={handleChange}
              placeholder="e.g. DC-001"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-mono text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">District Name</label>
              <input
                type="text"
                name="scout_district"
                value={profile.scout_district}
                onChange={handleChange}
                placeholder="e.g. Batticaloa"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">District Number</label>
              <input
                type="text"
                name="scout_district_reg_no"
                value={profile.scout_district_reg_no}
                onChange={handleChange}
                placeholder="e.g. DIS-005"
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:shadow-blue-500/25 transition-all text-sm uppercase tracking-widest disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
