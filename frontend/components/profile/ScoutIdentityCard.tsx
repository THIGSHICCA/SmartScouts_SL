'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, User, Shield, MapPin, Mail, Calendar, Hash, CheckCircle2, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ScoutProfile {
  name: string;
  roles: string[];
  troop: string;
  batch: string;
  scoutId: string;
  joinDate: string;
  district: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  achievements: string[];
}

interface ScoutIdentityCardProps {
  scout: ScoutProfile;
  onSave: (updatedScout: ScoutProfile) => void;
  isOwnProfile?: boolean;
}

const PREDEFINED_ROLES = [
  'Senior Scout',
  'Patrol Leader',
  'Troop Leader',
  'Assistant Patrol Leader',
  'Scout Scribe',
  'Quartermaster',
];

export function ScoutIdentityCard({ scout, onSave, isOwnProfile = true }: ScoutIdentityCardProps) {
  const [profileImage, setProfileImage] = useState<string | null>(scout.avatar || null);
  const [coverImage, setCoverImage] = useState<string | null>(scout.coverImage || null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync state with props
  useEffect(() => {
    setProfileImage(scout.avatar || null);
    setCoverImage(scout.coverImage || null);
  }, [scout]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Modal Form State
  const [formData, setFormData] = useState<ScoutProfile>({ ...scout });
  const [customRole, setCustomRole] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  // Sync form data when modal opens
  const openModal = () => {
    setFormData({ ...scout });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        onSave({ ...scout, avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCoverImage(result);
        onSave({ ...scout, coverImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({
      ...formData,
      avatar: profileImage || undefined,
      coverImage: coverImage || undefined,
    });
    setIsModalOpen(false);
  };

  // Roles Handler
  const toggleRole = (role: string) => {
    if (formData.roles.includes(role)) {
      setFormData({
        ...formData,
        roles: formData.roles.filter(r => r !== role),
      });
    } else {
      setFormData({
        ...formData,
        roles: [...formData.roles, role],
      });
    }
  };

  const addCustomRole = () => {
    const trimmed = customRole.trim();
    if (trimmed && !formData.roles.includes(trimmed)) {
      setFormData({
        ...formData,
        roles: [...formData.roles, trimmed],
      });
      setCustomRole('');
    }
  };

  // Achievements Handler
  const addAchievement = () => {
    const trimmed = newAchievement.trim();
    if (trimmed && !formData.achievements.includes(trimmed)) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, trimmed],
      });
      setNewAchievement('');
    }
  };

  const removeAchievement = (ach: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter(a => a !== ach),
    });
  };

  return (
    <div className="mb-16">
      {/* Background Cover Photo - Click to upload */}
      <div 
        className={`h-48 sm:h-64 w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-emerald-950 rounded-[2.5rem] shadow-xl overflow-hidden relative group ${
          isOwnProfile ? 'cursor-pointer' : ''
        }`}
        onClick={() => isOwnProfile && coverInputRef.current?.click()}
      >
        {coverImage ? (
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <>
            {/* Animated ambient glow */}
            <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[200%] bg-indigo-500/20 blur-[120px] rounded-full group-hover:bg-indigo-500/30 transition-colors duration-1000" />
            <div className="absolute -bottom-[50%] -right-[10%] w-[60%] h-[150%] bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-1000" />
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          </>
        )}
        
        {/* Cover Upload Trigger Hover */}
        {isOwnProfile && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 text-white font-black uppercase tracking-widest text-xs z-10">
            <Camera size={20} />
            Change Cover Photo
          </div>
        )}

        {/* Shield Decoration (only if no cover image) */}
        {!coverImage && (
          <div className="absolute top-4 right-12 opacity-10 rotate-[15deg] transform scale-150 pointer-events-none transition-transform duration-700 group-hover:rotate-[20deg] group-hover:scale-[1.6]">
            <Shield size={200} className="text-white" />
          </div>
        )}
        
        <input 
          type="file" 
          ref={coverInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleCoverUpload} 
        />
      </div>

      {/* Identity Content - Document flow layout to prevent overlap */}
      <div className="px-6 sm:px-12 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
        
        {/* Avatar Section - Pulled up to overlap cover */}
        <div className="relative -mt-20 sm:-mt-24 z-10 shrink-0">
          <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-full bg-white p-1.5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group/avatar transition-transform duration-500 hover:-translate-y-2">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-slate-50 relative">
              {profileImage ? (
                <img src={profileImage} alt={scout.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <User size={60} className="text-slate-300 sm:w-20 sm:h-20" />
                </div>
              )}
              {/* Avatar hover cover */}
              {isOwnProfile && (
                <div 
                  className="absolute inset-0 bg-black/0 group-hover/avatar:bg-black/40 flex items-center justify-center transition-colors duration-300 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={24} className="text-white opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          </div>
          
          {isOwnProfile && (
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 p-3 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-400 active:scale-95 transition-all border-4 border-[#F8FAFC] z-20 group/btn"
            >
              <Camera size={18} className="group-hover/btn:scale-110 transition-transform sm:w-5 sm:h-5" />
            </button>
          )}
          
          {/* Online Indicator */}
          <div className="absolute top-4 right-2 sm:top-6 sm:right-4 w-4 h-4 sm:w-5 sm:h-5 bg-emerald-400 border-4 border-[#F8FAFC] rounded-full shadow-md z-20" />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleImageUpload} 
          />
        </div>

        {/* Basic Info - Below cover on light background */}
        <div className="flex-1 text-center md:text-left mt-2 md:mt-5 mb-4 z-10 flex flex-col md:flex-row items-center md:items-start gap-4 md:justify-between w-full">
          
          <div className="flex flex-col items-center md:items-start gap-2 sm:gap-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {scout.name}
              </h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-1 md:mt-0">
                {(scout.roles && scout.roles.length > 0 ? scout.roles : ['Senior Scout']).map((role, idx) => (
                  <span key={idx} className="px-3 py-1 bg-emerald-100/80 border border-emerald-200 text-emerald-700 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full flex items-center gap-1.5 shadow-sm">
                     <CheckCircle2 size={12} /> {role}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-slate-500 font-bold text-sm sm:text-base flex items-center gap-2">
              <Shield size={18} className="text-indigo-400" />
              <span>{scout.troop || '1st Colombo Scout Group'} <span className="opacity-50 mx-1">•</span> {scout.batch || 'Batch of 2022'}</span>
            </p>
          </div>

          {isOwnProfile && (
            <div className="mt-2 md:mt-0 shrink-0">
              <Button 
                variant="secondary" 
                onClick={openModal}
                className="shadow-lg rounded-xl font-black uppercase tracking-widest px-6 sm:px-8 py-3.5 sm:py-4 h-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all duration-300 hover:-translate-y-1"
              >
                 Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Details Bar - Floating cards */}
      <div className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
        {[
          { icon: Hash, label: 'Scout ID', value: scout.scoutId || 'SL-2022-045', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { icon: Calendar, label: 'Join Date', value: scout.joinDate || 'March 2022', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: MapPin, label: 'District', value: scout.district || 'Colombo South', color: 'text-rose-600', bg: 'bg-rose-50' },
          { icon: Mail, label: 'Email', value: scout.email || 'alex.scout@gmail.com', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((item, i) => (
          <div key={i} className="p-4 sm:p-5 bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[1.5rem] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 group cursor-default">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <item.icon size={20} className={item.color + ' sm:w-[22px] sm:h-[22px]'} />
              </div>
              <div className="overflow-hidden">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400 truncate mb-0.5">{item.label}</p>
                <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{item.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Profile Modal Backdrop */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-slate-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-2xl font-black text-slate-900">Edit Scout Profile</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-1">
              
              {/* Name Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Scout Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 font-semibold"
                  placeholder="Alex Johnson"
                />
              </div>

              {/* Roles Manager */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Scout Roles (Select or Add)</label>
                
                {/* Predefined Roles Toggles */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {PREDEFINED_ROLES.map((role) => {
                    const isSelected = formData.roles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          isSelected 
                            ? 'bg-emerald-500 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Role Input */}
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customRole} 
                    onChange={(e) => setCustomRole(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                    placeholder="Enter other custom role..."
                  />
                  <button 
                    type="button" 
                    onClick={addCustomRole}
                    className="px-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {/* Display Current Selected Roles */}
                {formData.roles.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    {formData.roles.map((role) => (
                      <span key={role} className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg shadow-sm">
                        {role}
                        <button 
                          type="button" 
                          onClick={() => toggleRole(role)}
                          className="text-slate-400 hover:text-rose-500 transition-colors ml-1"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Scout ID</label>
                  <input 
                    type="text" 
                    value={formData.scoutId} 
                    onChange={(e) => setFormData({ ...formData, scoutId: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Troop</label>
                  <input 
                    type="text" 
                    value={formData.troop} 
                    onChange={(e) => setFormData({ ...formData, troop: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Batch</label>
                  <input 
                    type="text" 
                    value={formData.batch} 
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Join Date</label>
                  <input 
                    type="text" 
                    value={formData.joinDate} 
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const yearMatch = newDate.match(/\b(19|20)\d{2}\b/);
                      const newBatch = yearMatch ? `Batch of ${yearMatch[0]}` : formData.batch;
                      setFormData({ 
                        ...formData, 
                        joinDate: newDate,
                        batch: newBatch
                      });
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                    placeholder="e.g. 2022-03-15 or March 2022"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">District</label>
                  <input 
                    type="text" 
                    value={formData.district} 
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Achievements Editor */}
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Extra Achievements</label>
                <div className="flex gap-2 mb-3">
                  <input 
                    type="text" 
                    value={newAchievement} 
                    onChange={(e) => setNewAchievement(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 focus:outline-none focus:border-indigo-500 text-sm font-semibold"
                    placeholder="Enter award name, cleanup project etc."
                  />
                  <button 
                    type="button" 
                    onClick={addAchievement}
                    className="px-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-1"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.achievements.map((ach) => (
                    <div key={ach} className="flex justify-between items-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="text-slate-700 text-sm font-semibold">{ach}</span>
                      <button 
                        type="button" 
                        onClick={() => removeAchievement(ach)}
                        className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 border-t border-slate-100 pt-4 flex justify-end gap-3 shrink-0">
              <Button 
                variant="secondary" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="px-8 py-3 rounded-xl font-black bg-indigo-600 text-white hover:bg-indigo-500 shadow-md hover:shadow-lg transition-all"
              >
                Save Changes
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
