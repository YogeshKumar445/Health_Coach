
import React, { useState, useRef } from 'react';
import { Member } from '../types';

interface ProfileProps {
  user: Member;
  onUpdate: (updatedData: Partial<Member>) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    fitnessGoal: user.fitnessGoal || '',
    profileImage: user.profileImage || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdate(editForm);
    setIsEditing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <div className="h-48 bg-emerald-600 dark:bg-emerald-700 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-2 shadow-xl relative group">
              {editForm.profileImage || user.profileImage ? (
                <img 
                  src={editForm.profileImage || user.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-full bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-4xl font-bold border-4 border-emerald-50 dark:border-emerald-500/10">
                  {user.name.charAt(0)}
                </div>
              )}
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-camera text-2xl"></i>
                </button>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>
        </div>
        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            {isEditing ? (
              <input 
                type="text" 
                className="text-3xl font-bold text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-emerald-500/20"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            ) : (
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{user.name}</h2>
            )}
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <i className="fas fa-phone-alt text-xs"></i> {user.phone}
            </p>
          </div>
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-3 bg-emerald-600 dark:bg-emerald-700 text-white font-bold rounded-2xl hover:bg-emerald-700 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
             <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Personal Health Goals</h3>
             <div className="space-y-6">
               <div className="p-6 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                     <i className="fas fa-bullseye"></i>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Main Goal</p>
                     {isEditing ? (
                       <input 
                        type="text" 
                        className="text-lg font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-none rounded-lg px-2 py-1 mt-1 outline-none w-full"
                        value={editForm.fitnessGoal}
                        onChange={(e) => setEditForm({ ...editForm, fitnessGoal: e.target.value })}
                       />
                     ) : (
                       <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{user.fitnessGoal}</p>
                     )}
                   </div>
                 </div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                 <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Assigned Coach</h4>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                      <i className="fas fa-user-tie"></i>
                    </div>
                    <p className="font-bold text-slate-800 dark:text-slate-100">{user.coachName}</p>
                 </div>
               </div>

               {user.healthNotes && (
                 <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl">
                   <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Coach's Health Notes</h4>
                   <p className="text-slate-600 dark:text-slate-400 italic">"{user.healthNotes}"</p>
                 </div>
               )}
             </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
             <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-slate-100">Membership</h3>
             <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-400">Tier</span>
                  <span className="font-bold text-emerald-600">{user.membershipType}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400">Join Date</span>
                  <span className="font-bold">{user.joinDate}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-t border-slate-100 dark:border-slate-700">
                  <span className="text-slate-400">Next Billing</span>
                  <span className="font-bold">{user.expiryDate}</span>
                </div>
             </div>
             <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
               <ActionLink icon="fa-lock" label="Privacy Settings" />
               <ActionLink icon="fa-receipt" label="Payment History" />
               <button onClick={onLogout} className="w-full">
                 <ActionLink icon="fa-sign-out-alt" label="Sign Out" color="text-red-500" />
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ActionLink: React.FC<{ icon: string; label: string; color?: string }> = ({ icon, label, color }) => (
  <div className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group text-left cursor-pointer">
    <div className="flex items-center gap-4">
      <i className={`fas ${icon} ${color ? color : 'text-slate-600 dark:text-slate-400'} w-5`}></i>
      <span className={`font-medium ${color ? color : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>{label}</span>
    </div>
    <i className="fas fa-chevron-right text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors text-xs"></i>
  </div>
);

export default Profile;
