import React, { useState } from 'react';
import { ArrowRight, Clock, User, Calendar, Search } from 'lucide-react';
import { BlogPost } from '../types';
import { getBlogPosts } from '../../src/services/storage';

interface BlogPageProps {
  onSelectArticle: (slug: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onSelectArticle }) => {
  const posts = getBlogPosts().filter(p => p.published);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPost = posts[0];

  const filteredPosts = posts.filter(post => {
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesQ = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-left">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">The Journal</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Stories, Living & Considered Design
        </h1>
        <p className="text-sm text-stone-600">
          Essays on tactile materiality, modern morning rituals, and sustainable industrial design.
        </p>
      </div>

      {/* Featured Post Hero */}
      {featuredPost && (
        <div
          onClick={() => onSelectArticle(featuredPost.slug)}
          className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12 group"
        >
          <div className="lg:col-span-7 bg-[#F4EFEB] p-8 sm:p-12 flex items-center justify-center">
            <img
              src={featuredPost.coverImage}
              alt={featuredPost.title}
              className="max-h-72 object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Featured Editorial · {featuredPost.category}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900">{featuredPost.author}</span>
                <span>·</span>
                <span>{featuredPost.readingTime}</span>
              </div>
              <span className="font-bold text-slate-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map(post => (
          <article
            key={post.id}
            onClick={() => onSelectArticle(post.slug)}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col group"
          >
            <div className="aspect-[16/10] bg-[#F4EFEB] p-6 flex items-center justify-center">
              <img
                src={post.coverImage}
                alt={post.title}
                className="max-h-40 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  {post.category}
                </span>
                <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>{post.publishedAt}</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
