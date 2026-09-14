'use client';

import { db } from '@/lib/db';
import StatusBadge from '@/components/StatusBadge';
import { Package, Truck, ExternalLink } from 'lucide-react';

export default function OrdersPage() {
  const orders = db.getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Full Order History & Logistics Tracking</h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor dispatch status across global fulfillment vendors (Dealberg, Zestta, Ekmatra).
        </p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Recipient Info</th>
                <th className="p-4">Gift Selected</th>
                <th className="p-4">Shipping Destination</th>
                <th className="p-4">Fulfillment Vendor</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tracking Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono">
                    <span className="font-bold text-indigo-400 block">{o.id}</span>
                    <span className="text-[11px] text-slate-500">{o.createdAt}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{o.recipientName}</div>
                    <div className="text-[11px] text-slate-400">{o.recipientEmail}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-white">{o.giftItem.name}</div>
                    {o.selectedSize && (
                      <div className="text-[11px] text-purple-300">
                        Variant: {o.selectedSize} / {o.selectedColor}
                      </div>
                    )}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="text-slate-300 leading-tight">
                      {o.shippingAddress.street}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.zipCode}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold">{o.shippingAddress.country}</div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">{o.vendorName}</td>
                  <td className="p-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="p-4">
                    {o.trackingNumber ? (
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="inline-flex items-center gap-1 font-mono text-indigo-400 hover:underline font-bold text-[11px]"
                      >
                        {o.trackingNumber} <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-slate-500 italic">Pending Courier Dispatch</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
