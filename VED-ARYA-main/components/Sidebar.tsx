
import React from 'react';
import { AppTab, Member } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  user: Member;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: AppTab.DASHBOARD, icon: 'fa-th-large', label: 'Dashboard' },
    { id: AppTab.STATS, icon: 'fa-chart-line', label: 'Body Stats' },
    { id: AppTab.COMMUNITY, icon: 'fa-users', label: 'Community Feed' },
    { id: AppTab.SESSIONS, icon: 'fa-video', label: 'Zoom Library' },
    { id: AppTab.PROFILE, icon: 'fa-user-circle', label: 'Membership' },
  ];

  if (user.role === 'coach') {
    menuItems.push({ id: AppTab.COACH_PANEL, icon: 'fa-user-cog', label: 'Coach Panel' });
  }

  return (
    <div className="w-full h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
          <i className="fas fa-leaf text-xl"></i>
        </div>
        <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 tracking-tight">Vitality Hub</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-emerald-600 dark:bg-emerald-700 rounded-2xl p-4 text-white">
          <p className="text-xs text-emerald-100 font-medium uppercase tracking-wider mb-2">Coach Mode</p>
          <p className="text-sm font-medium italic">"Empowering others to be their best self."</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
