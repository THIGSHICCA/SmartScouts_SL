'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Award, MessageSquare, LogOut, Menu, X, User } from 'lucide-react';

export function Sidebar({ role = 'scout' }: { role?: 'scout' | 'leader' | 'patrol-leader' }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const links = [
    {
      name: 'Dashboard',
      href: role === 'scout' ? '/scout/dashboard' : role === 'patrol-leader' ? '/patrol-leader/dashboard' : '/leader/dashboard',
      icon: LayoutDashboard,
    },
    ...(role === 'scout' ? [
      {
        name: 'My Profile',
        href: '/scout/profile',
        icon: User,
      },
      {
        name: 'Badge Tracker',
        href: '/scout/badges',
        icon: Award,
      },
      {
        name: 'Proficiency Badges',
        href: '/scout/proficiency',
        icon: Award, 
      },
      {
        name: 'AI Assistant',
        href: '/scout/ai-assistant',
        icon: MessageSquare,
      }
    ] : []),
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl text-slate-900">SmartScouts</span>
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
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">SmartScouts</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-black uppercase tracking-widest text-[10px]
                  ${isActive 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'text-slate-900 hover:bg-slate-50 hover:text-black'}
                `}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-900'} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link
            href="/"
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
