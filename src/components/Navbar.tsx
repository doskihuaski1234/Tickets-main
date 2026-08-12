import React from 'react';

interface NavbarProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            T
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Tickets</p>
            <h2 className="text-sm font-bold text-slate-800 sm:text-base">OCP Tech</h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-right sm:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Usuario</p>
            <p className="text-sm font-semibold text-slate-700">{user?.name || 'Usuario'}</p>
          </div>
          <div className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:block">
            {user?.role || 'user'}
          </div>
          <button
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};