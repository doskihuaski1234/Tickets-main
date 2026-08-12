import React from 'react';
import type { Ticket, TicketStatus } from '../types/tickets';

interface TicketCardProps {
  ticket: Ticket;
  onUpdateStatus: (id: string, newStatus: TicketStatus) => void;
  onEdit: (ticket: Ticket) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  onUpdateStatus,
  onEdit,
  onDelete,
  isAdmin
}) => {

  const { id, title, description, status, createdAt } = ticket;

  const borderColor =
    status === 'abierto'
      ? '#ef4444'
      : status === 'procesado'
        ? '#f59e0b'
        : '#10b981';

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      borderLeft: `4px solid ${borderColor}`,
      marginBottom: '12px',
      fontFamily: 'sans-serif'
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#1e293b' }}>
          {title}
        </h4>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>
          {createdAt}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.4' }}>
        {description}
      </p>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* ABIERTO → PROCESADO */}
        {status === 'abierto' && (
          <button
            onClick={() => onUpdateStatus(id, 'procesado')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            Atender
          </button>
        )}

        {/* PROCESADO → CERRADO */}
        {status === 'procesado' && (
          <>
            <button
              onClick={() => onUpdateStatus(id, 'abierto')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#64748b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Reabrir
            </button>

            <button
              onClick={() => onUpdateStatus(id, 'cerrado')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              Cerrar
            </button>
          </>
        )}

        {isAdmin && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>

            <button
              onClick={() => onEdit(ticket)}
              style={{
                padding: '6px 10px',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              ✏️ Editar
            </button>

            <button
              onClick={() => {
                if (window.confirm('¿Eliminar esta orden permanentemente?')) {
                  onDelete(id);
                }
              }}
              style={{
                padding: '6px 10px',
                backgroundColor: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <TrashIcon /> Borrar
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default TicketCard;