import React, { useState } from 'react';
import type { Ticket } from '../types/tickets';

interface HojaServicioModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const HojaServicioModal: React.FC<HojaServicioModalProps> = ({ ticket, onClose }) => {
  // Estados basados exactamente en la Hoja de Servicio de Unicomer
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [hora, setHora] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [tecnico, setTecnico] = useState('');
  const [diagnostico, setDiagnostico] = useState('');
  const [resultado, setResultado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [encargadoTienda, setEncargadoTienda] = useState('');
  const [telefonoEmpresa, setTelefonoEmpresa] = useState(''); // Número de WhatsApp destino

  const handleEnviarWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tecnico.trim() || !diagnostico.trim() || !resultado.trim() || !encargadoTienda.trim() || !telefonoEmpresa.trim()) {
      alert('Por favor, completa los campos obligatorios para generar la hoja.');
      return;
    }

    // Limpiar el número de teléfono (quitar espacios o guiones si el usuario los pone)
    const numeroLimpio = telefonoEmpresa.replace(/\D/g, '');
    // Asegurar el código de país (502 para Guatemala) si no lo ingresaron
    const numeroDestino = numeroLimpio.startsWith('502') ? numeroLimpio : `502${numeroLimpio}`;

    // Estructurar el mensaje de texto con formato legible usando emojis
    const mensaje = `*📄 HOJA DE SERVICIO TÉCNICO*
----------------------------------------
*No. Ticket:* ${ticket.id}
*Fecha:* ${fecha}  |  *Hora:* ${hora}
*País:* Guatemala
*Cliente:* ${ticket.direccion.split('-')[0].trim()}
*Ubicación:* ${ticket.municipio}, ${ticket.departamento}
----------------------------------------
*🛠️ Técnico Encargado:* ${tecnico}

*📝 Descripción de la Incidencia:* ${ticket.description}

*🔍 Diagnóstico y Acciones Realizadas:* ${diagnostico}

*✅ Resultado y Estado Final:* ${resultado}

*💡 Observaciones y Recomendaciones:* ${observaciones || 'Ninguna.'}
----------------------------------------
*✍️ Firmas de Conformidad:*
• Técnico: ${tecnico}
• Encargado en Tienda: ${encargadoTienda}

_Enviado automáticamente desde el Sistema de Control de Tickets._`;

    // Codificar el texto para que sea válido en una URL
    const mensajeCodificado = encodeURIComponent(mensaje);
    
    // Crear el enlace directo a la API de WhatsApp
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroDestino}&text=${mensajeCodificado}`;

    // Abrir la pestaña de WhatsApp (funciona en PC y Móvil)
    window.open(urlWhatsApp, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto font-sans">
        
        {/* Cabecera del Modal */}
        <div className="bg-slate-800 text-white p-4 flex justify-between items-center rounded-t-lg">
          <div>
            <h3 className="text-lg font-bold">📄 Crear Hoja de Servicio</h3>
            <p className="text-xs text-slate-300">Ticket N# {ticket.id} - {ticket.direccion.split('-')[0].trim()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold">&times;</button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleEnviarWhatsApp} className="p-6 space-y-4 text-slate-700">
          
          {/* Fila 1: Fecha, Hora, Técnico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border rounded p-2 text-sm bg-slate-50" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Hora</label>
              <input type="text" value={hora} onChange={(e) => setHora(e.target.value)} className="w-full border rounded p-2 text-sm bg-slate-50" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Nombre Técnico *</label>
              <input type="text" value={tecnico} onChange={(e) => setTecnico(e.target.value)} placeholder="Tu nombre" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" required />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Información Fija del Ticket */}
          <div className="bg-slate-50 p-3 rounded text-sm grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-100">
            <div><strong>Cliente:</strong> {ticket.direccion.split('-')[0].trim()}</div>
            <div><strong>Ubicación:</strong> {ticket.municipio}, {ticket.departamento}</div>
            <div className="sm:col-span-2"><strong>Incidencia Original:</strong> {ticket.description}</div>
          </div>

          {/* Campos de Texto Libre según el documento */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Diagnóstico y Acciones Realizadas *</label>
            <textarea value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} placeholder="Describe qué encontraste y qué reparaste..." rows={3} className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none resize-none" required />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Resultado y Estado Final *</label>
            <textarea value={resultado} onChange={(e) => setResultado(e.target.value)} placeholder="Ej: Operacional al 100%, equipo probado en red local..." rows={2} className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none resize-none" required />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Observaciones y Recomendaciones (Opcional)</label>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Ej: Se sugiere regulador de voltaje para el servidor..." rows={2} className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none resize-none" />
          </div>

          <hr className="border-slate-200" />

          {/* Firmas y Envío */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Encargado de Tienda (Firma digital) *</label>
              <input type="text" value={encargadoTienda} onChange={(e) => setEncargadoTienda(e.target.value)} placeholder="Nombre de quien recibe la entrega" className="w-full border rounded p-2 text-sm focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">WhatsApp Destino de la Empresa *</label>
              <input type="tel" value={telefonoEmpresa} onChange={(e) => setTelefonoEmpresa(e.target.value)} placeholder="Ej: 55443322" className="w-full border rounded p-2 text-sm border-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none font-mono" required />
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-sm text-slate-500 hover:bg-slate-100 transition">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-bold flex items-center gap-2 shadow transition">
              <span>💬</span> Enviar Hoja por WhatsApp
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};