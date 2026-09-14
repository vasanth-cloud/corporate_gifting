'use client';

import React, { useState } from 'react';
import { db } from '../../lib/db';
import { Order, OrderStatus } from '../../lib/types';
import StatusBadge from '../../components/StatusBadge';
import { Package, Download, Truck, FileText, CheckCircle2, Building, RefreshCw } from 'lucide-react';

export default function VendorPortalPage() {
  const [orders, setOrders] = useState<Order[]>(db.getOrders());
  const [selectedVendor, setSelectedVendor] = useState<string>('All');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Status update form states
  const [courierName, setCourierName] = useState('FedEx Express');
  const [trackingNumber, setTrackingNumber] = useState('');

  const vendors = ['All', 'Ekmatra Swag Studio', 'Zestta Delights', 'Dealberg Tech Procurement', 'CorporateGift.com'];

  const filteredOrders = orders.filter((o) => selectedVendor === 'All' || o.vendorName === selectedVendor);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = db.updateOrderStatus(
      orderId,
      newStatus,
      newStatus === 'Shipped' ? courierName : undefined,
      newStatus === 'Shipped' ? (trackingNumber || `TRACK-${Math.floor(100000 + Math.random() * 900000)}`) : undefined
    );
    setOrders([...db.getOrders()]);
    setUpdatingOrderId(null);
  };

  const handleDownloadAsset = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 border-emerald-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Package className="w-3.5 h-3.5" />
            Supplier & Fulfillment Network Portal
          </div>
          <h1 className="text-2xl font-bold text-white">Vendor Fulfillment Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Receive purchase orders, download branding vector assets, print greeting cards, and submit dispatch tracking numbers.
          </p>
        </div>

        {/* Vendor Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
          <Building className="w-4 h-4 text-emerald-400" />
          <select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
            className="bg-transparent text-xs font-bold text-white focus:outline-none"
          >
            {vendors.map((v) => (
              <option key={v} value={v} className="bg-slate-900 text-white">
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Queue */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-indigo-400" /> Dispatch & Production Queue
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="glass-card p-6 border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-indigo-400 text-base">{order.id}</span>
                    <StatusBadge status={order.status} />
                    <span className="text-xs font-semibold text-slate-400">Vendor: {order.vendorName}</span>
                  </div>
                  <h3 className="font-bold text-white text-lg mt-1">{order.giftItem.name}</h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Payout Amount</span>
                  <span className="font-black text-emerald-400 text-lg">${order.giftItem.price}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                {/* Recipient & Shipping Details */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-indigo-400 uppercase tracking-wider">Shipping Destination</h4>
                  <p className="font-semibold text-white">{order.recipientName}</p>
                  <p className="text-slate-400">{order.shippingAddress.street}</p>
                  <p className="text-slate-400">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="text-slate-500 font-semibold">{order.shippingAddress.country}</p>
                  <p className="text-slate-400 font-mono">Tel: {order.shippingAddress.phone}</p>
                </div>

                {/* Print & Kitting Specs */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-purple-400 uppercase tracking-wider">Kitting & Branding Specs</h4>
                  {order.selectedSize && (
                    <p className="text-slate-300">
                      <strong>Apparel Size:</strong> {order.selectedSize}
                    </p>
                  )}
                  {order.selectedColor && (
                    <p className="text-slate-300">
                      <strong>Product Color:</strong> {order.selectedColor}
                    </p>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={() =>
                        handleDownloadAsset(
                          `${order.id}-company-logo-vector.svg`,
                          `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100"><rect width="100%" height="100%" fill="#4f46e5"/><text x="50%" y="50%" fill="#fff" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle">ACME CORP LOGO</text></svg>`
                        )
                      }
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-indigo-400" /> Vector Logo Asset (.SVG)
                      </span>
                      <span className="text-[10px] text-slate-400">Vector HD</span>
                    </button>

                    <button
                      onClick={() =>
                        handleDownloadAsset(
                          `${order.id}-personalized-card-print.txt`,
                          `PERSONALIZED GREETING CARD PRINT SHEET\nOrder ID: ${order.id}\nRecipient: ${order.recipientName}\n----------------------------------------\nMessage: Thank you for your hard work and dedication to our team!\nFrom: Acme Corp Executive Team`
                        )
                      }
                      className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-between transition-all"
                    >
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-purple-400" /> Greeting Card Sheet
                      </span>
                      <span className="text-[10px] text-slate-400">Print Ready</span>
                    </button>
                  </div>
                </div>

                {/* Dispatch Controls */}
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                  <h4 className="font-bold text-emerald-400 uppercase tracking-wider">Fulfillment Action</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'In Production')}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${
                        order.status === 'In Production'
                          ? 'bg-purple-600/30 text-purple-300 border border-purple-500'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      Mark "In Production / Kitting"
                    </button>

                    {updatingOrderId === order.id ? (
                      <div className="p-3 bg-slate-950 rounded-lg space-y-2 border border-indigo-500/40">
                        <label className="text-[10px] text-slate-400 block font-bold">Courier Name</label>
                        <input
                          type="text"
                          value={courierName}
                          onChange={(e) => setCourierName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                        />

                        <label className="text-[10px] text-slate-400 block font-bold">Tracking Number</label>
                        <input
                          type="text"
                          placeholder="e.g. FX-9849201"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-white text-xs"
                        />

                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'Shipped')}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                          >
                            Confirm Shipped
                          </button>
                          <button
                            onClick={() => setUpdatingOrderId(null)}
                            className="px-2 py-1.5 bg-slate-800 text-slate-400 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setUpdatingOrderId(order.id)}
                        className={`w-full py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          order.status === 'Shipped' || order.status === 'Delivered'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5" />
                        {order.status === 'Shipped' || order.status === 'Delivered'
                          ? `Shipped via ${order.courierName || 'Courier'}`
                          : 'Ship & Submit Tracking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
