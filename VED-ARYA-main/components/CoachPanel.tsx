
import React, { useState } from 'react';
import { Member, BodyParameter } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface CoachPanelProps {
  members: Member[];
  onUpdateMember: (id: string, updates: Partial<Member>) => void;
  onAddStats: (id: string, stats: BodyParameter) => void;
  onRemoveMember: (id: string) => void;
  onAddMember: (member: Member) => void;
}

const CoachPanel: React.FC<CoachPanelProps> = ({ members, onUpdateMember, onAddStats, onRemoveMember, onAddMember }) => {
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'analytics' | 'settings'>('roster');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState<'All' | 'Silver' | 'Gold' | 'Platinum'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  
  const [newStats, setNewStats] = useState({
    weight: 0,
    bodyFat: 0,
    muscleMass: 0,
    waterPercentage: 0
  });

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    phone: '',
    height: 170,
    membershipType: 'Silver' as const,
    fitnessGoal: '',
    expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
  });

  const calculateBMI = (weight: number, heightCm?: number) => {
    if (!heightCm) return 0;
    const heightM = heightCm / 100;
    return parseFloat((weight / (heightM * heightM)).toFixed(1));
  };

  const handleAddStatsSubmit = () => {
    if (!selectedMember) return;
    const bmi = calculateBMI(newStats.weight, selectedMember.height || 170);
    const stats: BodyParameter = {
      date: new Date().toISOString().split('T')[0],
      weight: newStats.weight,
      bodyFat: newStats.bodyFat,
      muscleMass: newStats.muscleMass,
      bmi: bmi,
      waterPercentage: newStats.waterPercentage
    };
    onAddStats(selectedMember.id, stats);
    setShowStatsModal(false);
    
    const updated = members.find(m => m.id === selectedMember.id);
    if (updated) setSelectedMember({...updated, stats: [...updated.stats, stats]});
  };

  const handleCreateMember = () => {
    if (!newMemberData.name || !newMemberData.email) {
      alert("Please enter at least a name and email.");
      return;
    }

    const member: Member = {
      id: Date.now().toString(),
      name: newMemberData.name,
      email: newMemberData.email,
      phone: newMemberData.phone,
      height: newMemberData.height,
      membershipType: newMemberData.membershipType,
      status: 'Active',
      role: 'member',
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: newMemberData.expiryDate,
      stats: [],
      fitnessGoal: newMemberData.fitnessGoal
    };
    onAddMember(member);
    setShowAddMemberModal(false);
    setNewMemberData({ 
      name: '', 
      email: '', 
      phone: '', 
      height: 170, 
      membershipType: 'Silver', 
      fitnessGoal: '', 
      expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
    });
  };

  const activeMembersCount = members.filter(m => m.status === 'Active').length;
  const suspendedMembersCount = members.filter(m => m.status === 'Suspended').length;

  // Filter Logic
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = membershipFilter === 'All' || member.membershipType === membershipFilter;
    const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Mock Analytics Data
  const membershipDistribution = [
    { name: 'Silver', value: members.filter(m => m.membershipType === 'Silver').length },
    { name: 'Gold', value: members.filter(m => m.membershipType === 'Gold').length },
    { name: 'Platinum', value: members.filter(m => m.membershipType === 'Platinum').length },
  ];
  const COLORS = ['#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <p className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] mb-1">Coach Administration</p>
           <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Center Command Hub</h1>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setShowAddMemberModal(true)}
             className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-[1.25rem] font-bold flex items-center gap-2 transition-all shadow-xl shadow-emerald-200 dark:shadow-none transform active:scale-95"
           >
             <i className="fas fa-user-plus"></i> New Client Registration
           </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatSummaryCard title="Total Clients" value={members.length} icon="fa-users" color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/10" />
        <StatSummaryCard title="Active Access" value={activeMembersCount} icon="fa-check-circle" color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/10" />
        <StatSummaryCard title="Access Stopped" value={suspendedMembersCount} icon="fa-user-slash" color="text-red-600" bg="bg-red-50 dark:bg-red-900/10" />
        <StatSummaryCard title="Center Goal" value="85%" icon="fa-trophy" color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/10" />
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white dark:bg-slate-800 rounded-2xl w-fit border border-slate-100 dark:border-slate-700 shadow-sm">
        <button 
          onClick={() => setActiveSubTab('roster')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'roster' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-list-ul mr-2"></i> Member Roster
        </button>
        <button 
          onClick={() => setActiveSubTab('analytics')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'analytics' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-chart-pie mr-2"></i> Performance Analytics
        </button>
        <button 
          onClick={() => setActiveSubTab('settings')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeSubTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <i className="fas fa-cog mr-2"></i> App Control
        </button>
      </div>

      {activeSubTab === 'roster' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
              <div className="p-8 border-b border-slate-50 dark:border-slate-700 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Manage Client Access</h3>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full">
                    Showing {filteredMembers.length} of {members.length}
                  </div>
                </div>
                
                {/* Filters Row */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <div className="relative min-w-[200px] flex-1">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input 
                      type="text" 
                      placeholder="Search by name or email..." 
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-transparent focus:border-emerald-500/30 rounded-xl text-xs outline-none transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Type:</span>
                    <select 
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs outline-none border border-transparent focus:border-emerald-500/30 font-bold transition-all"
                      value={membershipFilter}
                      onChange={(e) => setMembershipFilter(e.target.value as any)}
                    >
                      <option value="All">All Plans</option>
                      <option value="Silver">Silver</option>
                      <option value="Gold">Gold</option>
                      <option value="Platinum">Platinum</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Status:</span>
                    <select 
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-xs outline-none border border-transparent focus:border-emerald-500/30 font-bold transition-all"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Client Detail</th>
                      <th className="px-6 py-4">Tier</th>
                      <th className="px-6 py-4">Expires</th>
                      <th className="px-6 py-4">Access Status</th>
                      <th className="px-8 py-4 text-center">Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => (
                        <tr key={member.id} className={`group cursor-pointer transition-all ${selectedMember?.id === member.id ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-700/50'}`}>
                          <td className="px-8 py-5" onClick={() => setSelectedMember(member)}>
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-[1.25rem] bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold group-hover:text-emerald-700 transition-all shadow-sm">
                                {member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold dark:text-white text-sm">{member.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-tight">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold">
                              {member.membershipType.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {member.expiryDate}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1.5 ${
                              member.status === 'Active' ? 'text-green-600 bg-green-50' : 
                              member.status === 'Suspended' ? 'text-red-600 bg-red-50' : 'text-slate-500 bg-slate-100'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {member.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex justify-center gap-3">
                              <button 
                                onClick={() => onUpdateMember(member.id, { status: member.status === 'Active' ? 'Suspended' : 'Active' })}
                                className={`p-2.5 rounded-xl transition-all shadow-sm ${member.status === 'Active' ? 'bg-white border border-red-100 text-red-500 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                title={member.status === 'Active' ? 'Stop Member Login' : 'Allow Member Login'}
                              >
                                <i className={`fas ${member.status === 'Active' ? 'fa-stop-circle' : 'fa-play-circle'}`}></i>
                              </button>
                              <button 
                                onClick={() => {
                                  if(confirm(`Completely remove ${member.name} from the app system?`)) {
                                    onRemoveMember(member.id);
                                    if(selectedMember?.id === member.id) setSelectedMember(null);
                                  }
                                }}
                                className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all shadow-sm"
                              >
                                <i className="fas fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center">
                          <div className="max-w-xs mx-auto space-y-3">
                             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-300 mx-auto">
                                <i className="fas fa-user-slash text-2xl"></i>
                             </div>
                             <p className="text-slate-500 dark:text-slate-400 font-bold">No results found</p>
                             <p className="text-slate-400 dark:text-slate-500 text-xs">Try adjusting your filters or search query.</p>
                             <button 
                                onClick={() => { setSearchQuery(''); setMembershipFilter('All'); setStatusFilter('All'); }}
                                className="text-emerald-600 dark:text-emerald-400 text-xs font-bold hover:underline"
                             >
                               Reset All Filters
                             </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-24">
              {selectedMember ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-[2rem] flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-2xl shadow-emerald-200 dark:shadow-none ring-4 ring-emerald-50 dark:ring-emerald-900/20">
                      {selectedMember.name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-bold dark:text-white leading-tight">{selectedMember.name}</h3>
                    <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mt-1">Prime Member</p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowStatsModal(true)}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 dark:shadow-none"
                    >
                      <i className="fas fa-weight-hanging"></i> Log Body Parameters
                    </button>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Client Height</span>
                       <span className="font-bold dark:text-white">{selectedMember.height} cm</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                       <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Primary Goal</span>
                       <span className="font-bold text-emerald-600 text-right ml-4">{selectedMember.fitnessGoal || 'None Defined'}</span>
                    </div>
                    <div className="pt-6">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <i className="fas fa-pencil-alt"></i> Internal Coach Notes
                       </h4>
                       <textarea 
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-xs italic text-slate-600 dark:text-slate-400 outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all min-h-[100px]"
                        placeholder="Write health observations or special coaching requirements here..."
                        value={selectedMember.healthNotes || ''}
                        onChange={(e) => onUpdateMember(selectedMember.id, { healthNotes: e.target.value })}
                       />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 animate-in fade-in duration-700">
                  <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-[2rem] flex items-center justify-center text-slate-200 dark:text-slate-700 mx-auto mb-6">
                    <i className="fas fa-shield-alt text-4xl"></i>
                  </div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-2">Administrative View</h4>
                  <p className="text-slate-400 text-sm leading-relaxed px-4">Select a client from the roster to manage their login access and update wellness parameters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold mb-8">Membership Distribution</h3>
                <div className="h-64 flex items-center justify-center">
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={membershipDistribution}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {membershipDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                   {membershipDistribution.map((entry, index) => (
                     <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-xs font-bold text-slate-500 uppercase">{entry.name}</span>
                     </div>
                   ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                <h3 className="text-xl font-bold mb-8">Member Growth Trends</h3>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { name: 'Jan', members: 12 },
                        { name: 'Feb', members: 19 },
                        { name: 'Mar', members: 25 },
                        { name: 'Apr', members: members.length },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
              </div>
           </div>

           <div className="bg-emerald-600 p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-md">
                 <h3 className="text-2xl font-extrabold mb-2">Performance Benchmark</h3>
                 <p className="text-emerald-100 opacity-80 leading-relaxed">
                   Your center is currently outperforming local wellness averages by 18% in muscle mass retention metrics.
                 </p>
              </div>
              <div className="flex gap-4">
                 <div className="text-center bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-md border border-white/20">
                    <p className="text-3xl font-bold">+12kg</p>
                    <p className="text-[10px] uppercase font-bold text-emerald-100">Avg Muscle Gain</p>
                 </div>
                 <div className="text-center bg-white/10 px-6 py-4 rounded-3xl backdrop-blur-md border border-white/20">
                    <p className="text-3xl font-bold">-4.2%</p>
                    <p className="text-[10px] uppercase font-bold text-emerald-100">Avg Body Fat Loss</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl">
           <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-300">
                 <i className="fas fa-sliders-h text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold">App Global Settings</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                 <div className="group">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-emerald-600 transition-colors">Wellness Center Name</label>
                   <input type="text" defaultValue="Vitality Wellness Center" className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold" />
                 </div>
                 <div className="group">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block group-focus-within:text-emerald-600 transition-colors">Master Admin Pin</label>
                   <input type="password" defaultValue="1234" className="w-full bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border-none outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold tracking-widest" />
                 </div>
              </div>

              <div className="space-y-8">
                 <div className="p-8 bg-amber-50 dark:bg-amber-900/10 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/20">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3">
                       <i className="fas fa-broadcast-tower"></i> Global Member Broadcast
                    </h4>
                    <p className="text-xs text-amber-700/70 dark:text-amber-500/70 mb-6 leading-relaxed">
                       Announce center-wide updates. This message will appear instantly for every member.
                    </p>
                    <textarea 
                      className="w-full bg-white dark:bg-slate-950 rounded-2xl p-5 text-sm border-none outline-none min-h-[120px] focus:ring-2 focus:ring-amber-500/20 shadow-inner" 
                      placeholder="Type your message..."
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                    ></textarea>
                    <button 
                      onClick={() => {
                        if(!broadcastMessage) return;
                        alert('Broadcast Sent to all members!');
                        setBroadcastMessage('');
                      }}
                      className="w-full mt-6 py-4 bg-amber-600 text-white rounded-2xl font-bold text-sm hover:bg-amber-700 transition-all shadow-xl shadow-amber-200 dark:shadow-none transform active:scale-95"
                    >
                       Deploy Announcement
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Registration Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative overflow-hidden border border-white/20">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div className="flex justify-between items-start mb-10">
               <div>
                  <h3 className="text-3xl font-extrabold dark:text-white leading-tight">Member Registration</h3>
                  <p className="text-slate-400 text-sm mt-1">Onboard a new client to the Hub.</p>
               </div>
               <button onClick={() => setShowAddMemberModal(false)} className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                  <i className="fas fa-times"></i>
               </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Client Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({...newMemberData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Direct Email</label>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({...newMemberData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Contact Phone</label>
                <input 
                  type="tel" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  value={newMemberData.phone}
                  onChange={(e) => setNewMemberData({...newMemberData, phone: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Membership Plan</label>
                <select 
                   className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold"
                   value={newMemberData.membershipType}
                   onChange={(e) => setNewMemberData({...newMemberData, membershipType: e.target.value as any})}
                >
                   <option value="Silver">Silver Plan</option>
                   <option value="Gold">Gold Elite</option>
                   <option value="Platinum">Platinum Infinite</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Access Expiry Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold"
                  value={newMemberData.expiryDate}
                  onChange={(e) => setNewMemberData({...newMemberData, expiryDate: e.target.value})}
                />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Primary Fitness Objective</label>
                <input 
                  type="text" 
                  placeholder="e.g. Muscle gain"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-medium"
                  value={newMemberData.fitnessGoal}
                  onChange={(e) => setNewMemberData({...newMemberData, fitnessGoal: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              <button onClick={() => setShowAddMemberModal(false)} className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl transition-all">Cancel</button>
              <button onClick={handleCreateMember} className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all transform active:scale-95">Complete Registration</button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      {showStatsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-12 shadow-2xl relative border border-white/20">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold dark:text-white">Precision Metrics</h3>
              <p className="text-slate-400 text-sm mt-1">Logging data for {selectedMember?.name}</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Weight (kg)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold text-center text-xl"
                  value={newStats.weight}
                  onChange={(e) => setNewStats({...newStats, weight: parseFloat(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Body Fat %</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold text-center"
                    value={newStats.bodyFat}
                    onChange={(e) => setNewStats({...newStats, bodyFat: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Muscle kg</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 dark:text-white font-bold text-center"
                    value={newStats.muscleMass}
                    onChange={(e) => setNewStats({...newStats, muscleMass: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              <button 
                onClick={() => setShowStatsModal(false)}
                className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStatsSubmit}
                className="flex-1 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all transform active:scale-95"
              >
                Save Metrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatSummaryCard: React.FC<{ title: string; value: string | number; icon: string; color: string; bg: string }> = ({ title, value, icon, color, bg }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center gap-6 transition-all hover:scale-[1.03] group">
    <div className={`w-16 h-16 ${bg} ${color} rounded-[1.5rem] flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:rotate-6`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <p className="text-3xl font-extrabold dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default CoachPanel;
