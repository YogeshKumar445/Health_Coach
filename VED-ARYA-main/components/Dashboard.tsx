
import React from 'react';
import { Member, Post } from '../types';

interface DashboardProps {
  user: Member;
  insight: string;
  posts: Post[];
  onPostAdd: (content: string, imageUrl?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, insight, posts }) => {
  const latestStats = user.stats[user.stats.length - 1];
  const featuredPost = posts.find(p => p.isFeatured) || posts[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome & AI Insight */}
      <section className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-700 dark:to-teal-900 rounded-3xl p-8 text-white shadow-xl shadow-emerald-100 dark:shadow-none transition-colors">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Welcome back, {user.name}! 👋</h2>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-400 dark:bg-emerald-500 rounded-full text-emerald-900 mt-1">
                <i className="fas fa-magic"></i>
              </div>
              <div>
                <p className="text-emerald-50 font-semibold mb-1 uppercase tracking-widest text-[10px]">Coach AI Insight</p>
                <p className="text-lg leading-relaxed">{insight}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Parameters */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <i className="fas fa-heartbeat text-emerald-500"></i>
            Current Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard icon="fa-weight" label="Weight" value={`${latestStats.weight} kg`} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" />
            <MetricCard icon="fa-percent" label="Body Fat" value={`${latestStats.bodyFat}%`} color="text-orange-600 dark:text-orange-400" bg="bg-orange-50 dark:bg-orange-900/20" />
            <MetricCard icon="fa-dumbbell" label="Muscle" value={`${latestStats.muscleMass} kg`} color="text-emerald-600 dark:text-emerald-400" bg="bg-emerald-50 dark:bg-emerald-900/20" />
            <MetricCard icon="fa-calculator" label="BMI" value={latestStats.bmi.toString()} color="text-purple-600 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-900/20" />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Membership Status</h3>
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-full">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-1">Plan</p>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{user.membershipType} Tier</p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-1">Renewal Date</p>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-200">{user.expiryDate}</p>
              </div>
            </div>
            <div className="mt-6 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[75%] transition-all"></div>
            </div>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 text-center">75% of membership year remaining</p>
          </div>
        </div>

        {/* Community Highlight */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <i className="fas fa-star text-yellow-500"></i>
            Coach's Spotlight
          </h3>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
             {featuredPost.imageUrl && (
               <img src={featuredPost.imageUrl} alt="Featured" className="w-full h-48 object-cover rounded-2xl mb-4" />
             )}
             <div className="flex items-center gap-3 mb-3">
               <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                 S
               </div>
               <div>
                 <p className="font-bold text-slate-800 dark:text-slate-200">{featuredPost.authorName}</p>
                 <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Coach</p>
               </div>
             </div>
             <p className="text-slate-600 dark:text-slate-400 mb-4">{featuredPost.content}</p>
             <button className="w-full py-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
               Read Full Story
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ icon: string; label: string; value: string; color: string; bg: string }> = ({ icon, label, value, color, bg }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center text-center transition-colors">
    <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-3 transition-colors`}>
      <i className={`fas ${icon} text-lg`}></i>
    </div>
    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
    <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{value}</p>
  </div>
);

export default Dashboard;
