import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the AURA Guild! Check your inbox for your 15% code.', 'success');
  };

  return (
    <footer className="bg-[#0F172A] text-stone-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-14 border-b border-slate-800 text-stone-200">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Free Express Shipping</p>
              <p className="text-xs text-stone-400">Complimentary on all orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">30-Day Risk-Free Returns</p>
              <p className="text-xs text-stone-400">Hassle-free prepaid return labels</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Stripe Verified Checkout</p>
              <p className="text-xs text-stone-400">256-bit encrypted end-to-end security</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">2-Year Craft Warranty</p>
              <p className="text-xs text-stone-400">Guaranteed against structural defects</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-serif font-bold text-lg">
                A
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                AURA & ARTIFACT
              </span>
            </div>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Curated essentials engineered for modern living. Designed with material authenticity, honest pricing, and timeless visual serenity.
            </p>
            <div className="pt-2">
              <p className="text-xs text-stone-500 uppercase tracking-wider font-semibold mb-2">Concierge & Inquiries</p>
              <p className="text-sm text-stone-300 font-medium">support@aura-artifact.store</p>
              <p className="text-sm text-stone-400">+1 (800) 492-0192 · Mon–Fri 9am–6pm EST</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-white transition-colors">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors">Shop All Products</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/collections')} className="hover:text-white transition-colors">Curated Collections</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Our Philosophy</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-white transition-colors">The Journal</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">Store Locator & Help</button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate('/account')} className="hover:text-white transition-colors">Track Your Order</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Shipping & Delivery</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">Easy Returns & Exchanges</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">Frequently Asked Questions</button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="hover:text-amber-300 transition-colors text-amber-400 font-medium">
                  Admin Control Panel
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">The AURA Journal</h4>
            <p className="text-xs text-stone-400 mb-4 leading-relaxed">
              Receive curated design stories, private seasonal previews, and an exclusive 15% welcome code.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs">
                ✓ You are subscribed! Use code <strong className="text-white">ELEVATE15</strong> at checkout.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 p-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-md transition-colors"
                    aria-label="Subscribe"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[11px] text-stone-500 block">
                  We respect your privacy. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} AURA & ARTIFACT Co. All rights reserved.</p>
          
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-stone-400 font-medium">VISA</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-stone-400 font-medium">MASTERCARD</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-stone-400 font-medium">AMEX</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-stone-400 font-medium">STRIPE</span>
            <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-stone-400 font-medium">APPLE PAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
