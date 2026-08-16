'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';

const API = 'http://localhost:5000/api';

export default function PatrolLeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [troopId, setTroopId] = useState<number | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setTroopId(data.troop_id ?? null);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role="patrol-leader" troopId={troopId} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
