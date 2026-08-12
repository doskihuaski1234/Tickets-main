import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { useState } from 'react';

import Dashboard from '../pages/Dashboard';
import Tickets from '../pages/Tickets';
import NuevaOrden from '../pages/NuevaOrden';
import MapaPage from '../pages/MapaPage';

import type { Ticket, TicketStatus } from '../types/tickets';

export default function AppRoutes() {

  const [tickets, setTickets] = useState<Ticket[]>([]);

  // ✅ CREAR TICKET (YA COMPLETO)
  const addTicket = (ticket: Ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  // ✅ ACTUALIZAR ESTADO
  const updateStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status }
          : t
      )
    );
  };

  // ✅ ELIMINAR
  const deleteTicket = (id: string) => {
    setTickets((prev) =>
      prev.filter((t) => t.id !== id)
    );
  };

  return (
    <BrowserRouter>

      <Routes>

        {/* REDIRECCIÓN */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={<Dashboard tickets={tickets} />}
        />

        {/* TICKETS */}
        <Route
          path="/tickets"
          element={
            <Tickets
              tickets={tickets}
              onUpdateStatus={updateStatus}
              onDelete={deleteTicket}
            />
          }
        />

        {/* NUEVA ORDEN */}
        <Route
          path="/nueva"
          element={
            <NuevaOrden
              onAddTicket={addTicket}
            />
          }
        />

        {/* MAPA */}
        <Route
          path="/mapa"
          element={
            <MapaPage tickets={tickets} />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}