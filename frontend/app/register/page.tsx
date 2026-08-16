'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    scout_reg_no: '',
    scout_district: '',
    scout_district_reg_no: '',
    commissioner_reg_no: '',
    leader_id_ref: '',
    email: '',
    password: '',
    role: 'scout'
  });

  const { register, error, isLoading } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 rounded-full bg-white/3" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-yellow-300/5" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-4">
          <img src="/images/logo.png" alt="Smart Scouts SL" className="w-16 h-16 object-contain drop-shadow-2xl mb-2" />
          <h1 className="text-xl font-black text-white">Create Account</h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Join the Smart Scouts SL community</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white rounded-2xl shadow-2xl border-0 px-6 py-5">
          {error && (
            <div className="mb-3 p-2.5 bg-red-100 border border-red-400 text-red-700 rounded-xl text-xs">
              {error}
            </div>
          )}

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">First Name</label>
                <input name="first_name" type="text" required value={formData.first_name} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Last Name</label>
                <input name="last_name" type="text" required value={formData.last_name} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Date of Birth</label>
                <input name="dob" type="date" required value={formData.dob} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Scout Reg. No.</label>
                <input name="scout_reg_no" type="text" value={formData.scout_reg_no} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Scout District</label>
                <input name="scout_district" type="text" value={formData.scout_district} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">District Reg. No.</label>
                <input name="scout_district_reg_no" type="text" value={formData.scout_district_reg_no} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">I am a...</label>
              <select name="role" value={formData.role} onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                <option value="scout">Scout</option>
                <option value="leader">Leader</option>
                <option value="commissioner">District Commissioner</option>
              </select>
            </div>

            {formData.role === 'commissioner' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Commissioner Reg. No.</label>
                <input name="commissioner_reg_no" type="text" required value={formData.commissioner_reg_no} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            )}

            {formData.role === 'leader' && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Scout Leader ID <span className="text-gray-400 normal-case font-normal">(from District Commissioner)</span></label>
                <input name="leader_id_ref" type="text" required value={formData.leader_id_ref} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Email</label>
                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Password</label>
                <input name="password" type="password" required value={formData.password} onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-xl text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-60"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-black text-slate-900 hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
