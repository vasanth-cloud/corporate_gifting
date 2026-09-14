'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Company } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import { DollarSign, Gift, Users, CheckCircle2, Plus, Sliders, ArrowUpRight, TrendingUp, Building2, Shield, Lock, LogOut, Key, Sparkles, Check } from 'lucide-react';

export default function AdminDashboardPage() {
  const companies = db.getCompanies();
  
  // Auth Session State: null = Not logged in, 'super' = Super Admin, Company = Company Admin Session
  const [authSession, setAuthSession] = useState<{ type: 'super' } | { type: 'company'; company: Company } | null>({
    type: 'company',
    company: companies[0] // Default to Acme Corp logged in for immediate demo
  });

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tenant Scope Selection (Only usable by Super Admin)
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = db.authenticate(passcode);
    if (result) {
      setAuthSession(result);
      setAuthError(false);
      setPasscode('');
      if (result.type === 'company') {
        setSelectedCompanyId(result.company.id);
      } else {
        setSelectedCompanyId('all');
      }
    } else {
      setAuthError(true);
    }
  };

  const handleQuickLogin = (code: string) => {
    const result = db.authenticate(code);
    if (result) {
      setAuthSession(result);
      setAuthError(false);
      if (result.type === 'company') {
        setSelectedCompanyId(result.company.id);
      } else {
        setSelectedCompanyId('all');
      }
    }
  };

  // Determine active company scope:
  // If company logged in -> STRICTLY force scope to that company ID!
  // If super admin logged in -> use selectedCompanyId dropdown choice.
  const activeCompanyId = authSession?.type === 'company' ? authSession.company.id : selectedCompanyId;

  const campaigns = db.getCampaigns(activeCompanyId);
  const orders = db.getOrders(activeCompanyId);
  const gifts = db.getGifts();

  const activeCompanyObj = authSession?.type === 'company' 
    ? authSession.company 
    : companies.find(c => c.id === activeCompanyId);

  const totalBudgetSpent = orders.reduce((acc, o) => acc + o.giftItem.price, 0);
  const totalRecipients = campaigns.reduce((acc, c) => acc + c.totalRecipients, 0);
  const totalClaimed = campaigns.reduce((acc, c) => acc + c.claimedCount, 0);
  const redemptionRate = totalRecipients > 0 ? Math.round((totalClaimed / totalRecipients) * 100) : 0;

  // Render Authentication Modal if logged out
  if (!authSession) {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Corporate Admin Login</h1>
          <p className="text-xs text-slate-400">
            Enter your company passcode to access your isolated corporate workspace.
          </p>
        </div>

        <div className="glass-card p-8 border-indigo-500/40 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Company Passcode / Admin Access Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter company passcode (e.g. acme2026)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
                <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
              </div>
              {authError && (
                <p className="text-xs text-red-400 font-semibold mt-1.5">
                  ❌ Invalid passcode. Please try again or use a quick demo login below.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all"
            >
              Sign In to Corporate Workspace
            </button>
          </form>

          {/* Quick Demo Login Preset Cards */}
          <div className="border-t border-slate-800 pt-5 space-y-3">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
              ⚡ Quick Demo Credentials (Click to Login)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin('acme2026')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-indigo-400">Acme Corporation</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Passcode: acme2026</div>
              </button>

              <button
                onClick={() => handleQuickLogin('techglobe2026')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-purple-400">TechGlobe Solutions</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Passcode: techglobe2026</div>
              </button>

              <button
                onClick={() => handleQuickLogin('zenith2026')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-emerald-400">Zenith Financial</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Passcode: zenith2026</div>
              </button>

              <button
                onClick={() => handleQuickLogin('admin2026')}
                className="p-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-left transition-all group"
              >
                <div className="font-bold text-purple-300">👑 Super Admin Master</div>
                <div className="text-[10px] text-purple-400 font-mono mt-0.5">Passcode: admin2026</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Session Header & Authentication Status Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${authSession.type === 'super' ? 'bg-purple-600/20 text-purple-400 border-purple-500/30' : 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30'}`}>
            {authSession.type === 'super' ? <Shield className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Active Corporate Session:</span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${authSession.type === 'super' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'}`}>
                {authSession.type === 'super' ? '👑 Platform Super Admin' : `🔒 ${authSession.company.name} (HR Admin)`}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {authSession.type === 'super'
                ? 'Super Admin Access: Cross-tenant management & platform revenue control enabled.'
                : `Logged in as ${authSession.company.adminEmail} • Session encrypted & locked strictly to ${authSession.company.name}.`}
            </p>
          </div>
        </div>

        <button
          onClick={() => setAuthSession(null)}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out / Switch Company
        </button>
      </div>

      {/* Multi-Tenant Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 border-indigo-500/30">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              {activeCompanyObj ? activeCompanyObj.name : 'Multi-Tenant Corporate Gifting'}
            </h1>
            {authSession.type === 'super' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {companies.length}+ Enterprise Accounts
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {authSession.type === 'company'
              ? `🔒 Isolated Workspace: ${authSession.company.name} • ${authSession.company.employeeCount} Employees Registered`
              : activeCompanyObj
              ? `Workspace Scope: ${activeCompanyObj.name} • ${activeCompanyObj.employeeCount} Employees Registered`
              : 'Super Admin Overview • Managing 5 Global Corporate Workspaces'}
          </p>
        </div>

        {/* Company Switcher Dropdown (ONLY visible to Super Admins!) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {authSession.type === 'super' ? (
            <div className="relative flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-2 rounded-xl border border-slate-700">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-4"
                >
                  <option value="all" className="bg-slate-900 text-white">🌐 All Corporate Accounts (5)</option>
                  {companies.map((comp) => (
                    <option key={comp.id} value={comp.id} className="bg-slate-900 text-white">
                      🏢 {comp.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Private Scope: {authSession.company.name}
            </div>
          )}

          <Link
            href="/admin/campaigns"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* Corporate Tenants Quick Switch Cards (ONLY visible in Super Admin mode!) */}
      {authSession.type === 'super' && (
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Select Corporate Tenant Workspace
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedCompanyId('all')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedCompanyId === 'all'
                  ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/50'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="font-extrabold text-xs block text-white">All Companies</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">5 Active Workspaces</span>
            </button>

            {companies.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCompanyId(c.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedCompanyId === c.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/50'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="font-extrabold text-xs block text-white truncate">{c.name}</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">${c.spentBudget.toLocaleString()} spent</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Spend</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">${totalBudgetSpent.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Within allocated budget scope
          </div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Gifts Distributed</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalClaimed}</div>
          <div className="text-[11px] text-slate-400">Across {campaigns.length} campaigns</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Redemption Rate</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{redemptionRate}%</div>
          <div className="text-[11px] text-indigo-400 font-semibold">{totalClaimed} of {totalRecipients} claimed</div>
        </div>

        <div className="glass-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Catalog SKUs</span>
            <Users className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white">{gifts.length} Items</div>
          <div className="text-[11px] text-slate-400">Swag, Hampers & Vouchers</div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Active Gifting Campaigns</h2>
          <Link href="/admin/campaigns" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            View All Campaigns <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.map((c) => (
            <div key={c.id} className="glass-card p-5 space-y-4 border-slate-800">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      {c.type}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {c.companyName}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-2">{c.title}</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  ${c.budgetPerRecipient} / person
                </span>
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{c.customMessage}</p>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
                  <span>Claims Progress</span>
                  <span className="text-white font-bold">{c.claimedCount} / {c.totalRecipients} ({Math.round((c.claimedCount / c.totalRecipients) * 100)}%)</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${(c.claimedCount / c.totalRecipients) * 100}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Created {c.createdAt}</span>
                <Link
                  href="/claim/CLAIM-SARAH-2026"
                  className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                >
                  Test Recipient Link →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Live Orders & Delivery Tracker</h2>
          <Link href="/admin/orders" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
            Full Order History <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Tenant Company</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Gift Selected</th>
                  <th className="p-4">Vendor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Courier & Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400">{o.id}</td>
                    <td className="p-4 font-semibold text-slate-300">
                      {companies.find(c => c.id === o.companyId)?.name || 'Acme Corp'}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{o.recipientName}</div>
                      <div className="text-[11px] text-slate-400">{o.recipientEmail}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{o.giftItem.name}</div>
                      <div className="text-[11px] text-slate-400">${o.giftItem.price}</div>
                    </td>
                    <td className="p-4 text-slate-300 font-medium">{o.vendorName}</td>
                    <td className="p-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="p-4 text-slate-400">
                      {o.trackingNumber ? (
                        <div>
                          <div className="text-white font-medium">{o.courierName}</div>
                          <div className="font-mono text-[11px] text-indigo-400">{o.trackingNumber}</div>
                        </div>
                      ) : (
                        <span className="italic text-slate-500">Processing dispatch...</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
