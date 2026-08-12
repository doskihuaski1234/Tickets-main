import React, { useState } from 'react';
import { authService } from '../services/api';

interface LoginPageProps {
  onLogin: (token: string, user: { email: string; role: string; name: string }) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const clearAlerts = () => {
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearAlerts();

    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.token, data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo para recuperar la contraseña');
      return;
    }

    setRecovering(true);
    clearAlerts();

    try {
      const data = await authService.forgotPassword(email);
      setMessage(data.message || 'Se ha enviado la solicitud de recuperación');
      setShowRecovery(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la recuperación');
    } finally {
      setRecovering(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) {
      setError('Completa el token y la nueva contraseña');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setResettingPassword(true);
    clearAlerts();

    try {
      const data = await authService.resetPassword(resetToken, newPassword);
      setMessage(data.message || 'Contraseña actualizada correctamente');
      setShowRecovery(false);
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo restablecer la contraseña');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl shadow-slate-950/60 lg:grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden bg-gradient-to-br from-slate-800 via-slate-900 to-blue-700 p-8 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.35),transparent_35%)]" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/80 text-sm font-bold text-white">T</div>
              <span className="text-xs font-semibold tracking-[0.28em] uppercase">Tickets</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight">Tickets de OCP Tech</h1>
            <p className="mt-4 max-w-sm text-sm text-slate-200">
              Gestión segura y ordenada de servicios, incidencias y seguimiento técnico.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">Acceso</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-900">
                {showRecovery ? 'Recuperar contraseña' : 'Iniciar sesión'}
              </h2>
            </div>

            {!showRecovery ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                {message && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Ingresando...' : 'Iniciar sesión'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setShowRecovery(true);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            ) : (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Correo electrónico</label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    type="email"
                    placeholder="nombre@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={recovering}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {recovering ? 'Enviando token...' : 'Enviar token de recuperación'}
                </button>

                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Token recibido</label>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      type="text"
                      placeholder="Pega el token de tu correo"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Nueva contraseña</label>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      type="password"
                      placeholder="Nueva contraseña"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">Confirmar contraseña</label>
                    <input
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      type="password"
                      placeholder="Confirma tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                  {message && <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{message}</p>}

                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={resettingPassword}
                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {resettingPassword ? 'Actualizando...' : 'Guardar nueva contraseña'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setShowRecovery(false);
                  }}
                  className="w-full text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  ← Volver al inicio de sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
