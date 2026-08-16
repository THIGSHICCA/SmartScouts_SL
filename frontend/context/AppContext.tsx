'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

export interface Scout {
  id: number;
  name: string;
  badge: string;
  progress: number;
  completedBadges: number;
}

export interface DetailedScout {
  id: number;
  name: string;
  roles: string[];
  troop: string;
  batch: string;
  scoutId: string;
  joinDate: string;
  district: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  achievements: string[];
}

interface AppContextType {
  badges: Badge[];
  pendingTasks: ScoutTask[];
  pendingBadges: BadgeRequest[];
  scouts: Scout[];
  detailedScouts: DetailedScout[];
  toggleRequirement: (badgeId: string, categoryId: number, reqId: number, currentStatus: RequirementStatus) => void;
  toggleSubTask: (badgeId: string, categoryId: number, reqId: number, subId: number) => void;
  approveTask: (taskId: number) => void;
  rejectTask: (taskId: number) => void;
  addScout: (name: string) => void;
  submitBadge: (badgeId: string) => void;
  approveBadge: (badgeRequestId: number) => void;
  rejectBadge: (badgeRequestId: number) => void;
  updateScoutProfile: (id: number, updatedProfile: DetailedScout) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_DETAILED_SCOUTS: DetailedScout[] = [
  {
    id: 999,
    name: 'Alex Johnson',
    roles: ['Senior Scout', 'Patrol Leader'],
    troop: '1st Colombo Scout Group',
    batch: 'Batch of 2022',
    scoutId: 'SL-2022-045',
    joinDate: 'March 2022',
    district: 'Colombo South',
    email: 'alex.scout@gmail.com',
    achievements: [
      "President's Scout Award Candidate",
      "Patrol Leader Council Representative",
      "Colombo District Camporee 1st Place (Pioneering)",
      "Beach Cleanup Volunteer Lead"
    ]
  },
  {
    id: 1,
    name: 'Jordan Lee',
    roles: ['Scout Scribe', 'Senior Scout'],
    troop: '1st Colombo Scout Group',
    batch: 'Batch of 2022',
    scoutId: 'SL-2022-018',
    joinDate: 'January 2022',
    district: 'Colombo South',
    email: 'jordan.lee@gmail.com',
    achievements: [
      "First Aid Proficiency Badge",
      "Patrol Scribe of the Year 2023",
      "Colombo Youth Forum Delegate"
    ],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 2,
    name: 'Sam Wilson',
    roles: ['Troop Leader', 'Senior Scout'],
    troop: '1st Colombo Scout Group',
    batch: 'Batch of 2021',
    scoutId: 'SL-2021-002',
    joinDate: 'June 2021',
    district: 'Colombo South',
    email: 'sam.wilson@gmail.com',
    achievements: [
      "President's Scout Award Earner 2024",
      "Gold Cord Recipient",
      "National Jamboree Patrol Leader"
    ],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [badges, setBadges] = useState<Badge[]>(initialBadgesData);

  const [scouts, setScouts] = useState<Scout[]>([
    { id: 999, name: 'Alex Johnson', badge: 'Scout Membership Badge', progress: 42, completedBadges: 0 },
    { id: 1, name: 'Jordan Lee', badge: 'Scout Membership Badge', progress: 85, completedBadges: 0 },
    { id: 2, name: 'Sam Wilson', badge: 'Scout Membership Badge', progress: 100, completedBadges: 2 },
  ]);

  const [detailedScouts, setDetailedScouts] = useState<DetailedScout[]>(INITIAL_DETAILED_SCOUTS);

  // Sync detailedScouts with local storage
  useEffect(() => {
    const savedDetailed = sessionStorage.getItem('smart_scouts_detailed');
    if (savedDetailed) {
      try { setDetailedScouts(JSON.parse(savedDetailed)); } catch (e) { }
    }
  }, []);

  const saveDetailedScouts = (updated: DetailedScout[]) => {
    setDetailedScouts(updated);
    sessionStorage.setItem('smart_scouts_detailed', JSON.stringify(updated));
  };

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

      newBadge.categories = newCategories as any;
      newBadges[bIndex] = newBadge;
      return newBadges;
    });

