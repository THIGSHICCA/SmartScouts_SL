'use client';

import React, { createContext, useContext, useState } from 'react';
import { Badge, RequirementStatus, badgesData as initialBadgesData, BadgeStatus } from '@/data/badges';

export interface ScoutTask {
  id: number;
  reqId: number;
  badgeId: string;
  categoryId: number;
  scoutName: string;
  badgeName: string;
  taskText: string;
}

export interface BadgeRequest {
  id: number;
  badgeId: string;
  scoutName: string;
  badgeName: string;
}

interface Scout {
  id: number;
  name: string;
  badge: string;
  progress: number;
  completedBadges: number;
}

interface AppContextType {
  badges: Badge[];
  pendingTasks: ScoutTask[];
  pendingBadges: BadgeRequest[];
  scouts: Scout[];
  toggleRequirement: (badgeId: string, categoryId: number, reqId: number, currentStatus: RequirementStatus) => void;
  toggleSubTask: (badgeId: string, categoryId: number, reqId: number, subId: number) => void;
  approveTask: (taskId: number) => void;
  addScout: (name: string) => void;
  submitBadge: (badgeId: string) => void;
  approveBadge: (badgeRequestId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>(initialBadgesData);
  
  const [scouts, setScouts] = useState<Scout[]>([
    { id: 1, name: 'Alex Johnson', badge: 'Scout Membership Badge', progress: 42, completedBadges: 0 },
    { id: 2, name: 'Jordan Lee', badge: 'Scout Membership Badge', progress: 85, completedBadges: 0 },
    { id: 999, name: 'My Profile (Scout)', badge: 'Scout Membership Badge', progress: 42, completedBadges: 0 },
  ]);

  const [pendingTasks, setPendingTasks] = useState<ScoutTask[]>([]);
  const [pendingBadges, setPendingBadges] = useState<BadgeRequest[]>([]);

  const toggleRequirement = (badgeId: string, categoryId: number, reqId: number, currentStatus: RequirementStatus) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge || badge.isLocked || currentStatus === 'completed' || badge.status !== 'in_progress') return;

    const nextStatus = currentStatus === 'incomplete' ? 'pending_pl' : 'incomplete';
    const completionDate = nextStatus === 'pending_pl' ? new Date().toLocaleDateString() : undefined;

    setBadges(prevBadges => {
      const newBadges = [...prevBadges];
      const bIndex = newBadges.findIndex(b => b.id === badgeId);
      const newBadge = { ...newBadges[bIndex] };
      
      const newCategories = newBadge.categories.map((category, idx) => {
        if (idx === categoryId) {
          return {
            ...category,
            requirements: category.requirements.map(req => 
              req.id === reqId ? { ...req, status: nextStatus as RequirementStatus, completedDate: completionDate } : req
            )
          };
        }
        return category;
      });
      
      newBadge.categories = newCategories as any; // Cast to avoid deep type check issues
      newBadges[bIndex] = newBadge;
      return newBadges;
    });

