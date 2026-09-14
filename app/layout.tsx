import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../lib/ThemeContext';

export const metadata: Metadata = {
  title: 'GiftPulse | Corporate Gifting & Swag Automation Platform',
  description: 'Manage, customize, and automate employee & client gifting campaigns from a unified dashboard.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="border-t border-slate-900/40 py-6 text-center text-xs text-slate-500">
            <p>© 2026 GiftPulse Enterprise Platform. Built for modern corporate gifting & logistics.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
