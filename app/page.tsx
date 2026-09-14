'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, Building2, UserCheck, Package, ShieldCheck, Zap, BarChart3, Truck, ArrowRight, Layers, Sparkles, CheckCircle2, Play, Sliders, Eye, RefreshCw } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'admin' | 'claim' | 'vendor'>('admin');

  return (
    <div className="space-y-24 relative overflow-hidden">
      {/* Background Ambient Light Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/20 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8 pt-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-lg backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          Enterprise Corporate Gifting & Swag Automation Platform 2.0
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
          Automate Corporate Gifts, Swag & Rewards with <span className="gradient-text animate-gradient-x">Zero Logistics Hassle</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl mx-auto font-normal">
          Empower HR teams to launch milestone gifting campaigns, let recipients pick their favorite gift via magic redemption links, and automate supplier dispatch globally.
        </p>

        {/* Action Button Grid */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/admin"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:from-indigo-500 hover:to-pink-400 text-white font-extrabold text-sm shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all flex items-center gap-2"
          >
            Launch HR Admin Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/claim/CLAIM-SARAH-2026"
            className="px-8 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 backdrop-blur-md shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
            Test Unboxing Demo
          </Link>
        </div>
      </div>

      {/* Live Interactive Sandbox Component */}
      <div className="max-w-5xl mx-auto glass-card p-6 border-indigo-500/40 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs font-mono text-slate-400 ml-2">giftpulse.io/live-interactive-sandbox</span>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. HR Admin View
            </button>
            <button
              onClick={() => setActiveTab('claim')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'claim' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Recipient eGifting
            </button>
            <button
              onClick={() => setActiveTab('vendor')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'vendor' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Vendor Fulfillment
            </button>
          </div>
        </div>

        {/* Interactive Tab Previews */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold">Total Budget Managed</span>
                <div className="text-2xl font-black text-emerald-400">$324,500</div>
                <span className="text-[11px] text-slate-500">Across 5 Corporate Workspaces</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold">Redemption Rate</span>
                <div className="text-2xl font-black text-indigo-400">92.4%</div>
                <span className="text-[11px] text-slate-500">Highest in industry</span>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-slate-400 uppercase font-bold">Active Suppliers</span>
                <div className="text-2xl font-black text-purple-400">14 Verified</div>
                <span className="text-[11px] text-slate-500">Dealberg, Zestta, Ekmatra</span>
              </div>
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                  3D
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">3D Logo Proofing Engine Active</h4>
                  <p className="text-xs text-slate-400">Upload logos and instantly inspect 3D mockups before order release.</p>
                </div>
              </div>
              <Link href="/admin/catalog" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all">
                Try Studio →
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'claim' && (
          <div className="p-8 text-center bg-gradient-to-b from-purple-950/30 to-slate-950 rounded-xl border border-purple-500/30 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/40 animate-float">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">Digital Unboxing Experience</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Recipients receive magic links, unwrap digital gift boxes, choose their preferred reward within budget, and enter delivery info securely.
            </p>
            <Link href="/claim/CLAIM-SARAH-2026" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl shadow-purple-600/30">
              Experience Interactive Unboxing Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {activeTab === 'vendor' && (
          <div className="p-6 bg-slate-900/90 rounded-xl border border-emerald-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-mono font-bold text-emerald-400 text-sm">PO-849201 • Ekmatra Swag Studio</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Ready for Dispatch
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-400 block font-bold">Vector Logo Asset</span>
                <span className="text-indigo-400 font-mono">acme-logo-highres.svg</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg">
                <span className="text-slate-400 block font-bold">Greeting Note Print</span>
                <span className="text-purple-400 font-mono">card-sheet-print.txt</span>
              </div>
            </div>
            <Link href="/vendor" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20">
              Open Supplier Dashboard →
            </Link>
          </div>
        )}
      </div>

      {/* Feature Capabilities Grid */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-white">Built for Modern Enterprise Operations</h2>
          <p className="text-slate-400 text-xs">End-to-end automation across HR, Employees, and Logistics Suppliers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 space-y-4 hover:border-indigo-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">HRMS Automated Triggers</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Connect Workday, BambooHR, or Darwinbox. Birthday gifts, work anniversaries, and onboarding welcome kits trigger automatically with zero manual effort.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4 hover:border-purple-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">3D Logo & Merchandise Proofing</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Upload company logos and inspect high-resolution vector print proofs on hoodies, stainless tumblers, notebooks, and packaging boxes before dispatch.
            </p>
          </div>

          <div className="glass-card p-8 space-y-4 hover:border-emerald-500/60 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-lg">Confidential eGifting Links</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Eliminate outdated address spreadsheets. Recipients open a secure magic link, pick their gift within budget, and submit their confidential shipping details.
            </p>
          </div>
        </div>
      </div>

      {/* Supplier Ecosystem Showcase */}
      <div className="glass-card p-8 border-slate-800 text-center space-y-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Integrated Global Supplier & Procurement Network
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 transition-all">
            <span className="font-black text-indigo-400 block text-xl">Dealberg</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Procurement & Tech Swag</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-pink-500/50 transition-all">
            <span className="font-black text-pink-400 block text-xl">Zestta Delights</span>
            <span className="text-[11px] text-slate-400 mt-1 block">FNP Gourmet Hampers</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 transition-all">
            <span className="font-black text-purple-400 block text-xl">Ekmatra</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Custom Merchandise Studio</span>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all">
            <span className="font-black text-emerald-400 block text-xl">CorporateGift.com</span>
            <span className="text-[11px] text-slate-400 mt-1 block">Global eGifting Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
}
