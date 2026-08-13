import React from 'react';

interface NavbarProps {
  user: { name: string; email: string; role: string } | null;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onMenuClick,
}) => {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1700px] items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">

        {/* Lado izquierdo */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* Botón hamburguesa para móvil */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-100 active:scale-95 lg:hidden"
            aria-label="Abrir menú"
            title="Abrir menú"
          >
            <span className="text-2xl leading-none">☰</span>
          </button>

          {/* Logo */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-blue-600 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
            T
          </div>

          {/* Nombre del sistema */}
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px] sm:tracking-[0.24em]">
              Tickets
            </p>

            <h2 className="truncate text-sm font-bold text-slate-800 sm:text-base">
              OCP Tech
            </h2>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">

          {/* Usuario: visible desde tablet */}
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-right md:block">
            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
              Usuario
            </p>

            <p className="max-w-[180px] truncate text-sm font-semibold text-slate-700">
              {user?.name || 'Usuario'}
            </p>
          </div>

          {/* Rol */}
          <div className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 sm:block">
            {user?.role || 'user'}
          </div>

          {/* Botón salir */}
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:px-3 sm:text-sm"
          >
            Salir
          </button>
        </div>

      </div>
    </nav>
  );
};