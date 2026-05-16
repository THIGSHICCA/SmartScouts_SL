'use client';

import React, { useRef, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Camera, User, Shield, MapPin, Mail, Calendar, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ScoutIdentityCardProps {
  scout: {
    name: string;
    role?: string;
    troop?: string;
    batch?: string;
    scoutId?: string;
    joinDate?: string;
    district?: string;
    email?: string;
    image?: string;
  };
}

export function ScoutIdentityCard({ scout }: ScoutIdentityCardProps) {
  const [profileImage, setProfileImage] = useState<string | null>(scout.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group mb-20">
      {/* Background Gradient Header */}
      <div className="h-64 w-full bg-gradient-to-br from-indigo-600 via-emerald-600 to-teal-500 rounded-[3rem] shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10 opacity-40 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute top-0 right-0 p-10 opacity-20 rotate-12 transform scale-150">
          <Shield size={160} className="text-white" />
        </div>
      </div>

      {/* Identity Content */}
      <div className="absolute -bottom-12 left-0 w-full px-8 flex flex-col md:flex-row items-center md:items-end gap-8">
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-44 h-44 rounded-[3.5rem] bg-white p-2 shadow-2xl relative overflow-hidden border-8 border-white group-hover:scale-[1.02] transition-transform duration-500">
            {profileImage ? (
              <img src={profileImage} alt={scout.name} className="w-full h-full object-cover rounded-[2.8rem]" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-[2.8rem]">
                <User size={80} className="text-slate-200" />
              </div>
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white z-10"
          >
            <Camera size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>

        {/* Basic Info */}
        <div className="flex-1 text-center md:text-left mb-4 md:mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-2 md:gap-4">
            <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-xl tracking-tight">
              {scout.name}
            </h1>
            <span className="px-4 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black uppercase tracking-widest rounded-full mb-1">
              {scout.role || 'Senior Scout'}
            </span>
          </div>
          <p className="text-white/90 font-bold text-lg mt-2 flex items-center justify-center md:justify-start gap-2">
            <Shield size={18} className="text-emerald-300" />
            {scout.troop || '1st Colombo Scout Group'} • {scout.batch || 'Batch of 2022'}
          </p>
        </div>

        <div className="mb-10 flex gap-3">
          <Button variant="secondary" className="shadow-2xl rounded-2xl font-black uppercase tracking-widest px-8 py-6 h-auto bg-white text-slate-900 hover:bg-slate-50 border-none transition-all hover:-translate-y-1">
             Edit Profile
          </Button>
        </div>
      </div>

      {/* Quick Details Bar */}
      <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
        {[
          { icon: Hash, label: 'Scout ID', value: scout.scoutId || 'SL-2022-045' },
          { icon: Calendar, label: 'Join Date', value: scout.joinDate || 'March 2022' },
          { icon: MapPin, label: 'District', value: scout.district || 'Colombo South' },
          { icon: Mail, label: 'Email', value: scout.email || 'alex.scout@gmail.com' },
        ].map((item, i) => (
          <Card key={i} className="p-5 border-none shadow-lg shadow-slate-200/50 bg-white/80 backdrop-blur-sm rounded-[2rem] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-emerald-600" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">{item.label}</p>
                <p className="font-bold text-slate-800 truncate">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
