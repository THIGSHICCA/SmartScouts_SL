'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { proficiencyBadgesData } from '@/data/badges';
import { ArrowLeft, Search, GraduationCap, UserCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function ProficiencyBadgesPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const juniorBadges = proficiencyBadgesData.filter(badge => 
    badge.level === 'junior' && 
    (badge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     badge.group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const seniorBadges = proficiencyBadgesData.filter(badge => 
    badge.level === 'senior' && 
    (badge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     badge.group.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const BadgeGrid = ({ badges, title, icon: Icon, colorClass, desc }: { badges: any[], title: string, icon: any, colorClass: string, desc: string }) => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${colorClass} flex items-center justify-center text-white shadow-lg shadow-current/20`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="text-slate-500 text-sm font-medium">{desc}</p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit h-fit px-4 py-1.5 rounded-lg bg-slate-50 text-slate-700 border-slate-200 font-black">
          {badges.length} Badges
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Link key={badge.id} href={`/scout/proficiency/${badge.id}`}>
            <Card className="group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 bg-white overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 border border-slate-100 shadow-inner">
                    {badge.icon}
                  </div>
                  <Badge className={`uppercase text-[10px] font-black tracking-wider shadow-sm border-none ${badge.level === 'junior' ? 'bg-emerald-600 text-white' : 'bg-blue-700 text-white'}`}>
                    {badge.level}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">
                  {badge.title}
                </CardTitle>
                <CardDescription className="font-black text-slate-500 text-[10px] uppercase tracking-[0.1em] mt-1">
                  {badge.group}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed flex-1">
                  {badge.description}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                    ID: {badge.code}
                  </span>
                  <span className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1">
                    DETAILS
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <Link href="/scout/dashboard" className="inline-flex items-center text-sm font-black text-slate-400 hover:text-primary transition-colors group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              BACK TO DASHBOARD
            </Link>
            <div className="space-y-2">
              <h1 className="text-5xl font-black tracking-tight text-slate-900">
                Proficiency <span className="text-primary">Badges</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-xl font-bold">
                Master specialized skills from the official 2022 Scout curriculum. 
              </p>
            </div>
          </div>
          
          <div className="relative w-full md:w-96 group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search badges..." 
                className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm text-slate-900 placeholder:text-slate-400 focus:ring-primary focus:border-primary transition-all text-lg font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-24">
          {juniorBadges.length > 0 && (
            <BadgeGrid 
              badges={juniorBadges} 
              title="Junior Scout" 
              desc="Requirements for scouts under 15 years."
              icon={UserCircle} 
              colorClass="bg-emerald-500" 
            />
          )}

          {seniorBadges.length > 0 && (
            <BadgeGrid 
              badges={seniorBadges} 
              title="Senior Scout" 
              desc="Advanced requirements for scouts 15-18 years."
              icon={GraduationCap} 
              colorClass="bg-blue-600" 
            />
          )}
        </div>

        {/* Empty State */}
        {juniorBadges.length === 0 && seniorBadges.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary/10" />
            <div className="bg-slate-50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner text-slate-300">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No matches found</h3>
            <p className="text-slate-500 font-bold mt-2">
              We couldn't find any badges matching "{searchTerm}"
            </p>
            <Button 
              variant="primary" 
              className="mt-8 px-8 py-6 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-primary/20"
              onClick={() => setSearchTerm('')}
            >
              Reset Search
            </Button>
          </div>
        )}

        {/* Footer Info */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Official 2022 Sri Lanka Scout Syllabus
          </p>
        </div>
      </div>
    </div>
  );
}