    if (nextStatus === 'pending_pl') {
      const reqText = badge.categories[categoryId].requirements.find(r => r.id === reqId)?.text || '';
      setPendingTasks(prev => [...prev, {
        id: Date.now() + reqId,
        reqId,
        badgeId,
        categoryId,
        scoutName: 'My Profile (Scout)',
        badgeName: badge.title,
        taskText: reqText
      }]);
    } else if (nextStatus === 'incomplete') {
      setPendingTasks(prev => prev.filter(t => t.reqId !== reqId || t.scoutName !== 'My Profile (Scout)'));
    }
  };

  const toggleSubTask = (badgeId: string, categoryId: number, reqId: number, subId: number) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge || badge.isLocked || badge.status !== 'in_progress') return;

    setBadges(prevBadges => {
      const newBadges = [...prevBadges];
      const bIndex = newBadges.findIndex(b => b.id === badgeId);
      const newBadge = { ...newBadges[bIndex] };
      
      const newCategories = newBadge.categories.map((category, catIdx) => {
        if (catIdx === categoryId) {
          return {
            ...category,
            requirements: category.requirements.map(req => {
              if (req.id === reqId && req.subTasks) {
                const newSubTasks = req.subTasks.map(sub => {
                  if (sub.id === subId) {
                    const nextStatus = sub.status === 'incomplete' ? 'completed' : 'incomplete';
                    return { 
                      ...sub, 
                      status: nextStatus as RequirementStatus, 
                      completedDate: nextStatus === 'completed' ? new Date().toLocaleDateString() : undefined 
                    };
                  }
                  return sub;
                });

                // Check if all subtasks are now completed
                const allDone = newSubTasks.every(s => s.status === 'completed');
                const wasPending = req.status === 'pending_pl';

                // Automatically move to pending_pl if all subtasks are done
                if (allDone && !wasPending && req.status !== 'completed') {
                  // This is a bit tricky since we're inside setBadges. 
                  // We'll handle the pendingTasks update outside or via an effect, 
                  // but for now let's just update the status.
                  return { ...req, subTasks: newSubTasks, status: 'pending_pl' as RequirementStatus, completedDate: new Date().toLocaleDateString() };
                }

                return { ...req, subTasks: newSubTasks };
              }
              return req;
            })
          };
        }
        return category;
      });
      
      newBadge.categories = newCategories as any;
      newBadges[bIndex] = newBadge;
      return newBadges;
    });

    // Handle pendingTasks update for automatic pending_pl
    // (In a real app, this would be cleaner, but here we just re-check after state update or do it manually)
    // For now, I'll let the user click the main task to submit, or I can add it here.
    const req = badge.categories[categoryId].requirements.find(r => r.id === reqId);
    if (req && req.subTasks) {
      const sub = req.subTasks.find(s => s.id === subId);
      if (sub && sub.status === 'incomplete') {
        const othersDone = req.subTasks.filter(s => s.id !== subId).every(s => s.status === 'completed');
        if (othersDone) {
          setPendingTasks(prev => [...prev, {
            id: Date.now() + reqId,
            reqId,
            badgeId,
            categoryId,
            scoutName: 'My Profile (Scout)',
            badgeName: badge.title,
            taskText: req.text
          }]);
        }
      }
    }
  };

  const approveTask = (taskId: number) => {
    const task = pendingTasks.find(t => t.id === taskId);
    if (!task) return;

    setPendingTasks(prev => prev.filter(t => t.id !== taskId));

    if (task.scoutName === 'My Profile (Scout)') {
      setBadges(prevBadges => {
        const newBadges = [...prevBadges];
        const bIndex = newBadges.findIndex(b => b.id === task.badgeId);
        const newBadge = { ...newBadges[bIndex] };
        
        const newCategories = newBadge.categories.map((category, idx) => {
          if (idx === task.categoryId) {
            return {
              ...category,
              requirements: category.requirements.map(req => 
                req.id === task.reqId ? { ...req, status: 'completed' as RequirementStatus } : req
              )
            };
          }
          return category;
        });
        
        newBadge.categories = newCategories as any;
        
        let totalReqs = 0;
        let completedReqs = 0;
        newCategories.forEach(cat => {
          cat.requirements.forEach(req => {
            totalReqs++;
            if (req.status === 'completed') completedReqs++;
          });
        });
        
        newBadge.progress = Math.round((completedReqs / totalReqs) * 100);
        newBadges[bIndex] = newBadge;
        return newBadges;
      });
    }
  };

  const submitBadge = (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge || badge.progress < 100 || badge.status !== 'in_progress') return;

    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, status: 'pending_leader' as BadgeStatus } : b));
    
    setPendingBadges(prev => [...prev, {
      id: Date.now(),
      badgeId,
      scoutName: 'My Profile (Scout)',
      badgeName: badge.title
    }]);
  };

  const approveBadge = (badgeRequestId: number) => {
    const request = pendingBadges.find(r => r.id === badgeRequestId);
    if (!request) return;

    setPendingBadges(prev => prev.filter(r => r.id !== badgeRequestId));

    setBadges(prev => {
      const newBadges = prev.map(b => {
        if (b.id === request.badgeId) {
          return { ...b, status: 'completed' as BadgeStatus, progress: 100 };
        }
        return b;
      });

      // Unlock next badge
      const currentIdx = newBadges.findIndex(b => b.id === request.badgeId);
      if (currentIdx < newBadges.length - 1) {
        newBadges[currentIdx + 1].isLocked = false;
      }

      return newBadges;
    });

    setScouts(prev => prev.map(s => {
      if (s.name === 'My Profile (Scout)') {
        return { 
          ...s, 
          completedBadges: s.completedBadges + 1,
          badge: badges[badges.findIndex(b => b.id === request.badgeId) + 1]?.title || s.badge
        };
      }
      return s;
    }));
  };

  const addScout = (name: string) => {
    setScouts(prev => [...prev, {
      id: Date.now(),
      name,
      badge: 'Scout Membership Badge',
      progress: 0,
      completedBadges: 0
    }]);
  };

  return (
    <AppContext.Provider value={{ 
      badges, 
      pendingTasks, 
      pendingBadges,
      scouts, 
      toggleRequirement, 
      toggleSubTask,
      approveTask, 
      addScout,
      submitBadge,
      approveBadge
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
