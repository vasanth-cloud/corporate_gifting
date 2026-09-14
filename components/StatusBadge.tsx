import React from 'react';
import { OrderStatus } from '../lib/types';
import { Clock, CheckCircle2, Truck, PackageCheck, Sparkles } from 'lucide-react';

interface StatusBadgeProps {
  status: OrderStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3.5 h-3.5" />
          Pending Approval
        </span>
      );
    case 'Logo Approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          Branding Ready
        </span>
      );
    case 'In Production':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
          <CheckCircle2 className="w-3.5 h-3.5" />
          In Production / Kitting
        </span>
      );
    case 'Shipped':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Truck className="w-3.5 h-3.5" />
          Shipped & In Transit
        </span>
      );
    case 'Delivered':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <PackageCheck className="w-3.5 h-3.5" />
          Delivered
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">
          {status}
        </span>
      );
  }
}
