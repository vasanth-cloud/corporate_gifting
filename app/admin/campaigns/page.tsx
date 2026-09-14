'use client';

import React, { useState } from 'react';
import { db } from '../../../lib/db';
import { Campaign } from '../../../lib/types';
import { Plus, Sparkles, Copy, Check, Link2, Building, Send } from 'lucide-react';

export default function CampaignsPage() {
  const companies = db.getCompanies();
  const [campaigns, setCampaigns] = useState<Campaign[]>(db.getCampaigns());
  const [showModal, setShowModal] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Form State
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0].id);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Campaign['type']>('Anniversary');
  const [budgetPerRecipient, setBudgetPerRecipient] = useState(100);
  const [totalRecipients, setTotalRecipients] = useState(25);
  const [customMessage, setCustomMessage] = useState('');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customMessage) return;

    const company = companies.find(c => c.id === selectedCompanyId) || companies[0];

    const newCampaign: Campaign = {
      id: `camp-${Date.now()}`,
      companyId: company.id,
      companyName: company.name,
      title,
      type,
      budgetPerRecipient,
      allowedCategories: ['Swag', 'Electronics', 'Hampers', 'Gift Card'],
      totalRecipients,
      claimedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      customMessage,
      companyLogoUrl: company.logoUrl,
      status: 'Active',
    };

    db.addCampaign(newCampaign);
    setCampaigns(db.getCampaigns());
    setShowModal(false);
    
    // Reset form
    setTitle('');
    setCustomMessage('');
  };

  const copyClaimLink = (token: string) => {
    const fullUrl = `${window.location.origin}/claim/${token}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaign Management & Magic Links</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated triggers or manual recipient links across all corporate accounts.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          Create New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="glass-card p-6 space-y-4 border-slate-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {c.type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded">
                    {c.companyName}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${c.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  {c.status}
                </span>
              </div>

              <h3 className="font-bold text-white text-lg">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed italic">"{c.customMessage}"</p>

              <div className="grid grid-cols-2 gap-4 py-2 text-xs border-y border-slate-800">
                <div>
                  <span className="text-slate-500 block">Budget Per Recipient</span>
                  <span className="text-emerald-400 font-extrabold text-sm">${c.budgetPerRecipient}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Total Recipients</span>
                  <span className="text-white font-extrabold text-sm">{c.totalRecipients} Employees</span>
                </div>
              </div>
            </div>

            {/* Test Magic Link Action */}
            <div className="pt-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Link2 className="w-3.5 h-3.5 text-indigo-400" /> Demo Recipient Magic Token
                </span>
                <span className="font-mono text-indigo-300 font-bold text-[11px]">CLAIM-SARAH-2026</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyClaimLink('CLAIM-SARAH-2026')}
                  className="flex-1 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                >
                  {copiedToken === 'CLAIM-SARAH-2026' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied Link!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Magic Link
                    </>
                  )}
                </button>

                <a
                  href="/claim/CLAIM-SARAH-2026"
                  target="_blank"
                  rel="noreferrer"
                  className="py-1.5 px-3 rounded bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  Launch Demo <Send className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating Campaign */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card max-w-lg w-full p-6 space-y-5 border-indigo-500/40">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Create Corporate Campaign
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1 bg-slate-800 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Corporate Tenant</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2">
                  <Building className="w-4 h-4 text-indigo-400" />
                  <select
                    value={selectedCompanyId}
                    onChange={(e) => setSelectedCompanyId(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none"
                  >
                    {companies.map((comp) => (
                      <option key={comp.id} value={comp.id} className="bg-slate-900 text-white">
                        {comp.name} ({comp.employeeCount} employees)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Leadership Recognition Gifts"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Anniversary">Work Anniversary</option>
                    <option value="Onboarding">New Hire Onboarding</option>
                    <option value="Festival">Festival Celebration</option>
                    <option value="Client Appreciation">Client Appreciation</option>
                    <option value="Sales Reward">Sales Incentive</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Budget Per Recipient ($)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={budgetPerRecipient}
                    onChange={(e) => setBudgetPerRecipient(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Estimated Recipients Count</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={totalRecipients}
                  onChange={(e) => setTotalRecipients(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Personalized Employer Greeting</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter message shown to employees during digital unboxing..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
                >
                  Launch Campaign & Generate Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
