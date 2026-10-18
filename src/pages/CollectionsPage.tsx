import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getProductSvg } from '../../src/utils/productImages';

interface CollectionsPageProps {
  onNavigateToCategory: (category: string) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({ onNavigateToCategory }) => {
  const collections = [
    {
      title: 'The Daily Commuter',
      category: 'fashion',
      description: 'Tactical recycled ripstop packs, Italian leather wallets, and polarized mineral sunglasses built for transit.',
      image: getProductSvg('backpack', '#4A5844', '#18181B'),
      itemsCount: '14 curated pieces'
    },
    {
      title: 'The Acoustic Sanctuary',
      category: 'electronics',
      description: 'Precision titanium studio monitors and active noise cancellation tuned for uninterrupted creative flow.',
      image: getProductSvg('headphones', '#18181B', '#C29B38'),
      itemsCount: '8 curated pieces'
    },
    {
      title: 'The Warm Living Space',
      category: 'home-living',
      description: 'Celestial 3D moon lamps on American walnut stands, cast stone clocks, and ribbed ceramic stoneware.',
      image: getProductSvg('lamp', '#F59E0B', '#8B4513'),
      itemsCount: '12 curated pieces'
    },
    {
      title: 'Botanical & Sensory Care',
      category: 'beauty',
      description: 'Stabilized 15% Vitamin C glow serums and Grasse-distilled French extrait de parfums in heavy smoked glass.',
      image: getProductSvg('perfume', '#18181B', '#D4AF37'),
      itemsCount: '9 curated pieces'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 text-left">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold tracking-widest text-amber-800 uppercase">Themed Curations</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-slate-900">
          Curated Design Collections
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Carefully themed capsules grouping companion objects across departments.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {collections.map(col => (
          <div
            key={col.title}
            onClick={() => onNavigateToCategory(col.category)}
            className="group bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-center p-6 gap-6"
          >
            <div className="w-full sm:w-48 h-48 bg-[#F5EFEB] rounded-2xl p-4 flex items-center justify-center shrink-0">
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex-1 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">{col.itemsCount}</span>
              <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                {col.title}
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">{col.description}</p>
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-900 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore Capsule <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