    if (nextStatus === 'pending_pl') {
      const reqText = badge.categories[categoryId].requirements.find(r => r.id === reqId)?.text || '';
      const newTask = {
        id: Date.now() + reqId,
        reqId,
        badgeId,
        categoryId,
        scoutName: 'Alex Johnson',
        badgeName: badge.title,
        taskText: reqText
      };
      setPendingTasks(prev => [...prev, newTask]);

      // Submit to real backend
      try {
        const token = sessionStorage.getItem('token');
        fetch(`http://localhost:5000/api/progress/submit-task`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ requirement_id: reqId })
        }).catch(e => console.warn('Failed to submit task to backend:', e));
      } catch (e) {}
    } else if (nextStatus === 'incomplete') {
      setPendingTasks(prev => prev.filter(t => t.reqId !== reqId || t.scoutName !== 'Alex Johnson'));
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

                const allDone = newSubTasks.every(s => s.status === 'completed');
                const wasPending = req.status === 'pending_pl';

                if (allDone && !wasPending && req.status !== 'completed') {
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

    const req = badge.categories[categoryId].requirements.find(r => r.id === reqId);
    if (req && req.subTasks) {
      const sub = req.subTasks.find(s => s.id === subId);
      if (sub && sub.status === 'incomplete') {
        const othersDone = req.subTasks.filter(s => s.id !== subId).every(s => s.status === 'completed');
        if (othersDone) {
          const newTask = {
            id: Date.now() + reqId,
            reqId,
            badgeId,
            categoryId,
            scoutName: 'Alex Johnson',
            badgeName: badge.title,
            taskText: req.text
          };
          setPendingTasks(prev => [...prev, newTask]);
          
          // Submit to real backend
          try {
            const token = sessionStorage.getItem('token');
            fetch(`http://localhost:5000/api/progress/submit-task`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ requirement_id: reqId })
            }).catch(e => console.warn('Failed to submit task to backend:', e));
          } catch (e) {}
        }
      }
    }
  };

  const approveTask = async (taskId: number) => {
    const task = pendingTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5000/api/progress/review-task/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });
    } catch (e) {
      console.warn('Failed to approve task on backend:', e);
    }

    setPendingTasks(prev => prev.filter(t => t.id !== taskId));

    if (task.scoutName === 'Alex Johnson') {
      // Compute new badge state synchronously so we can sync scouts too
      const currentBadge = badges.find(b => b.id === task.badgeId);
      if (!currentBadge) return;

      const newCategories = currentBadge.categories.map((category, idx) => {
        if (idx === task.categoryId) {
          return {
            ...category,
            requirements: category.requirements.map(req =>
              req.id === task.reqId
                ? { ...req, status: 'completed' as RequirementStatus, completedDate: new Date().toLocaleDateString() }
                : req
            )
          };
        }
        return category;
      });

      let totalReqs = 0;
      let completedReqs = 0;
      newCategories.forEach(cat => {
        cat.requirements.forEach(req => {
          totalReqs++;
          if (req.status === 'completed') completedReqs++;
        });
      });
      const newProgress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

      // Update badge state
      setBadges(prevBadges => {
        const newBadges = [...prevBadges];
        const bIndex = newBadges.findIndex(b => b.id === task.badgeId);
        if (bIndex === -1) return prevBadges;
        newBadges[bIndex] = { ...newBadges[bIndex], categories: newCategories as any, progress: newProgress };
        return newBadges;
      });

      // Sync scouts list so PL panel + badge submit button both see updated progress
      setScouts(prev => prev.map(s =>
        s.name === task.scoutName ? { ...s, progress: newProgress } : s
      ));
    }
  };

  const rejectTask = async (taskId: number) => {
    const task = pendingTasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5000/api/progress/review-task/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'rejected' })
      });
    } catch (e) {
      console.warn('Failed to reject task on backend:', e);
    }

    // Remove from pending queue
    setPendingTasks(prev => prev.filter(t => t.id !== taskId));

    // Reset the requirement back to 'incomplete' so the scout can re-do it
    if (task.scoutName === 'Alex Johnson') {
      const currentBadge = badges.find(b => b.id === task.badgeId);
      if (!currentBadge) return;

      const newCategories = currentBadge.categories.map((category, idx) => {
        if (idx === task.categoryId) {
          return {
            ...category,
            requirements: category.requirements.map(req =>
              req.id === task.reqId
                ? { ...req, status: 'incomplete' as RequirementStatus, completedDate: undefined }
                : req
            )
          };
        }
        return category;
      });

      // Recalculate progress after rejection
      let totalReqs = 0;
      let completedReqs = 0;
      newCategories.forEach(cat => {
        cat.requirements.forEach(req => {
          totalReqs++;
          if (req.status === 'completed') completedReqs++;
        });
      });
      const newProgress = totalReqs > 0 ? Math.round((completedReqs / totalReqs) * 100) : 0;

      setBadges(prevBadges => {
        const newBadges = [...prevBadges];
        const bIndex = newBadges.findIndex(b => b.id === task.badgeId);
        if (bIndex === -1) return prevBadges;
        newBadges[bIndex] = { ...newBadges[bIndex], categories: newCategories as any, progress: newProgress };
        return newBadges;
      });

      // Sync scouts list so PL panel shows correct (lower) progress
      setScouts(prev => prev.map(s =>
        s.name === task.scoutName ? { ...s, progress: newProgress } : s
      ));
    }
  };

  const submitBadge = async (badgeId: string) => {
    const badge = badges.find(b => b.id === badgeId);
    if (!badge || badge.progress < 100 || badge.status !== 'in_progress') return;

    try {
      const token = sessionStorage.getItem('token');
      // For real backend, badgeId must be numeric ID or handled by backend correctly
      await fetch(`http://localhost:5000/api/progress/badges/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ badge_id: parseInt(badgeId) || 1 }) // fallback to 1 if string like "badge-1"
      });
    } catch (e) {
      console.warn('Failed to submit badge to backend:', e);
    }

    setBadges(prev => prev.map(b => b.id === badgeId ? { ...b, status: 'pending_leader' as BadgeStatus } : b));

    setPendingBadges(prev => [...prev, {
      id: Date.now(),
      badgeId,
      scoutName: 'Alex Johnson',
      badgeName: badge.title
    }]);
  };

  const rejectBadge = async (badgeRequestId: number) => {
    try {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5000/api/progress/badges/applications/${badgeRequestId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'rejected' })
      });
    } catch (e) {
      console.warn('Failed to reject badge on backend:', e);
    }
    // Remove from pending list without awarding
    setPendingBadges(prev => prev.filter(r => r.id !== badgeRequestId));

    // Reset the badge status back to in_progress
    const request = pendingBadges.find(r => r.id === badgeRequestId);
    if (request) {
      setBadges(prev => prev.map(b =>
        b.id === request.badgeId ? { ...b, status: 'in_progress' as BadgeStatus } : b
      ));
    }
  };

  const approveBadge = async (badgeRequestId: number) => {
    const request = pendingBadges.find(r => r.id === badgeRequestId);
    if (!request) return;

    try {
      const token = sessionStorage.getItem('token');
      await fetch(`http://localhost:5000/api/progress/badges/applications/${badgeRequestId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'approved' })
      });
    } catch (e) {
      console.warn('Failed to approve badge on backend:', e);
    }

    setPendingBadges(prev => prev.filter(r => r.id !== badgeRequestId));

    let nextBadgeTitle: string | null = null;

    setBadges(prev => {
      const newBadges = prev.map(b => {
        if (b.id === request.badgeId) {
          return { ...b, status: 'completed' as BadgeStatus, progress: 100 };
        }
        return b;
      });

      const currentIdx = newBadges.findIndex(b => b.id === request.badgeId);
      if (currentIdx >= 0 && currentIdx < newBadges.length - 1) {
        // Use prevBadges (not stale closure) to unlock + read next badge title
        newBadges[currentIdx + 1] = { ...newBadges[currentIdx + 1], isLocked: false };
        nextBadgeTitle = newBadges[currentIdx + 1].title;
      }

      return newBadges;
    });

    // Sync scouts: increment completedBadges, point to next badge, reset progress to 0
    setScouts(prev => prev.map(s => {
      if (s.name === request.scoutName) {
        return {
          ...s,
          completedBadges: s.completedBadges + 1,
          badge: nextBadgeTitle || s.badge,
          progress: 0   // reset — scout now starts fresh on the next badge
        };
      }
      return s;
    }));
  };

  const addScout = (name: string) => {
    const newId = Date.now();
    setScouts(prev => [...prev, {
      id: newId,
      name,
      badge: 'Scout Membership Badge',
      progress: 0,
      completedBadges: 0
    }]);
    saveDetailedScouts([...detailedScouts, {
      id: newId,
      name,
      roles: ['Scout'],
      troop: '1st Colombo Scout Group',
      batch: 'Batch of 2024',
      scoutId: `SL-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      district: 'Colombo South',
      email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      achievements: []
    }]);
  };

  const updateScoutProfile = (id: number, updatedProfile: DetailedScout) => {
    const nextDetailed = detailedScouts.map(ds => ds.id === id ? updatedProfile : ds);
    saveDetailedScouts(nextDetailed);

    // Sync back to scouts list name
    setScouts(prev => prev.map(s => s.id === id ? { ...s, name: updatedProfile.name } : s));
  };

  return (
    <AppContext.Provider value={{
      badges,
      pendingTasks,
      pendingBadges,
      scouts,
      detailedScouts,
      toggleRequirement,
      toggleSubTask,
      approveTask,
      rejectTask,
      addScout,
      submitBadge,
      approveBadge,
      rejectBadge,
      updateScoutProfile
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
