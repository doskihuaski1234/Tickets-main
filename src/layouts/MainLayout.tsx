import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import type { TabType } from '../types/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
}

export default function MainLayout({
  children,
  currentTab,
  setCurrentTab,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setCurrentTab(tab);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      
      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[270px] transform bg-slate-50 transition-transform duration-300 lg:static lg:block lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
        />
      </aside>

      <div className="min-w-0 flex-1">
        <Navbar
          user={null}
          onLogout={() => {}}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="page-content min-w-0 px-3 py-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}