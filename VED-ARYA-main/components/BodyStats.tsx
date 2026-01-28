
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BodyParameter } from '../types';

interface BodyStatsProps {
  stats: BodyParameter[];
}

const BodyStats: React.FC<BodyStatsProps> = ({ stats }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Weight Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-weight text-blue-500"></i>
            Weight Journey (kg)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDark ? '#64748b' : '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDark ? '#64748b' : '#94a3b8'}} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Fat Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <i className="fas fa-percent text-orange-500"></i>
            Body Fat %
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#334155" : "#f1f5f9"} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDark ? '#64748b' : '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: isDark ? '#64748b' : '#94a3b8'}} />
                <Tooltip 
                   contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    backgroundColor: isDark ? '#1e293b' : '#fff',
                    color: isDark ? '#f1f5f9' : '#1e293b'
                  }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="bodyFat" stroke="#f59e0b" strokeWidth={3} dot={{ r: 6, fill: '#f59e0b', strokeWidth: 2, stroke: isDark ? '#1e293b' : '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Stats Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-slate-50 dark:border-slate-700">
          <h3 className="text-lg font-bold">Detailed Measurement History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-wider transition-colors">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Weight (kg)</th>
                <th className="px-6 py-4 text-right">Body Fat (%)</th>
                <th className="px-6 py-4 text-right">Muscle (kg)</th>
                <th className="px-6 py-4 text-right">BMI</th>
                <th className="px-6 py-4 text-right">Water (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
              {stats.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{row.date}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800 dark:text-slate-100">{row.weight}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{row.bodyFat}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{row.muscleMass}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{row.bmi}</td>
                  <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-400">{row.waterPercentage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BodyStats;
