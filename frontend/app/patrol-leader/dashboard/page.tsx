'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Check, X, Search, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface ScoutTask {
  id: number;
  scoutName: string;
  badgeName: string;
  taskText: string;
}

import { useAppContext } from '@/context/AppContext';

export default function PatrolLeaderDashboard() {
  const { scouts, pendingTasks, approveTask, addScout } = useAppContext();
  const [newScoutName, setNewScoutName] = React.useState('');
  const [selectedScout, setSelectedScout] = React.useState<typeof scouts[0] | null>(null);

  const handleAddScout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScoutName.trim()) return;
    
    addScout(newScoutName);
    setNewScoutName('');
  };

  const displayedTasks = selectedScout 
    ? pendingTasks.filter(t => t.scoutName === selectedScout.name)
    : pendingTasks;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Patrol Leader Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your patrol and approve scout tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Task Approvals or Scout Profile */}
        <div className="lg:col-span-2 space-y-6">
          
          {selectedScout ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => setSelectedScout(null)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                  ← Back to All Tasks
                </button>
              </div>

              {/* Scout Profile Card */}
              <Card className="p-8 border-t-8 border-t-green-500 bg-white">
                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-4xl shadow-sm flex-shrink-0">
                    {selectedScout.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedScout.name}</h2>
                      <Link href={`/scout/profile?id=${selectedScout.id}`}>
                        <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-800 p-1 h-auto font-black uppercase tracking-widest">
                          View Full Profile
                        </Button>
                      </Link>
                    </div>
                    <p className="text-gray-500 mb-4">{selectedScout.completedBadges} Awards Earned</p>
                    
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900 text-sm">Current Goal: {selectedScout.badge}</span>
                        <span className="font-bold text-green-600">{selectedScout.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full transition-all duration-500" style={{ width: `${selectedScout.progress}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <section>
                <div className="flex justify-between items-center mb-4 mt-8">
                  <h3 className="text-lg font-bold text-gray-900">Pending Tasks for {selectedScout.name}</h3>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                    {displayedTasks.length} Pending
                  </span>
                </div>
                
                {displayedTasks.length === 0 ? (
                  <Card className="p-8 text-center bg-gray-50 border-dashed border-2">
                    <p className="text-gray-500">{selectedScout.name} has no tasks pending approval.</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {displayedTasks.map((task) => (
                      <Card key={task.id} className="p-5 border-l-4 border-l-orange-400 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                {task.badgeName}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{task.taskText}</p>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                              <X size={18} />
                            </Button>
                            <Button size="sm" className="h-9 px-4 bg-green-600 hover:bg-green-700 gap-2" onClick={() => approveTask(task.id)}>
                              <Check size={18} />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>
          ) : (
            <section className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">All Pending Task Approvals</h2>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded-full">
                  {pendingTasks.length} Pending
                </span>
              </div>
              
              {pendingTasks.length === 0 ? (
                <Card className="p-8 text-center bg-gray-50 border-dashed border-2">
                  <p className="text-gray-500">No tasks pending approval at the moment.</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <Card key={task.id} className="p-5 border-l-4 border-l-orange-400 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{task.scoutName}</span>
                            <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              {task.badgeName}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 font-medium">{task.taskText}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300">
                            <X size={18} />
                          </Button>
                          <Button size="sm" className="h-9 px-4 bg-green-600 hover:bg-green-700 gap-2" onClick={() => approveTask(task.id)}>
                            <Check size={18} />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Column - Patrol Management */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="p-5 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">My Patrol</h2>
              <span className="text-sm text-gray-500 font-medium">{scouts.length} Scouts</span>
            </div>
            
            <div className="p-5 border-b border-gray-100 bg-white">
              <form onSubmit={handleAddScout} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Scout's full name"
                  value={newScoutName}
                  onChange={(e) => setNewScoutName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button type="submit" size="sm" className="px-3">
                  <UserPlus size={18} />
                </Button>
              </form>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {scouts.map(scout => (
                <div 
                  key={scout.id} 
                  className={`p-4 transition-colors cursor-pointer group ${selectedScout?.id === scout.id ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                  onClick={() => setSelectedScout(scout)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs flex-shrink-0">
                      {scout.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 truncate">{scout.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{scout.badge}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${scout.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-medium text-gray-500">{scout.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
