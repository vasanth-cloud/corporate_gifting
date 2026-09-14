'use client';

import React, { useState } from 'react';
import { GiftItem } from '../lib/types';
import { Image as ImageIcon, Sliders, Check, Eye, Download, Sparkles, RefreshCw } from 'lucide-react';

interface LogoMockupPreviewProps {
  item: GiftItem;
  defaultLogoText?: string;
}

export default function LogoMockupPreview({ item, defaultLogoText = 'ACME CORP' }: LogoMockupPreviewProps) {
  const [logoText, setLogoText] = useState(defaultLogoText);
  const [selectedColor, setSelectedColor] = useState(item.options?.colors?.[0] || 'Default');
  const [logoPosition, setLogoPosition] = useState<'chest' | 'center' | 'bottom'>('chest');
  const [logoSize, setLogoSize] = useState(100);
  const [finishStyle, setFinishStyle] = useState<'print' | 'gold' | 'debossed'>('print');

  const handleDownloadProof = () => {
    const proofText = `GIFTPULSE 3D BRANDING PROOF SHEET\nProduct: ${item.name}\nSupplier: ${item.vendorName}\nLogo Text: ${logoText}\nPlacement: ${logoPosition}\nFinish Style: ${finishStyle.toUpperCase()}\nColor Choice: ${selectedColor}\nStatus: APPROVED FOR PRODUCTION`;
    const element = document.createElement('a');
    const file = new Blob([proofText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.id}-branding-proof.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 glass-card p-8 border-indigo-500/30 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* 3D Mockup Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center p-8 min-h-[380px] shadow-2xl group">
        {/* Product Image */}
        <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-2xl shadow-2xl filter brightness-95 group-hover:scale-105 transition-transform duration-500"
          />

          {/* Dynamic Logo Overlay */}
          {item.customizable && (
            <div
              className={`absolute transition-all duration-300 pointer-events-none flex flex-col items-center ${
                logoPosition === 'chest'
                  ? 'top-10 left-12'
                  : logoPosition === 'center'
                  ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
                  : 'bottom-10 right-10'
              }`}
            >
              <div
                className={`backdrop-blur-md border px-4 py-2 rounded-xl shadow-2xl text-center transition-all ${
                  finishStyle === 'gold'
                    ? 'bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 text-slate-950 border-amber-300 font-black shadow-amber-500/30'
                    : finishStyle === 'debossed'
                    ? 'bg-slate-950/90 text-slate-400 border-slate-800 font-extrabold shadow-inner'
                    : 'bg-slate-900/90 text-indigo-300 border-indigo-500/60 font-black shadow-indigo-500/20'
                }`}
                style={{ transform: `scale(${logoSize / 100})` }}
              >
                <div className="flex items-center gap-1.5 justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="font-black text-xs tracking-widest uppercase">
                    {logoText || 'YOUR LOGO'}
                  </span>
                </div>
                <span className="text-[8px] opacity-75 block uppercase font-bold tracking-wider mt-0.5">
                  {finishStyle} Proof
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-300 flex items-center gap-2 shadow-lg">
          <Eye className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          Interactive 3D Proof Canvas
        </div>
      </div>

      {/* Customization Control Panel */}
      <div className="flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-xl text-white">{item.name}</h3>
            <span className="text-emerald-400 font-black text-xl">${item.price}</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">{item.description}</p>

          {item.customizable ? (
            <div className="space-y-5 border-t border-slate-800 pt-5">
              <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Real-Time Branding Controls
              </h4>

              {/* Logo Text Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Company Branding Text</label>
                <div className="relative">
                  <input
                    type="text"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                    placeholder="Enter company name or logo label"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                  <ImageIcon className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
                </div>
              </div>

              {/* Finish Style Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Print / Branding Finish</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFinishStyle('print')}
                    className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                      finishStyle === 'print'
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    🎨 HD Screen Print
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinishStyle('gold')}
                    className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                      finishStyle === 'gold'
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    ✨ Metallic Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => setFinishStyle('debossed')}
                    className={`py-2 text-xs rounded-xl border font-bold transition-all ${
                      finishStyle === 'debossed'
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-lg'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    🖋️ Debossed Leather
                  </button>
                </div>
              </div>

              {/* Position selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Logo Placement</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['chest', 'center', 'bottom'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setLogoPosition(pos)}
                      className={`py-1.5 text-xs rounded-xl border capitalize font-bold transition-all ${
                        logoPosition === pos
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color choices if available */}
              {item.options?.colors && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Product Color Variant</label>
                  <div className="flex gap-2">
                    {item.options.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs rounded-xl border transition-all flex items-center gap-1.5 ${
                          selectedColor === color
                            ? 'bg-slate-800 border-indigo-500 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {selectedColor === color && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-400">
              ⚡ Instant Digital Voucher (No custom printing required).
            </div>
          )}
        </div>

        {/* Proof Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Supplier: <strong className="text-slate-200">{item.vendorName}</strong>
          </span>

          <button
            onClick={handleDownloadProof}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Download 3D Proof (.TXT)
          </button>
        </div>
      </div>
    </div>
  );
}
