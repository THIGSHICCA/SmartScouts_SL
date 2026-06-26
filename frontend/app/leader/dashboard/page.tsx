'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Search, Filter } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import Link from 'next/link';

export default function LeaderDashboard() {
  const { pendingBadges, approveBadge, scouts } = useAppContext();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leader Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your scouts and review their progress.</p>
      </div>

      {/* Badge Approval Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Pending Badge Approvals</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">{pendingBadges.length} Pending</span>
        </div>
        
        {pendingBadges.length === 0 ? (
          <Card className="p-8 text-center bg-gray-50 border-dashed border-2">
            <p className="text-gray-500">No badge award requests pending.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingBadges.map((request) => (
              <Card key={request.id} className="p-5 border-l-4 border-l-green-400 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{request.scoutName}</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">{request.badgeName}</p>
                    <p className="text-xs text-gray-400 mt-2">All tasks verified and approved by Patrol Leader</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium">
                      Reject
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8 px-4 bg-green-600 hover:bg-green-700 gap-1"
                      onClick={() => approveBadge(request.id)}
                    >
                      <Check size={16} /> Award Badge
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Scout Overview Table */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-bold text-gray-900">Scouts Overview</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search scouts..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <Button variant="outline" size="sm" className="px-3">
              <Filter size={16} className="text-gray-500" />
            </Button>
          </div>
        </div>

        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Scout Name</th>
                <th className="px-6 py-4 font-semibold">Current Level</th>
                <th className="px-6 py-4 font-semibold">Progress</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scouts.map((scout) => (
                <tr key={scout.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                        {scout.name.charAt(0)}
                      </div>
                      {scout.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{scout.badge}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-600 h-1.5 rounded-full" style={{ width: `${scout.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-medium">{scout.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap
                      ${scout.progress === 100 ? 'bg-green-100 text-green-700' : 
                        scout.progress > 0 ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'}
                    `}>
                      {scout.progress === 100 ? 'Ready for Award' : 'In Progress'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/scout/profile?id=${scout.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </div>
  );
}
