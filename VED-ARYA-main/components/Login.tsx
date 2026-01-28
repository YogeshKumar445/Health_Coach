
import React, { useState } from 'react';
import { Member } from '../types';

interface LoginProps {
  onLogin: (userData: Partial<Member>) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isCoachLogin, setIsCoachLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    coachName: '',
    fitnessGoal: '',
    height: 170,
    healthNotes: '',
    secretCode: '' // Simple way for coach to log in
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Changed secret code to 1234 as per user request
    if (isCoachLogin && formData.secretCode === '1234') {
      onLogin({ ...formData, role: 'coach', name: formData.name || 'Admin Coach' });
    } else if (isCoachLogin) {
      alert("Invalid Coach Code. Please use 1234.");
    } else {
      onLogin({ ...formData, role: 'member' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-emerald-600 dark:bg-emerald-700 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-500 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 bg-teal-400 rounded-full opacity-20"></div>
          
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl border border-white/30">
            <i className="fas fa-leaf text-4xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Vitality Hub</h1>
          <p className="text-emerald-100">{isCoachLogin ? 'Coach Access Control' : 'Your Wellness Journey Starts Here'}</p>
        </div>

        <div className="flex border-b border-slate-50 dark:border-slate-800">
           <button 
            onClick={() => setIsCoachLogin(false)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${!isCoachLogin ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-400'}`}
           >
             Member
           </button>
           <button 
            onClick={() => setIsCoachLogin(true)}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition-colors ${isCoachLogin ? 'text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-400'}`}
           >
             Coach
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {!isCoachLogin && (
              <>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                  <input
                    required
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <i className="fas fa-ruler-vertical absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                    <input
                      required
                      type="number"
                      placeholder="Height cm"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-id-card-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                    <input
                      required
                      type="text"
                      placeholder="Coach"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                      value={formData.coachName}
                      onChange={(e) => setFormData({ ...formData, coachName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="relative">
                  <i className="fas fa-bullseye absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                  <input
                    required
                    type="text"
                    placeholder="Fitness Goal"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                    value={formData.fitnessGoal}
                    onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  />
                </div>
              </>
            )}

            {isCoachLogin && (
              <div className="relative">
                <i className="fas fa-key absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
                <input
                  required
                  type="password"
                  placeholder="Coach Secret Code (1234)"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-slate-800 dark:text-slate-100 transition-all"
                  value={formData.secretCode}
                  onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold rounded-[1.5rem] shadow-xl shadow-emerald-200 dark:shadow-none transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
          >
            {isCoachLogin ? 'Login as Coach' : 'Access My Hub'}
          </button>
        </form>
        
        <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm border-t border-slate-50 dark:border-slate-800">
          Managed by Vitality Wellness Centre
        </div>
      </div>
    </div>
  );
};

export default Login;
