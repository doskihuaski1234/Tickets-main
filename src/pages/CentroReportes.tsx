import { useState } from 'react';
import { generarHojaServicioPDF } from '../services/pdfGenerator';
import type { Ticket } from '../types/tickets';

interface CentroReportesProps {
  tickets: Ticket[];
}

export function CentroReportes({ tickets }: CentroReportesProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  const [hojasGuardadas, setHojasGuardadas] = useState<Record<string, Record<string, string>>>(() => {
    try {
      const stored = localStorage.getItem('hojas_servicio_guardadas');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      console.error("Error al cargar hojas guardadas", e);
      return {};
    }
  });

  const obtenerDatosHoja = (ticket: Ticket) => {
    const stored = localStorage.getItem('hojas_servicio_guardadas');
    const allStored = stored ? JSON.parse(stored) : {};
    const guardado = allStored[ticket.id] || {};

    // Imprime en consola para verificar qué datos está tomando del localStorage
    console.log("Datos recuperados para el ticket:", ticket.id, guardado);

    return {
      tecnico: guardado.tecnico || 'Técnico Asignado',
      diagnostico: guardado.diagnostico || ticket.title,
      resultado: guardado.resultado || ticket.status,
      telefono: guardado.telefono || '',
      emailCliente: guardado.emailCliente || '',
      fecha: guardado.fecha || new Date().toISOString().split('T')[0],
      hora: guardado.hora || '',
      pais: guardado.pais || 'Guatemala',
      cliente: guardado.cliente || ticket.empresa || '',
      ubicacion: guardado.ubicacion || '',
      observaciones: guardado.observaciones || ''
    };
  };

  const obtenerDocPDF = (ticket: Ticket) => {
    const datosHoja = obtenerDatosHoja(ticket);
    return generarHojaServicioPDF(ticket, datosHoja);
  };

  const handleVerPDF = () => {
    if (!selectedTicket) return alert("Selecciona un ticket de la lista");

    try {
      const doc = obtenerDocPDF(selectedTicket);
      const pdfBlob = doc.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      window.open(blobUrl, '_blank');
    } catch (error) {
      console.error("Error al abrir el PDF:", error);
      alert("Hubo un error al generar la vista previa del PDF.");
    }
  };

  const handleDescargarPDF = () => {
    if (!selectedTicket) return alert("Selecciona un ticket de la lista");

    try {
      const doc = obtenerDocPDF(selectedTicket);
      doc.save(`Reporte_Servicio_${selectedTicket.id}.pdf`);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      alert("Hubo un error al generar la descarga del PDF.");
    }
  };

  const handleBorrarReporte = () => {
    if (!selectedTicket) return;

    if (!hojasGuardadas[selectedTicket.id]) {
      alert("Este ticket no tiene un reporte guardado.");
      return;
    }

    if (window.confirm(`¿Estás seguro de que deseas borrar el reporte guardado para el ticket #${selectedTicket.id}?`)) {
      try {
        // Copiamos el estado actual y eliminamos la clave del ticket
        const nuevoRegistro = { ...hojasGuardadas };
        delete nuevoRegistro[selectedTicket.id];

        // Actualizamos localStorage
        localStorage.setItem('hojas_servicio_guardadas', JSON.stringify(nuevoRegistro));

        // Actualizamos el estado de React para reflejar el cambio en la interfaz
        setHojasGuardadas(nuevoRegistro);

        alert("Reporte borrado exitosamente.");
      } catch (error) {
        console.error("Error al borrar el reporte:", error);
        alert("Hubo un error al intentar borrar el reporte.");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Centro de Reportes
      </h2>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total de Tickets</p>
          <p className="text-3xl font-bold text-blue-800">{tickets.length}</p>
        </div>
      </div>

      {/* Selector rápido */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Orden para Generar Reporte</label>
        <select 
          value={selectedTicket ? selectedTicket.id : ""}
          onChange={(e) => setSelectedTicket(tickets.find(t => t.id === e.target.value) || null)}
          className="w-full p-3 border border-gray-300 rounded-lg bg-white"
        >
          <option value="">Seleccione una orden...</option>
          {tickets.map(t => (
            <option key={t.id} value={t.id}>{t.title} - {t.empresa}</option>
          ))}
        </select>
      </div>

      {/* Tabla de registros */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Título</th>
              <th className="p-3 text-left">Empresa</th>
              <th className="p-3 text-left">Estado / Resultado</th>
              <th className="p-3 text-left">Reporte Guardado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tickets.map(ticket => {
              const guardado = hojasGuardadas[ticket.id];
              return (
                <tr 
                  key={ticket.id} 
                  onClick={() => setSelectedTicket(ticket)}
                  className={`cursor-pointer hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-3">{ticket.id}</td>
                  <td className="p-3">{ticket.title}</td>
                  <td className="p-3">{ticket.empresa}</td>
                  <td className="p-3">{guardado ? guardado.resultado : ticket.status}</td>
                  <td className="p-3">
                    {guardado ? (
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Guardado
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                        Pendiente
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Panel de Acciones para el Ticket Seleccionado */}
      {selectedTicket && (
        <div className="mt-6 rounded-lg border p-5 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-800">Orden Seleccionada: #{selectedTicket.id} - {selectedTicket.title}</p>
            <p className="text-xs text-gray-500 mt-1">Puedes visualizar el reporte, descargarlo o borrar los datos guardados.</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <button 
              type="button"
              onClick={handleVerPDF}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded shadow transition-colors"
            >
              Ver PDF
            </button>
            <button 
              type="button"
              onClick={handleDescargarPDF}
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow transition-colors"
            >
              Descargar PDF
            </button>
            {hojasGuardadas[selectedTicket.id] && (
              <button 
                type="button"
                onClick={handleBorrarReporte}
                className="flex-1 sm:flex-none px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow transition-colors"
              >
                Borrar Reporte
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CentroReportes;