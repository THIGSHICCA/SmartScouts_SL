'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { proficiencyBadgesData } from '@/data/badges';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, MessageSquare, FileText, ShieldCheck, HelpCircle, CheckCircle2, Upload } from 'lucide-react';
import Link from 'next/link';

export default function ProficiencyBadgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const badge = proficiencyBadgesData.find(b => b.id === params.id);

  if (!badge) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
        <h2 className="text-2xl font-bold mb-4 text-slate-900">Badge not found</h2>
        <Button onClick={() => router.push('/scout/proficiency')}>Back to Badges</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <Link href="/scout/proficiency" className="inline-flex items-center text-sm font-bold text-slate-400 hover:text-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          BACK TO ALL BADGES
        </Link>

        {/* Hero Card */}
        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2rem]">
          <div className="h-3 bg-gradient-to-r from-primary to-blue-600 w-full" />
          <CardHeader className="flex flex-col md:flex-row items-center gap-8 p-10">
            <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 shadow-inner flex items-center justify-center text-6xl">
              {badge.icon}
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                <Badge className="font-black text-primary bg-primary/10 border-none px-3 py-1 text-sm tracking-widest">
                  {badge.code}
                </Badge>
                <Badge className={`uppercase font-bold ${badge.level === 'junior' ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {badge.level} LEVEL
                </Badge>
              </div>
              <CardTitle className="text-4xl font-black text-slate-900 tracking-tight">{badge.title}</CardTitle>
              <CardDescription className="text-xl font-bold text-slate-600 uppercase tracking-wide">
                {badge.group}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-slate-900">About this Badge</h3>
              <div className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm leading-relaxed text-slate-600 font-medium text-lg">
                <p>
                  {badge.description} The 2022 curriculum for this skill involves several practical tasks and theoretical knowledge. 
                </p>
                <p className="mt-4 text-primary font-black uppercase text-sm tracking-widest">
                  💡 Tip: Ask the Scout AI Assistant on the right for the full list of sub-tasks!
                </p>
              </div>
            </div>

            {/* Submission Portal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                  Submission Portal
                </h3>
              </div>
              
              <Card className="border-4 border-dashed border-slate-100 bg-white hover:border-primary/20 transition-all group rounded-[2rem]">
                <CardContent className="p-16 text-center space-y-6">
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-inner">
                    <Upload className="w-10 h-10 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-2xl text-slate-900">Upload Examiner Form</p>
                    <p className="text-slate-900 font-bold max-w-md mx-auto leading-relaxed">
                      Upload the official proficiency badge form signed and franked by your badge examiner.
                    </p>
                  </div>
                  <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-slate-200 text-slate-900 font-black gap-3 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <FileText className="w-5 h-5" />
                    SELECT OFFICIAL FORM
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Side Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white rounded-3xl overflow-hidden">
              <CardHeader className="bg-slate-50 border-b border-slate-100 p-6">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Badge Status</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-slate-900">Progress</span>
                    <span className="text-3xl font-black text-slate-900">0%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-0" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 font-bold leading-relaxed">
                    Official investigation is required by a Troop-authorized examiner.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900">About</p>
                  <p className="text-sm text-slate-900 font-black leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <Button className="w-full h-14 bg-slate-900 hover:bg-black text-white font-black rounded-2xl shadow-xl shadow-slate-200 transition-all uppercase tracking-widest">
                  Submit to Leader
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white rounded-3xl p-6">
              <div className="flex items-center gap-4 text-slate-400">
                <FileText className="w-10 h-10 opacity-20" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Syllabus Year</p>
                  <p className="font-bold text-slate-900">2022 Revision</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
