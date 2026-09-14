'use client';

import React, { useState, useEffect } from 'react';
import { db, MOCK_GIFTS } from '../../../lib/db';
import { GiftItem, ClaimToken, Order } from '../../../lib/types';
import UnboxingExperience from '../../../components/UnboxingExperience';
import StatusBadge from '../../../components/StatusBadge';
import { Gift, CheckCircle2, Truck, Sparkles, MapPin, Package, ShieldCheck, ArrowRight } from 'lucide-react';

interface ClaimClientProps {
  token: string;
}

export default function ClaimClientComponent({ token }: ClaimClientProps) {
  const [tokenData, setTokenData] = useState<ClaimToken | null>(null);
  const [step, setStep] = useState<'unboxing' | 'catalog' | 'address' | 'confirmation'>('unboxing');
  const [selectedGift, setSelectedGift] = useState<GiftItem | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Address Form State
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (token) {
      const data = db.getToken(token);
      if (data) {
        setTokenData(data);
        if (data.claimed && data.orderId) {
          const existingOrder = db.getOrders().find((o) => o.id === data.orderId);
          if (existingOrder) {
            setSubmittedOrder(existingOrder);
            setStep('confirmation');
          }
        }
      } else {
        // Fallback sample token
        setTokenData({
          token,
          companyId: 'comp-1',
          campaignId: 'camp-1',
          recipientName: 'Sarah Jenkins',
          recipientEmail: 'sarah.j@acmecorp.com',
          companyName: 'Acme Corporation',
          budget: 100,
          claimed: false,
        });
      }
    }
  }, [token]);

  if (!tokenData) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Loading gift claim invitation...</p>
      </div>
    );
  }

  const campaignGifts = MOCK_GIFTS.filter((g) => g.price <= tokenData.budget);

  const handleGiftSelect = (gift: GiftItem) => {
    setSelectedGift(gift);
    if (gift.options?.sizes) setSelectedSize(gift.options.sizes[0]);
    if (gift.options?.colors) setSelectedColor(gift.options.colors[0]);
    setStep('address');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;

    const newOrder = db.createOrder({
      companyId: tokenData.companyId,
      claimToken: tokenData.token,
      campaignTitle: 'Corporate Milestone Celebration',
      recipientName: tokenData.recipientName,
      recipientEmail: tokenData.recipientEmail,
      giftItem: selectedGift,
      selectedSize,
      selectedColor,
      shippingAddress: {
        street,
        city,
        state: stateVal,
        zipCode,
        country,
        phone,
      },
      customLogoUrl: 'https://placehold.co/200x60/indigo/white?text=ACME+CORP',
      vendorName: selectedGift.vendorName,
    });

    setSubmittedOrder(newOrder);
    setStep('confirmation');
  };

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Progress Header */}
      <div className="flex items-center justify-between glass-card p-4 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
            {tokenData.companyName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-white text-sm block">{tokenData.companyName} Gift Portal</span>
            <span className="text-[11px] text-slate-400">Recipient: {tokenData.recipientName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className={`px-3 py-1 rounded-full ${step === 'unboxing' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}>1. Unwrap</span>
          <span className="text-slate-600">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 'catalog' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}>2. Choose</span>
          <span className="text-slate-600">→</span>
          <span className={`px-3 py-1 rounded-full ${step === 'address' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}>3. Address</span>
        </div>
      </div>

      {/* Step 1: Unboxing Experience */}
      {step === 'unboxing' && (
        <UnboxingExperience
          recipientName={tokenData.recipientName}
          companyName={tokenData.companyName}
          customMessage="Thank you for your outstanding contributions, dedication, and teamwork! Please pick your reward."
          budget={tokenData.budget}
          onUnwrapped={() => setStep('catalog')}
        />
      )}

      {/* Step 2: Gift Selection Catalog */}
      {step === 'catalog' && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white">Select Your Gift Choice</h2>
            <p className="text-xs text-slate-400">
              You are eligible to select any gift below (Budget tier: ${tokenData.budget}). Fully covered by {tokenData.companyName}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaignGifts.map((gift) => (
              <div
                key={gift.id}
                className="glass-card overflow-hidden flex flex-col justify-between border-slate-800 hover:border-indigo-500/60 transition-all duration-300 group"
              >
                <div>
                  <div className="relative aspect-video overflow-hidden bg-slate-950">
                    <img
                      src={gift.image}
                      alt={gift.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-950/80 backdrop-blur text-indigo-400 border border-indigo-500/30">
                      {gift.category}
                    </span>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-white text-base leading-snug">{gift.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3">{gift.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleGiftSelect(gift)}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    Select This Gift <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Address & Options Input */}
      {step === 'address' && selectedGift && (
        <div className="max-w-xl mx-auto glass-card p-6 space-y-6 border-indigo-500/30">
          <div>
            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider block mb-1">Final Step</span>
            <h2 className="text-xl font-bold text-white">Delivery Address & Custom Preferences</h2>
          </div>

          {/* Selected Gift Summary */}
          <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <img src={selectedGift.image} alt={selectedGift.name} className="w-16 h-16 object-cover rounded-lg" />
            <div>
              <h4 className="font-bold text-white text-sm">{selectedGift.name}</h4>
              <p className="text-xs text-emerald-400 font-semibold mt-0.5">Complimentary Reward ($0 cost to you)</p>
            </div>
          </div>

          <form onSubmit={handleAddressSubmit} className="space-y-4">
            {/* Options Selection if available */}
            {selectedGift.options?.sizes && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Size</label>
                <div className="flex gap-2">
                  {selectedGift.options.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedSize === s
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedGift.options?.colors && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Color</label>
                <div className="flex gap-2">
                  {selectedGift.options.colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        selectedColor === c
                          ? 'bg-purple-600 text-white border-purple-500'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Address Inputs */}
            <div className="space-y-3 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Confidential Shipping Address
              </h4>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123 Tech Blvd, Suite 400"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Austin"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    placeholder="TX"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Zip / Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="78701"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Phone (For Courier Delivery)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (512) 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('catalog')}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ← Back to catalog
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-xs shadow-xl shadow-indigo-500/25 flex items-center gap-2"
              >
                Confirm & Dispatch Gift <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Order Confirmation & Live Tracking */}
      {step === 'confirmation' && submittedOrder && (
        <div className="max-w-xl mx-auto glass-card p-8 text-center space-y-6 border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">Gift Claim Confirmed!</h2>
            <p className="text-xs text-slate-400 mt-1">
              Your gift choice has been submitted to <strong className="text-slate-200">{submittedOrder.vendorName}</strong> for branding & fulfillment.
            </p>
          </div>

          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400">Order ID:</span>
              <span className="font-mono font-bold text-indigo-400 text-sm">{submittedOrder.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Status:</span>
              <StatusBadge status={submittedOrder.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Item:</span>
              <span className="text-xs font-bold text-white">{submittedOrder.giftItem.name}</span>
            </div>
            {submittedOrder.trackingNumber && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Courier Tracking:</span>
                <span className="font-mono text-indigo-300 font-bold text-xs">{submittedOrder.courierName} ({submittedOrder.trackingNumber})</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-500">
            You will receive shipping status updates at <strong className="text-slate-300">{submittedOrder.recipientEmail}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
