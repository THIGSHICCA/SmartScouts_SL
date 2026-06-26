'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ThumbsUp, 
  MessageSquare, 
  Send, 
  Image as ImageIcon, 
  Award, 
  User,
  Heart,
  Share2,
  Clock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function ScoutFeedPage() {
  const { posts, addPost, likePost, addComment, detailedScouts } = useAppContext();
  
  // Local state for new post input
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  // Local state for comments input (keyed by postId)
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});

  const myProfile = detailedScouts.find(ds => ds.id === 999) || {
    name: 'Alex Johnson',
    avatar: undefined,
    roles: ['Senior Scout']
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    addPost(newPostContent, newPostImage || undefined);
    setNewPostContent('');
    setNewPostImage('');
    setShowImageInput(false);
  };

  const handleLike = (postId: number) => {
    likePost(postId, 999); // 999 is current logged-in scout ID
  };

  const handleCommentChange = (postId: number, text: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: text
    }));
  };

  const handleSubmitComment = (postId: number) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    addComment(postId, myProfile.name, text);
    setCommentInputs(prev => ({
      ...prev,
      [postId]: ''
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Background radial gradient */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto space-y-8 pt-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Scout Feed <Sparkles className="text-yellow-500 animate-pulse" size={28} />
          </h1>
          <p className="text-slate-500 mt-1 font-bold">Connect, share, and celebrate scouting achievements with your troop.</p>
        </div>

        {/* LinkedIn-like Post Creator */}
        <Card className="p-6 border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem]">
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-100 border-2 border-emerald-100 shadow-sm">
                {myProfile.avatar ? (
                  <img src={myProfile.avatar} alt={myProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <User size={24} />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a scouting experience, hike, or badge update..."
                  className="w-full min-h-[90px] p-3 text-slate-900 placeholder-slate-400 bg-slate-50 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm font-semibold resize-none"
                />
              </div>
            </div>

            {showImageInput && (
              <div className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Image URL:</span>
                <input
                  type="text"
                  value={newPostImage}
                  onChange={(e) => setNewPostImage(e.target.value)}
                  placeholder="Paste an image web URL (e.g. https://...)"
                  className="flex-1 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowImageInput(!showImageInput)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-black uppercase tracking-widest text-[10px] ${
                    showImageInput ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ImageIcon size={16} className="text-emerald-500" />
                  Media
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px]"
                >
                  <Award size={16} className="text-indigo-500" />
                  Badge
                </button>
              </div>

              <Button
                type="submit"
                disabled={!newPostContent.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl px-5 h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-100"
              >
                Post
              </Button>
            </div>
          </form>
        </Card>

        {/* Scrollable Feed */}
        <div className="space-y-6">
          {posts.map((post) => {
            const isLikedByMe = post.likedBy?.includes(999);
            return (
              <Card key={post.id} className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
                {/* Header */}
                <div className="p-6 pb-4 flex justify-between items-start">
                  <div className="flex gap-4">
                    {/* Click Avatar to go to profile */}
                    <Link href={`/scout/profile?id=${post.authorId}`}>
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all shadow-sm">
                        {post.authorAvatar ? (
                          <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div>
                      {/* Click Name to go to profile */}
                      <Link href={`/scout/profile?id=${post.authorId}`}>
                        <span className="font-black text-slate-900 hover:text-emerald-600 transition-colors cursor-pointer text-base">
                          {post.authorName}
                        </span>
                      </Link>

                      <div className="flex flex-wrap gap-1 mt-0.5">
                        {post.authorRoles?.map((role, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-widest rounded-full">
                            {role}
                          </span>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                        <Clock size={10} />
                        {post.timestamp}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                  <p className="text-slate-800 text-sm font-semibold leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="w-full max-h-[400px] overflow-hidden bg-slate-50 border-y border-slate-100 flex items-center justify-center">
                    <img src={post.image} alt="Post media" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Engagement Bar */}
                <div className="px-6 py-2 border-b border-slate-100 flex justify-between items-center text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-[10px]">❤️</span>
                    {post.likes} {post.likes === 1 ? 'like' : 'likes'}
                  </span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>

                {/* Actions */}
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex-1 py-2.5 rounded-xl hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 ${
                      isLikedByMe ? 'text-red-500' : 'text-slate-600'
                    }`}
                  >
                    <Heart size={16} className={isLikedByMe ? 'fill-red-500 text-red-500' : ''} />
                    {isLikedByMe ? 'Liked' : 'Like'}
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Comment
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </button>
                </div>

                {/* Comments Section */}
                <div className="p-6 bg-slate-50/50 space-y-4">
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            {comment.authorAvatar ? (
                              <img src={comment.authorAvatar} alt={comment.author} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <User size={16} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-slate-900">{comment.author}</span>
                              <span className="text-[9px] font-bold text-slate-400">{comment.timestamp}</span>
                            </div>
                            <p className="text-slate-700 text-xs mt-1 font-medium">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                      {myProfile.avatar ? (
                        <img src={myProfile.avatar} alt={myProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <User size={16} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => handleCommentChange(post.id, e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-4 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSubmitComment(post.id);
                        }}
                      />
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-all"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
