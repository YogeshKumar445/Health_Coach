
import React, { useState, useEffect, useRef } from 'react';
import { AppTab, Member, Post, ZoomSession, Theme, Notification, BodyParameter } from './types';
import { CURRENT_USER, MOCK_POSTS, MOCK_SESSIONS, MOCK_NOTIFICATIONS, MOCK_MEMBERS, COACH_USER } from './constants.tsx';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BodyStats from './components/BodyStats';
import CommunityFeed from './components/CommunityFeed';
import SessionLibrary from './components/SessionLibrary';
import Profile from './components/Profile';
import Login from './components/Login';
import CoachPanel from './components/CoachPanel';
import { getWellnessInsight } from './geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [user, setUser] = useState<Member>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : CURRENT_USER;
  });
  const [allMembers, setAllMembers] = useState<Member[]>(() => {
    const savedMembers = localStorage.getItem('allMembers');
    return savedMembers ? JSON.parse(savedMembers) : MOCK_MEMBERS;
  });
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [sessions] = useState<ZoomSession[]>(MOCK_SESSIONS);
  const [aiInsight, setAiInsight] = useState<string>('Loading personalized insights...');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Computed state for unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Mark all notifications as read handler
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  useEffect(() => {
    if (isLoggedIn && user.status !== 'Suspended') {
      const fetchInsight = async () => {
        const insight = await getWellnessInsight(user.stats);
        setAiInsight(insight);
      };
      fetchInsight();
    }
  }, [user.stats, isLoggedIn, user.status]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('allMembers', JSON.stringify(allMembers));
  }, [allMembers]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = (userData: Partial<Member>) => {
    const existing = allMembers.find(m => m.name === userData.name);
    if (existing && existing.status === 'Suspended') {
      alert("Your account is currently suspended. Please contact the wellness center.");
      return;
    }

    if (userData.role === 'coach') {
      const coach = { ...COACH_USER, name: userData.name || 'Admin Coach' };
      setUser(coach);
      setIsLoggedIn(true);
      setActiveTab(AppTab.COACH_PANEL); // Switch to panel immediately
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(coach));
    } else {
      const newUser: Member = existing || {
        ...CURRENT_USER,
        ...userData,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      };
      setUser(newUser);
      setIsLoggedIn(true);
      setActiveTab(AppTab.DASHBOARD);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(newUser));
      if (!existing) setAllMembers([...allMembers, newUser]);
    }
  };

  const handleUpdateMember = (id: string, updates: Partial<Member>) => {
    setAllMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    if (user.id === id) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleAddMember = (newMember: Member) => {
    setAllMembers(prev => [...prev, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    setAllMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleAddStatsForMember = (id: string, newStat: BodyParameter) => {
    setAllMembers(prev => prev.map(m => {
      if (m.id === id) {
        const updatedStats = [...m.stats, newStat];
        return { ...m, stats: updatedStats };
      }
      return m;
    }));
    if (user.id === id) {
      const updatedUser = { ...user, stats: [...user.stats, newStat] };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  const handleAddPost = (content: string, imageUrl?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user.id,
      authorName: user.name,
      authorRole: user.role,
      type: imageUrl ? 'selfie' : 'wellness_tip',
      content,
      imageUrl,
      timestamp: 'Just now',
      likes: 0
    };
    setPosts([newPost, ...posts]);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.status === 'Suspended') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-8 text-center">
        <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-6">
          <i className="fas fa-user-lock"></i>
        </div>
        <h1 className="text-3xl font-bold mb-4 dark:text-white">Account Suspended</h1>
        <p className="text-slate-500 max-w-md mb-8">Access to your membership hub has been stopped. Please contact your coach or wellness center administrator for details.</p>
        <button onClick={handleLogout} className="px-8 py-3 bg-slate-200 dark:bg-slate-800 rounded-xl font-bold transition-all hover:bg-slate-300">Logout</button>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return <Dashboard user={user} insight={aiInsight} posts={posts} onPostAdd={handleAddPost} />;
      case AppTab.STATS:
        return <BodyStats stats={user.stats} />;
      case AppTab.COMMUNITY:
        return <CommunityFeed posts={posts} onPostAdd={handleAddPost} user={user} />;
      case AppTab.SESSIONS:
        return <SessionLibrary sessions={sessions} />;
      case AppTab.PROFILE:
        return <Profile user={user} onUpdate={(data) => handleUpdateMember(user.id, data)} onLogout={handleLogout} />;
      case AppTab.COACH_PANEL:
        return (
          <CoachPanel 
            members={allMembers} 
            onUpdateMember={handleUpdateMember} 
            onAddStats={handleAddStatsForMember} 
            onRemoveMember={handleRemoveMember}
            onAddMember={handleAddMember}
          />
        );
      default:
        return <Dashboard user={user} insight={aiInsight} posts={posts} onPostAdd={handleAddPost} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden">
      <div className="hidden md:block w-64 h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-y-auto pb-20 md:pb-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between transition-colors">
          <div className="md:hidden flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
                <i className="fas fa-leaf text-xl"></i>
             </div>
             <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">Vitality Hub</h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold capitalize">{activeTab.replace('_', ' ')}</h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4 relative">
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-100 dark:bg-slate-800 rounded-xl"
              aria-label="Toggle Theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </button>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors bg-slate-100 dark:bg-slate-800 rounded-xl relative"
                aria-label="Notifications"
              >
                <i className="fas fa-bell"></i>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Notifications</h3>
                    <button onClick={markAllAsRead} className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">Mark read</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 flex gap-4 transition-colors ${!n.isRead ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                          <i className={`fas ${n.type === 'success' ? 'fa-check' : 'fa-info'}`}></i>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm mb-0.5">{n.title}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{n.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/30">
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-between items-center z-20 transition-colors">
        <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.DASHBOARD ? 'text-emerald-600' : 'text-slate-400'}`}>
          <i className="fas fa-th-large text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Home</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.STATS)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.STATS ? 'text-emerald-600' : 'text-slate-400'}`}>
          <i className="fas fa-chart-line text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Stats</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.COMMUNITY)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.COMMUNITY ? 'text-emerald-600' : 'text-slate-400'}`}>
          <i className="fas fa-users text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Feed</span>
        </button>
        <button onClick={() => setActiveTab(AppTab.SESSIONS)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.SESSIONS ? 'text-emerald-600' : 'text-slate-400'}`}>
          <i className="fas fa-video text-xl"></i>
          <span className="text-[10px] uppercase font-bold tracking-wider">Zoom</span>
        </button>
        {user.role === 'coach' && (
          <button onClick={() => setActiveTab(AppTab.COACH_PANEL)} className={`flex flex-col items-center gap-1 ${activeTab === AppTab.COACH_PANEL ? 'text-emerald-600' : 'text-slate-400'}`}>
            <i className="fas fa-user-cog text-xl"></i>
            <span className="text-[10px] uppercase font-bold tracking-wider">Coach</span>
          </button>
        )}
      </nav>
    </div>
  );
};

export default App;
