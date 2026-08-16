'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, MessageSquare, LogOut, Menu, X, User, Users, BookOpen } from 'lucide-react';

export function Sidebar({ role = 'scout', troopId }: { role?: 'scout' | 'leader' | 'patrol-leader' | 'admin', troopId?: number | null }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [troopName, setTroopName] = React.useState<string | null>(null);
  const [isPatrolLeader, setIsPatrolLeader] = React.useState(false);
  const [pendingCount, setPendingCount] = React.useState(0);

  const isPlRoute = pathname.startsWith('/patrol-leader');

  React.useEffect(() => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.role === 'patrol_leader' || u.role === 'patrol-leader') {
          setIsPatrolLeader(true);
        }
      } catch (e) {}
    }
  }, []);

  React.useEffect(() => {
    if (isPatrolLeader) {
      const token = sessionStorage.getItem('token');
      // Fetch pending tasks to show notification count
      fetch('http://localhost:5000/api/progress/pending-pl', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setPendingCount(data.length);
      })
      .catch(() => {});
    }
  }, [isPatrolLeader]);

  React.useEffect(() => {
    const token = sessionStorage.getItem('token');
    const targetRole = isPlRoute ? 'patrol-leader' : role;
    if (token && (targetRole === 'leader' || targetRole === 'patrol-leader' || targetRole === 'scout')) {
      fetch('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(r => r.ok ? r.json() : null)
      .then(profile => {
        if (profile?.troop_name) {
          setTroopName(profile.troop_name);
        }
      })
      .catch(() => {});
    }
  }, [role, isPlRoute]);

  const links = [
    ...(isPlRoute ? [
      {
        name: 'Patrol Dashboard',
        href: '/patrol-leader/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'Patrol Management',
        href: '/patrol-leader/management',
        icon: Users,
      },
      {
        name: 'Return to Scout Panel',
        href: '/scout/dashboard',
        icon: LayoutDashboard,
        highlight: true
      }
    ] : (role === 'scout' || role === 'patrol-leader') ? [
      {
        name: 'Dashboard',
        href: '/scout/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'My Profile',
        href: '/scout/profile',
        icon: User,
      },
      ...(troopId ? [
        {
          name: 'Progress Record',
          href: '/scout/record-book',
          icon: Award,
        },
        {
          name: 'Proficiency Badges',
          href: '/scout/proficiency',
          icon: Award, 
        },
        {
          name: 'Scout Assistant',
          href: '/scout/ai-assistant',
          icon: MessageSquare,
        }
      ] : [])
    ] : role === 'leader' ? [
      {
        name: 'Dashboard',
        href: '/leader/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'My Profile',
        href: '/leader/profile',
        icon: User,
      },
      {
        name: 'Scouts Overview',
        href: '/leader/scouts',
        icon: Users,
      },
      {
        name: 'Patrol Management',
        href: '/leader/patrols',
        icon: Users,
      },
    ] : role === 'admin' ? [
      {
        name: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        name: 'My Profile',
        href: '/admin/profile',
        icon: User,
      },
      {
        name: 'Troop Management',
        href: '/admin/troops',
        icon: Users,
      },
      {
        name: 'Registered Scouts',
        href: '/admin/scouts',
        icon: User,
      },
      {
        name: 'AI Knowledge Base',
        href: '/admin/knowledge',
        icon: BookOpen,
      },
    ] : []),
  ];

  const roleLabel = isPlRoute 
    ? 'Patrol Leader' 
    : role === 'leader' 
      ? 'Troop Leader' 
      : role === 'admin' 
        ? 'Administrator' 
        : 'Scout';


  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img src="/images/logo.png" alt="SmartScouts" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl text-slate-900">Smart Scouts SL</span>
          </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 hover:text-black">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col
        md:translate-x-0 md:static md:h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex flex-col items-center text-center px-6 pt-8 pb-5 border-b border-slate-100">
          <div className="w-28 h-28 flex items-center justify-center mb-3">
            <img src="/images/logo.png" alt="SmartScouts" className="w-full h-full object-contain drop-shadow-md" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 block">Smart Scouts SL</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5 max-w-[160px] truncate" title={troopName || roleLabel}>
            {roleLabel} {troopName ? `• ${troopName}` : ''}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link: any) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-black uppercase tracking-widest text-[10px]
                  ${link.highlight 
                    ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 mt-4' 
                    : isActive 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                      : 'text-slate-900 hover:bg-slate-50 hover:text-black'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} className={link.highlight ? 'text-indigo-600' : isActive ? 'text-white' : 'text-slate-900'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Go to PL Panel Link */}
        {!isPlRoute && isPatrolLeader && (
          <div className="p-4 border-t border-slate-100">
            <Link
              href="/patrol-leader/dashboard"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md hover:shadow-lg font-black uppercase tracking-widest text-[10px]"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Go to PL Panel</span>
              </div>
              {pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount} Pending
                </span>
              )}
            </Link>
          </div>
        )}

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
            onClick={() => {
              if (typeof window !== 'undefined') {
                (window as any).localStorage?.removeItem('scout-ai-chat-history');
                (window as any).localStorage?.removeItem('scout-ai-assistant-page-history');
              }
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 font-black uppercase tracking-widest text-[10px]"
          >
            <LogOut size={18} />
            Logout
          </Link>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
