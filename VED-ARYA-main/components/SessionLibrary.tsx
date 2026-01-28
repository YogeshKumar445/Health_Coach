
import React, { useState } from 'react';
import { ZoomSession } from '../types';

interface SessionLibraryProps {
  sessions: ZoomSession[];
}

const SessionLibrary: React.FC<SessionLibraryProps> = ({ sessions }) => {
  const [selectedSession, setSelectedSession] = useState<ZoomSession | null>(null);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"></i>
          <input 
            type="text" 
            placeholder="Search sessions..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800 dark:text-slate-200 transition-colors"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {['All', 'Yoga', 'HIIT', 'Nutrition', 'Meditation'].map(cat => (
            <button key={cat} className="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm font-bold hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors whitespace-nowrap text-slate-600 dark:text-slate-400">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessions.map((session) => (
          <div 
            key={session.id} 
            className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-emerald-900/5 dark:hover:shadow-black/50 transition-all duration-300"
            onClick={() => setSelectedSession(session)}
          >
            <div className="relative aspect-video">
              <img src={session.thumbnailUrl} alt={session.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                  <i className="fas fa-play text-2xl ml-1"></i>
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-white text-[10px] font-bold">
                {session.duration}
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/20 rounded-full">{session.category}</span>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{session.date}</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{session.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{session.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal Overlay */}
      {selectedSession && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedSession(null)}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="aspect-video bg-black">
              <video 
                src={selectedSession.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2 text-slate-800 dark:text-slate-100">{selectedSession.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{selectedSession.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionLibrary;
