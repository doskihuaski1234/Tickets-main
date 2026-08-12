import React from 'react';
import type { TabType } from '../types/navigation';

interface SidebarProps {
  currentTab: TabType;
  setCurrentTab: (tab: TabType) => void;
  userRole?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  userRole,
}) => {

  const adminItems: { id: TabType; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tickets', label: 'Tickets' },
    { id: 'nueva-orden', label: 'Nueva orden' },
    { id: 'mapa', label: 'Mapa' },
    { id: 'hojas-servicio', label: 'Hojas de servicio' },
    { id: 'reportes', label: 'Centro de reportes' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'mi-perfil', label: 'Mi perfil' },
  ];

  const userItems: { id: TabType; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'mapa', label: 'Mapa' },
    { id: 'hojas-servicio', label: 'Hojas de servicio' },
    { id: 'mis-ordenes', label: 'Mis órdenes' },
    { id: 'reportes', label: 'Centro de reportes' },
    { id: 'mi-perfil', label: 'Mi perfil' },
  ];

  const visibleItems = userRole === 'admin' ? adminItems : userItems;

  const icons: Record<string, string> = {
    dashboard: '📊',
    tickets: '🎫',
    'nueva-orden': '➕',
    mapa: '📍',
    'hojas-servicio': '🧾',
    reportes: '📈',
    usuarios: '👥',
    'mi-perfil': '👤',
    'mis-ordenes': '🧭',
  };

  return (
    <aside className="h-full min-h-[calc(100vh-72px)] w-full border-r border-slate-200 bg-slate-50/80 p-3 lg:w-[270px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Navegación</p>
        <ul className="mt-3 space-y-2">
          {visibleItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setCurrentTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition-all ${
                  currentTab === item.id
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-base">
                  {icons[item.id] || '•'}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};