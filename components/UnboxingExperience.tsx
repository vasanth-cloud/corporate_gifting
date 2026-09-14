'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Sparkles, Heart, ArrowRight } from 'lucide-react';

interface UnboxingExperienceProps {
  recipientName: string;
  companyName: string;
  customMessage: string;
  budget: number;
  onUnwrapped: () => void;
}

export default function UnboxingExperience({
  recipientName,
  companyName,
  customMessage,
  budget,
  onUnwrapped,
}: UnboxingExperienceProps) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpen = () => {
    setIsOpened(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-4 py-8">
      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="closed-box"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="flex flex-col items-center max-w-md w-full"
          >
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Special Gift Invitation for {recipientName}
            </div>

            {/* Interactive 3D Gift Box */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="relative cursor-pointer group my-4"
            >
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl shadow-purple-500/30 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition-all" />
                
                {/* Ribbon */}
                <div className="absolute w-8 h-full bg-amber-400/90 shadow-md" />
                <div className="absolute h-8 w-full bg-amber-400/90 shadow-md" />

                <div className="relative z-10 w-24 h-24 rounded-full bg-slate-900/90 border-2 border-amber-400/80 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Gift className="w-12 h-12 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div className="absolute -bottom-2 inset-x-0 h-4 bg-indigo-500/20 blur-xl rounded-full" />
            </motion.div>

            <h2 className="text-2xl font-black text-white mt-6 mb-2">
              {companyName} sent you a gift!
            </h2>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Click the gift box above to unwrap your celebration reward.
            </p>

            <button
              onClick={handleOpen}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Unwrap Your Gift
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="opened-box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-lg w-full glass-card p-8 border-indigo-500/40 text-left relative overflow-hidden"
          >
            {/* Sparkles background effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500/30" />
                <span className="font-bold text-white text-sm">{companyName} Appreciation</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                Budget Tier: ${budget}
              </span>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 mb-6 relative">
              <p className="text-slate-200 italic text-sm leading-relaxed mb-3">
                "{customMessage}"
              </p>
              <span className="text-xs text-indigo-400 font-semibold block">
                — Warm regards from the leadership team at {companyName}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">What happens next?</h4>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Select your favorite gift from the curated catalog below.
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Provide your preferred delivery address (kept strictly confidential).
                </li>
              </ul>
            </div>

            <button
              onClick={onUnwrapped}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              Browse & Select Your Gift
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
