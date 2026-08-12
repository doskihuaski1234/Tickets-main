import React, { useState } from 'react';
import { authService } from '../services/api';

interface UsuarioForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'tecnico';
}

const initialForm: UsuarioForm = {
  name: '',
  email: '',
  password: '',
  role: 'tecnico',
};

export const Usuarios: React.FC = () => {
  const [form, setForm] = useState<UsuarioForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (field: keyof UsuarioForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const token = localStorage.getItem('token');

    if (!token) {
      setError('No hay sesión activa');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.createUser({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      }, token);

      setMessage(data.message || 'Usuario creado correctamente');
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Administración</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Usuarios</h2>
        <p className="mt-2 text-sm text-slate-500">Crea nuevas cuentas para usuarios o técnicos desde la base de datos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Nombre completo</label>
          <input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Ej. Juan Pérez"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="usuario@correo.com"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="••••••••"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Rol</label>
          <select
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {message && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Creando usuario...' : 'Crear usuario'}
        </button>
      </form>
    </div>
  );
};

export default Usuarios;
