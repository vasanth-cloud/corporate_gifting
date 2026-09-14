'use client';

import React, { useState } from 'react';
import { MOCK_GIFTS } from '../../../lib/db';
import { GiftItem, GiftCategory } from '../../../lib/types';
import LogoMockupPreview from '../../../components/LogoMockupPreview';
import { Filter, Search, Sparkles, Check, PackageCheck } from 'lucide-react';

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItemForProof, setActiveItemForProof] = useState<GiftItem>(MOCK_GIFTS[0]);

  const categories: (GiftCategory | 'All')[] = ['All', 'Swag', 'Electronics', 'Hampers', 'Gift Card', 'Wellness'];

  const filteredGifts = MOCK_GIFTS.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) || g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Supplier Marketplace & Custom Proofing Studio
        </div>
        <h1 className="text-2xl font-bold text-white">Gift Catalog & Customization Proofing</h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse verified supplier SKUs across Dealberg, Zestta, Ekmatra & CorporateGift.com networks.
        </p>
      </div>

      {/* Proof Studio Section */}
      <div>
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" /> Active 3D Branding Studio Proof
        </h2>
        <LogoMockupPreview item={activeItemForProof} defaultLogoText="ACME CORP" />
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search gifts or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGifts.map((gift) => {
          const isSelectedForProof = activeItemForProof.id === gift.id;
          return (
            <div
              key={gift.id}
              className={`glass-card overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-indigo-500/50 ${
                isSelectedForProof ? 'ring-2 ring-indigo-500 border-indigo-500' : 'border-slate-800'
              }`}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                <img
                  src={gift.image}
                  alt={gift.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-950/80 backdrop-blur text-indigo-400 border border-indigo-500/30">
                    {gift.category}
                  </span>
                  {gift.customizable && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/80 backdrop-blur text-white">
                      Logo Proofing
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur px-2.5 py-1 rounded-lg text-sm font-extrabold text-emerald-400">
                  ${gift.price}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base leading-snug">{gift.name}</h3>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">{gift.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Supplier: <strong className="text-slate-200">{gift.vendorName}</strong>
                  </div>
                  <button
                    onClick={() => setActiveItemForProof(gift)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      isSelectedForProof
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isSelectedForProof ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Proofing Active
                      </>
                    ) : (
                      'Load Proof'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
