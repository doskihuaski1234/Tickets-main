import React from 'react';
import type { Ticket } from '../types/tickets';

interface DashboardProps {
  tickets: Ticket[];
}

export const Dashboard: React.FC<DashboardProps> = ({ tickets }) => {

  const abiertos = tickets.filter(t => t.status === 'abierto').length;
  const enProceso = tickets.filter(t => t.status === 'procesado').length;
  const cerrados = tickets.filter(t => t.status === 'cerrado').length;

  const stats = [
    { label: 'Abiertos', value: abiertos, color: 'bg-red-100 text-red-700', icon: '📌' },
    { label: 'En Proceso', value: enProceso, color: 'bg-blue-100 text-blue-700', icon: '⏳' },
    { label: 'Cerrados', value: cerrados, color: 'bg-green-100 text-green-700', icon: '✓' },
    { label: 'Total', value: tickets.length, color: 'bg-slate-100 text-slate-700', icon: '📊' },
  ];

  return (
    <div className="w-full space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_15px_35px_rgba(15,23,42,0.06)] sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Panel de Control</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold text-slate-800">{stat.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color}`}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Tickets recientes</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Últimos 5
          </span>
        </div>

        {tickets.length === 0 ? (
          <p className="text-slate-500">No hay tickets aún.</p>
        ) : (
          <div className="space-y-3">
            {tickets.slice(0, 5).map(ticket => (
              <div
                key={ticket.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{ticket.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{ticket.direccion || 'Sin dirección registrada'}</p>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      ticket.status === 'abierto'
                        ? 'bg-red-100 text-red-700'
                        : ticket.status === 'procesado'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.status === 'abierto'
                      ? 'Abierto'
                      : ticket.status === 'procesado'
                        ? 'En proceso'
                        : 'Cerrado'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;