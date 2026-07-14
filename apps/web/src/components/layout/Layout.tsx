import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { SiteSetting } from '@/types';

export default function Layout({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings?: SiteSetting | null;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      <Navbar settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
