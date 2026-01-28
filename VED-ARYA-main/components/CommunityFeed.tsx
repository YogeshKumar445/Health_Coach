
import React, { useState } from 'react';
import { Post, Member } from '../types';

interface CommunityFeedProps {
  posts: Post[];
  onPostAdd: (content: string, imageUrl?: string) => void;
  user: Member;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ posts, onPostAdd, user }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onPostAdd(newPostContent, imageUrl || undefined);
    setNewPostContent('');
    setImageUrl('');
    setShowImageInput(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
      {/* Create Post */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold shrink-0 shadow-sm">
            {user.name.charAt(0)}
          </div>
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <textarea
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="How's your fitness journey today?"
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500/20 resize-none min-h-[100px] outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
            {showImageInput && (
              <div className="flex gap-2">
                 <input 
                  type="text" 
                  placeholder="Paste image URL here..." 
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-3 text-sm outline-none text-slate-800 dark:text-slate-200 transition-colors"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                 />
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-4 transition-colors">
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 text-sm font-medium transition-colors"
                >
                  <i className="fas fa-camera"></i>
                  {showImageInput ? 'Hide URL' : 'Add Selfie'}
                </button>
                <button type="button" className="text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-2 text-sm font-medium transition-colors">
                  <i className="fas fa-hashtag"></i>
                  Tag
                </button>
              </div>
              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-emerald-600 dark:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-700 dark:hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 dark:shadow-none"
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${post.authorRole === 'coach' ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{post.authorName}</p>
                      {post.authorRole === 'coach' && (
                        <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Coach</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{post.timestamp}</p>
                  </div>
                </div>
                <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{post.content}</p>
            </div>
            
            {post.imageUrl && (
              <div className="relative overflow-hidden aspect-video border-y border-slate-50 dark:border-slate-700">
                <img src={post.imageUrl} alt="Post content" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )}

            <div className="px-6 py-4 flex items-center gap-6 border-t border-slate-50 dark:border-slate-700/50 transition-colors">
              <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <i className="far fa-heart"></i>
                <span className="text-sm font-bold">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <i className="far fa-comment"></i>
                <span className="text-sm font-bold">Reply</span>
              </button>
              <button className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ml-auto">
                <i className="far fa-bookmark"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;
