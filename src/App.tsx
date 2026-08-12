import React, { useEffect, useRef, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Tickets } from './pages/Tickets';
import { NuevaOrden } from './pages/NuevaOrden';
import MapaPage from './pages/MapaPage';
import { SeccionHojasServicio } from './pages/SeccionHojasServicio';
import { CentroReportes } from './pages/CentroReportes';
import { MisOrdenes } from './pages/MisOrdenes';
import { MiPerfil } from './pages/MiPerfil';
import { Usuarios } from './pages/Usuarios';
import { LoginPage } from './pages/LoginPage';
import './App.css';

import type { Ticket, TicketStatus } from './types/tickets';
import type { TabType } from './types/navigation';
import { ticketService } from './services/api';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<{ token: string | null; user: { email: string; role: string; name: string } | null }>({
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
  });

  const isAdmin = auth.user?.role === 'admin';
  const isTechnician = auth.user?.role === 'tecnico';
  const lastTicketIdsRef = useRef<Set<string>>(new Set());

  const showMobileNotification = (title: string, body: string) => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' });
      return;
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, { body, icon: '/vite.svg' });
        }
      }).catch(() => undefined);
    }
  };

  useEffect(() => {
    const loadTickets = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const data = await ticketService.getAll(auth.token);
        const mapped: Ticket[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.descripcion || item.description || '',
          status: item.status === 'En proceso' ? 'procesado' : item.status === 'Completado' ? 'cerrado' : 'abierto',
          createdAt: item.createdAt || new Date().toISOString(),
          empresa: item.empresa || '',
          sucursal: item.sucursal || '',
          departamento: item.departamento || '',
          municipio: item.municipio || '',
          direccion: item.direccion || '',
          assignedTo: item.assignedTo || undefined,
          assignedToName: item.assignedToName || undefined,
          notification: item.notification || undefined,
          lat: item.lat || 14.6349,
          lng: item.lng || -90.5069,
        }));

        if (isTechnician && auth.user?.email) {
          const currentIds = new Set(mapped.map((ticket) => ticket.id));
          const newlyAvailable = mapped.filter(
            (ticket) => !ticket.assignedTo && !lastTicketIdsRef.current.has(ticket.id)
          );

          const newlyAssignedToMe = mapped.filter(
            (ticket) => ticket.assignedTo === auth.user.email && !lastTicketIdsRef.current.has(ticket.id)
          );

          if (newlyAvailable.length > 0) {
            showMobileNotification(
              'Nueva orden disponible',
              `Hay ${newlyAvailable.length} orden(es) nuevas para todos los técnicos.`
            );
          }

          if (newlyAssignedToMe.length > 0) {
            showMobileNotification(
              'Orden asignada a ti',
              `Se te asignó ${newlyAssignedToMe.length} orden(es) nueva(s).`
            );
          }

          lastTicketIdsRef.current = currentIds;
        } else {
          lastTicketIdsRef.current = new Set(mapped.map((ticket) => ticket.id));
        }

        setTickets(mapped);
      } catch (error) {
        console.error('Error cargando tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
    const intervalId = window.setInterval(loadTickets, 20000);

    return () => window.clearInterval(intervalId);
  }, [auth.token, auth.user?.email, isTechnician]);

  const handleAddTicket = async (newTicket: Ticket) => {
    if (!auth.token) return;
    try {
      const payload = {
        id: newTicket.id,
        title: newTicket.title,
        empresa: newTicket.empresa,
        status: newTicket.status === 'procesado' ? 'En proceso' : newTicket.status === 'cerrado' ? 'Completado' : 'Pendiente',
        descripcion: newTicket.description,
        assignedTo: newTicket.assignedTo,
        assignedToName: newTicket.assignedToName,
        notification: newTicket.notification,
        createdBy: auth.user?.email,
      };

      const created = await ticketService.create(payload, auth.token);
      const mapped: Ticket = {
        id: created.id,
        title: created.title,
        description: created.descripcion || '',
        status: created.status === 'En proceso' ? 'procesado' : created.status === 'Completado' ? 'cerrado' : 'abierto',
        createdAt: created.createdAt || new Date().toISOString(),
        empresa: created.empresa || '',
        sucursal: created.sucursal || '',
        departamento: created.departamento || '',
        municipio: created.municipio || '',
        direccion: created.direccion || '',
        assignedTo: created.assignedTo || undefined,
        assignedToName: created.assignedToName || undefined,
        notification: created.notification || undefined,
        lat: created.lat || 14.6349,
        lng: created.lng || -90.5069,
      };
      setTickets((prev) => [mapped, ...prev]);
    } catch (error) {
      console.error('Error creando ticket:', error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: TicketStatus) => {
    if (!auth.token) return;
    try {
      const statusPayload = newStatus === 'procesado' ? 'En proceso' : newStatus === 'cerrado' ? 'Completado' : 'Pendiente';
      const currentTicket = tickets.find((ticket) => ticket.id === id);

      const takingTicket = !currentTicket?.assignedTo && newStatus === 'procesado';

      await ticketService.update(
        id,
        {
          status: statusPayload,
          assignedTo: currentTicket?.assignedTo || (takingTicket ? auth.user?.email : undefined),
          assignedToName: currentTicket?.assignedToName || (takingTicket ? auth.user?.name || auth.user?.email : undefined),
          notification: takingTicket
            ? `La orden fue tomada por ${auth.user?.name || auth.user?.email}`
            : currentTicket?.notification || `Orden actualizada por ${auth.user?.name || 'usuario'}`
        },
        auth.token
      );

      setTickets((prev) => prev.map((ticket) => ticket.id === id ? { ...ticket, status: newStatus } : ticket));
    } catch (error) {
      console.error('Error actualizando ticket:', error);
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (!auth.token) return;
    try {
      await ticketService.delete(id, auth.token);
      setTickets((prev) => prev.filter((ticket) => ticket.id !== id));
    } catch (error) {
      console.error('Error eliminando ticket:', error);
    }
  };

  const handleLogin = (token: string, user: { email: string; role: string; name: string }) => {
    setAuth({ token, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  };

  if (!auth.token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const technicianTickets = isTechnician ? tickets : tickets;

  return (
    <div className="app-layout">
      <Navbar user={auth.user} onLogout={handleLogout} />

      <div className="app-body">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} userRole={auth.user?.role} />

        <main className="app-content">
          {loading ? <div className="p-6">Cargando tickets...</div> : null}

          {isAdmin && currentTab === 'dashboard' && <Dashboard tickets={tickets} />}
          {isAdmin && currentTab === 'tickets' && <Tickets tickets={tickets} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteTicket} />}
          {isAdmin && currentTab === 'nueva-orden' && <NuevaOrden onAddTicket={handleAddTicket} />}
          {isAdmin && currentTab === 'mapa' && <MapaPage tickets={tickets} />}
          {isAdmin && currentTab === 'hojas-servicio' && <SeccionHojasServicio tickets={tickets} />}
          {isAdmin && currentTab === 'reportes' && <CentroReportes tickets={tickets} />}
          {isAdmin && currentTab === 'usuarios' && <Usuarios />}
          {isAdmin && currentTab === 'mi-perfil' && <MiPerfil user={auth.user} onProfileUpdated={handleLogin} />}

          {isTechnician && currentTab === 'mis-ordenes' && (
            <MisOrdenes tickets={technicianTickets} onUpdateStatus={handleUpdateStatus} />
          )}

          {isTechnician && currentTab === 'dashboard' && <Dashboard tickets={technicianTickets} />}
          {isTechnician && currentTab === 'mapa' && <MapaPage tickets={technicianTickets} />}
          {isTechnician && currentTab === 'hojas-servicio' && <SeccionHojasServicio tickets={technicianTickets} />}
          {isTechnician && currentTab === 'reportes' && <CentroReportes tickets={tickets} />}
          {isTechnician && currentTab === 'mi-perfil' && <MiPerfil user={auth.user} onProfileUpdated={handleLogin} />}
        </main>
      </div>
    </div>
  );
};

export default App;