'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift, Building2, Package, Sparkles, UserCheck, Sun, Moon, Palette } from 'lucide-react';
import { useTheme, ThemeMode } from '@/lib/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const links = [
    { href: '/', label: 'Home Overview', icon: Sparkles },
    { href: '/admin', label: 'HR / Corporate Admin', icon: Building2 },
    { href: '/claim/CLAIM-SARAH-2026', label: 'Recipient Experience', icon: UserCheck },
    { href: '/vendor', label: 'Vendor Portal', icon: Package },
  ];

  return (
    <header className="sticky top-0 z-50 nav-bg backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">GiftPulse</span>
            <span className="text-xs block text-slate-400 font-medium -mt-1">Corporate Automation</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href.split('?')[0]));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}

          {/* Theme Selector */}
          <div className="ml-2 pl-2 border-l border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setTheme('dark')}
              title="Midnight Dark Theme"
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                theme === 'dark' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTheme('light')}
              title="Corporate Light Theme"
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                theme === 'light' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>

            <button
              onClick={() => setTheme('emerald')}
              title="Emerald Executive Theme"
              className={`p-2 rounded-lg text-xs font-bold transition-all ${
                theme === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
