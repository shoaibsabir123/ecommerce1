import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Feather, Recycle, Award } from 'lucide-react';
import { getProductSvg } from '../../src/utils/productImages';

interface AboutPageProps {
  onNavigateToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-20 text-left">
      
      {/* Brand Story Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">
            Our Heritage & Philosophy
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] text-balance">
            Considered objects for a refined, deliberate everyday life.
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Founded in 2024, AURA & ARTIFACT was born from a fundamental frustration with disposability. We believe everyday tools—from the backpack on your shoulders to the headphones guarding your concentration—should be crafted with uncompromised integrity.
          </p>
          <div className="pt-2">
            <button
              onClick={onNavigateToShop}
              className="px-6 py-3.5 bg-[#0F172A] text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore The Current Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="aspect-[4/5] rounded-3xl bg-[#F5EFEB] border border-stone-200 p-8 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={getProductSvg('backpack', '#C5A880', '#18181B')}
              alt="AURA Craftsmanship"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Brand Values Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-stone-400 uppercase">The Four Pillars</span>
          <h2 className="font-serif text-3xl font-bold text-slate-900">What Guides Every Release</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">1. Material Authenticity</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We never simulate veneers. Real titanium, solid walnut, full-grain Italian leather, and surgical stainless steel.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">2. Honest Fair Pricing</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Direct-to-consumer relationships with artisanal manufacturers cut out arbitrary middleman markups.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">3. Carbon-Neutral Shipping</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              100% recyclable molded fiber packaging, zero single-use plastics, and verified carbon offsets on every dispatch.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-slate-900">4. Guaranteed Longevity</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Every piece is backed by our 2-Year Craft Warranty and comprehensive repair parts availability.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Statistics */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0F172A] text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">25,000+</p>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Patrons Worldwide</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">4.9 / 5.0</p>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Average Review Score</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">99.4%</p>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">On-Time Courier Delivery</p>
          </div>
          <div>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-amber-300">30 Days</p>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-wider">Risk-Free Trial Period</p>
          </div>
        </div>
      </section>

    </div>
  );
};
