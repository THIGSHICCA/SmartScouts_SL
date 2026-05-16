'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, Circle, Lock, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { RequirementStatus } from '@/data/badges';

export default function BadgeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const badgeId = params.id as string;
  
  const { badges, toggleRequirement, toggleSubTask, submitBadge } = useAppContext();
  const badge = badges.find(b => b.id === badgeId);

  if (!badge) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-2xl font-bold text-gray-900">Badge not found</h2>
        <Button onClick={() => router.push('/scout/badges')} className="mt-4">
          Return to Badges
        </Button>
      </div>
    );
  }

  const isPendingLeader = badge.status === 'pending_leader';
  const isCompleted = badge.status === 'completed';

  const getStatusIcon = (status: RequirementStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={24} className="text-green-500" />;
      case 'pending_pl':
        return <Clock size={24} className="text-orange-500" />;
      case 'incomplete':
      default:
        return <Circle size={24} className="text-gray-300 group-hover:text-orange-400 transition-colors" />;
    }
  };

  const getStatusText = (status: RequirementStatus, date?: string) => {
    switch (status) {
      case 'completed':
        return `Approved by PL ${date ? `on ${date}` : ''}`;
      case 'pending_pl':
        return `Pending PL Approval ${date ? `(Submitted ${date})` : ''}`;
      case 'incomplete':
      default:
        return 'Tap to mark as done';
    }
  };

  const colorStyles = {
    green: 'bg-green-500 text-green-500 border-green-200',
    blue: 'bg-blue-500 text-blue-500 border-blue-200',
    yellow: 'bg-yellow-500 text-yellow-500 border-yellow-200',
    purple: 'bg-purple-500 text-purple-500 border-purple-200',
    orange: 'bg-orange-500 text-orange-500 border-orange-200',
  };

  const bgStyle = colorStyles[badge.color].split(' ')[0].replace('bg-', 'bg-').replace('500', '50/50');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <button 
        onClick={() => router.push('/scout/badges')}
        className="flex items-center gap-2 text-slate-900 hover:text-primary transition-colors font-black mb-4"
      >
        <ArrowLeft size={20} />
        Back to Official Progression
      </button>

      <Card className={`overflow-hidden border-t-8 ${colorStyles[badge.color].split(' ')[2]}`}>
        <div className={`p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center md:items-start ${bgStyle}`}>
          <div className="w-32 h-32 bg-white rounded-3xl shadow-sm flex items-center justify-center text-7xl flex-shrink-0">
            {badge.icon}
          </div>
          
          <div className="flex-1 w-full text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-black text-gray-900">{badge.title}</h1>
                <p className="text-slate-900 font-bold mt-1">
                  {badge.isLocked ? "Complete previous awards to unlock these requirements." : "Complete all requirements to earn this award."}
                </p>
              </div>
              <div className="text-4xl font-black text-gray-900">
                {badge.progress}%
              </div>
            </div>
            
            <div className="w-full bg-white/60 rounded-full h-3 mt-6 shadow-inner">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${colorStyles[badge.color].split(' ')[0]}`} 
                style={{ width: `${badge.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </Card>

      {badge.isLocked ? (
        <Card className="p-12 flex flex-col items-center justify-center text-center bg-white border-dashed border-2">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Lock size={40} className="text-slate-900" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Requirements Locked</h2>
          <p className="text-slate-900 font-bold max-w-md">
            You must complete the previous progression awards before you can begin tracking requirements for the {badge.title}.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {badge.categories.map((category, catIdx) => (
            <Card key={catIdx} className="overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h3 className="font-black text-gray-900 text-lg uppercase tracking-widest">{category.title}</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {category.requirements.map((req) => (
                  <li 
                    key={req.id} 
                    className={`p-6 flex flex-col gap-4 transition-colors ${req.status === 'completed' || isPendingLeader || isCompleted ? 'bg-emerald-50/10' : 'hover:bg-slate-50/50 group'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className="mt-0.5 flex-shrink-0 cursor-pointer"
                        onClick={() => toggleRequirement(badgeId, catIdx, req.id, req.status)}
                      >
                        {getStatusIcon(req.status)}
                      </div>
                      <div className="flex-1">
                        <p 
                          className={`text-base cursor-pointer ${req.status === 'completed' || isCompleted || isPendingLeader ? 'text-slate-400 line-through' : 'text-slate-900 font-black'}`}
                          onClick={() => toggleRequirement(badgeId, catIdx, req.id, req.status)}
                        >
                          {req.text}
                        </p>
                        
                        {req.subTasks && req.subTasks.length > 0 && (
                          <ul className="mt-4 space-y-3 ml-1">
                            {req.subTasks.map(sub => (
                              <li 
                                key={sub.id} 
                                className={`flex items-center justify-between gap-3 text-sm py-2 px-4 rounded-xl border-2 transition-all ${
                                  sub.status === 'completed' 
                                    ? 'bg-emerald-50 text-emerald-900 border-emerald-100' 
                                    : 'bg-white text-slate-900 border-slate-100 hover:border-primary/20 hover:bg-slate-50/30 cursor-pointer font-bold'
                                } shadow-sm`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubTask(badgeId, catIdx, req.id, sub.id);
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  {sub.status === 'completed' ? (
                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-400"></div>
                                  )}
                                  <span className={sub.status === 'completed' ? 'line-through opacity-50' : ''}>
                                    {sub.text}
                                  </span>
                                </div>
                                {sub.completedDate && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                                    {sub.completedDate}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}

                        <p className={`text-xs font-black uppercase tracking-widest mt-3 ${req.status === 'pending_pl' ? 'text-orange-600' : req.status === 'completed' ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {getStatusText(req.status, req.completedDate)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}

          <div className="flex justify-end pt-4">
            <Button 
              size="lg"
              variant={(badge.progress === 100 && !isPendingLeader && !isCompleted) ? 'primary' : 'outline'} 
              className={(badge.progress === 100 && !isPendingLeader && !isCompleted) ? 'bg-yellow-500 hover:bg-yellow-600 text-slate-900' : ''}
              disabled={badge.progress !== 100 || isPendingLeader || isCompleted}
              onClick={() => submitBadge(badgeId)}
            >
              {isCompleted ? 'Awarded' : isPendingLeader ? 'Pending Leader Approval' : badge.progress === 100 ? 'Submit for Leader Approval' : 'Complete All Requirements to Submit'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
