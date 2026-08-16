'use client';

import { Sidebar } from '@/components/Sidebar';
import { FloatingAI } from '@/components/FloatingAI';
import { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api';

export default function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [troopId, setTroopId] = useState<number | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [role, setRole] = useState<'scout' | 'patrol-leader'>('scout');

  useEffect(() => {
    // Read token directly from sessionStorage — AuthContext token state
    // is null on the very first render, causing a false "no troop" state.
    const token = sessionStorage.getItem('token');
    const userStr = sessionStorage.getItem('user');
    
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'patrol_leader' || u.role === 'patrol-leader') {
          setRole('patrol-leader');
        }
      } catch (e) {}
    }

    if (!token) {
      setAuthReady(true);
      return;
    }
    fetch(`${API}/users/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setTroopId(data.troop_id ?? null);
      })
      .catch(() => {})
      .finally(() => setAuthReady(true));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role={role} troopId={troopId} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      {troopId && <FloatingAI />}
    </div>
  );
}
