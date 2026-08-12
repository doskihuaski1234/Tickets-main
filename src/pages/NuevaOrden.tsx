import React, { useState } from 'react';
import type { Ticket } from '../types/tickets';
import { GUATEMALA_DATA, EMPRESAS } from '../data/ubicaciones';

interface NuevaOrdenProps {
  onAddTicket: (ticket: Ticket) => void;
}

export const NuevaOrden: React.FC<NuevaOrdenProps> = ({ onAddTicket }) => {
  const [loading, setLoading] = useState(false);
  const [departamento, setDepartamento] = useState('');
  const [municipio, setMunicipio] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    empresa: '',
    sucursal: '',
    calleAvenida: '',
    zona: ''
  });

  // 🌍 Geocoding directo (SIN importar MAPBOX_TOKEN)
  const getCoordinates = async (query: string) => {
    try {
      const token = import.meta.env.VITE_MAPBOX_TOKEN;

      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${token}&limit=1`
      );

      const data = await res.json();

      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng };
      }
    } catch (err) {
      console.error('Error geocoding:', err);
    }

    // fallback Guatemala centro
    return { lat: 14.6349, lng: -90.5069 };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const query = `${formData.calleAvenida}, ${formData.zona}, ${municipio}, ${departamento}, Guatemala`;

    const { lat, lng } = await getCoordinates(query);

    const nuevo: Ticket = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      status: 'abierto',
      createdAt: new Date().toISOString(),

      empresa: formData.empresa,
      sucursal: formData.sucursal,
      departamento,
      municipio,
      direccion: query,

      lat,
      lng
    };

    onAddTicket(nuevo);

    setLoading(false);

    // reset form
    setFormData({
      title: '',
      description: '',
      empresa: '',
      sucursal: '',
      calleAvenida: '',
      zona: ''
    });

    setDepartamento('');
    setMunicipio('');
  };

  return (
    <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_15px_35px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Operación</p>
        <h2 className="mt-1 text-2xl font-bold text-slate-800">Nueva Orden</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Título</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Título"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Descripción</label>
          <textarea
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Descripción"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Empresa</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            value={formData.empresa}
            onChange={e => setFormData({ ...formData, empresa: e.target.value })}
            required
          >
            <option value="">Selecciona</option>
            {EMPRESAS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Sucursal</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Sucursal"
            value={formData.sucursal}
            onChange={e => setFormData({ ...formData, sucursal: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Departamento</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            value={departamento}
            onChange={e => {
              setDepartamento(e.target.value);
              setMunicipio('');
            }}
            required
          >
            <option value="">Selecciona</option>
            {Object.keys(GUATEMALA_DATA).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Municipio</label>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            value={municipio}
            onChange={e => setMunicipio(e.target.value)}
            required
            disabled={!departamento}
          >
            <option value="">Selecciona</option>
            {departamento &&
              GUATEMALA_DATA[departamento].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Calle / Avenida</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Calle / Avenida"
            value={formData.calleAvenida}
            onChange={e => setFormData({ ...formData, calleAvenida: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Zona</label>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
            placeholder="Zona"
            value={formData.zona}
            onChange={e => setFormData({ ...formData, zona: e.target.value })}
            required
          />
        </div>

        <div className="md:col-span-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-slate-900 to-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_15px_30px_rgba(15,23,42,0.18)] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Procesando ubicación...' : 'Crear Ticket'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevaOrden;