import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function LeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role="leader" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-3 md:p-6 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
