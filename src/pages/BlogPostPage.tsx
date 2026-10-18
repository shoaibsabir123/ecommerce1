import React from 'react';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types';
import { getBlogPostBySlug, getBlogPosts } from '../../src/services/storage';
import { useToast } from '../../src/context/ToastContext';

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
  onSelectArticle: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack, onSelectArticle }) => {
  const post = getBlogPostBySlug(slug) || getBlogPosts()[0];
  const { showToast } = useToast();

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'info');
    }
  };

  const relatedPosts = getBlogPosts().filter(p => p.id !== post.id).slice(0, 2);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 text-left">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to The Journal</span>
      </button>

      {/* Article Header */}
      <div className="space-y-4 border-b border-stone-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
          {post.category}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900 leading-[1.15]">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-stone-500">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 font-serif font-bold text-sm flex items-center justify-center">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{post.author}</p>
              <p className="text-[11px] text-stone-400">{post.authorRole} · {post.publishedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-stone-400" />
              {post.readingTime}
            </span>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors"
              title="Share Article"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full aspect-[16/9] bg-[#F4EFEB] rounded-3xl border border-stone-200 p-8 flex items-center justify-center overflow-hidden">
        <img src={post.coverImage} alt={post.title} className="max-h-full object-contain filter drop-shadow-md" />
      </div>

      {/* Body Content */}
      <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed text-sm sm:text-base space-y-6">
        <p className="font-serif italic text-lg sm:text-xl text-stone-800 border-l-2 border-amber-800 pl-4 my-6">
          "{post.excerpt}"
        </p>

        <div className="whitespace-pre-line font-sans space-y-4">
          {post.content}
        </div>
      </div>

      {/* Related Reads */}
      <div className="pt-12 border-t border-stone-200 space-y-6">
        <h3 className="font-serif text-2xl font-bold text-slate-900">Related Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {relatedPosts.map(rp => (
            <div
              key={rp.id}
              onClick={() => onSelectArticle(rp.slug)}
              className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-stone-400 transition-colors cursor-pointer space-y-2"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{rp.category}</span>
              <h4 className="font-serif font-bold text-base text-slate-900">{rp.title}</h4>
              <p className="text-xs text-stone-500 line-clamp-2">{rp.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};
