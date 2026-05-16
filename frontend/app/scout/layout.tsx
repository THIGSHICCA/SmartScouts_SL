import { Sidebar } from '@/components/Sidebar';
import { FloatingAI } from '@/components/FloatingAI';

export default function ScoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar role="scout" />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      <FloatingAI />
    </div>
  );
}
