const Ticket = require('../models/Ticket');
const User = require('../models/User');

const asignarTecnicoDisponible = async () => {
  return null;
};

exports.obtenerTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();

    if (req.user && req.user.role === 'tecnico') {
      return res.json(tickets);
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.crearTicket = async (req, res) => {
  try {
    const {
      id,
      title,
      empresa,
      status,
      descripcion,
      assignedTo,
      assignedToName,
      notification,
      createdBy,
      evidenceBefore,
      evidenceAfter,
      evidenceBeforeImage,
      evidenceAfterImage
    } = req.body;

    const tecnicoAsignado = assignedTo ? { email: assignedTo, name: assignedToName || assignedTo } : null;

    const nuevoTicket = await Ticket.create({
      id,
      title,
      empresa,
      status: status || 'Pendiente',
      descripcion,
      assignedTo: tecnicoAsignado?.email || null,
      assignedToName: tecnicoAsignado?.name || assignedToName || null,
      notification: notification || 'Nueva orden disponible para todos los técnicos. Tómala cuando estés cerca.',
      evidenceBefore: evidenceBefore || null,
      evidenceAfter: evidenceAfter || null,
      evidenceBeforeImage: evidenceBeforeImage || null,
      evidenceAfterImage: evidenceAfterImage || null,
      createdBy: createdBy || req.user?.email || 'admin'
    });

    res.status(201).json(nuevoTicket);
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.actualizarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, empresa, status, descripcion, assignedTo, assignedToName, notification, evidenceBefore, evidenceAfter, evidenceBeforeImage, evidenceAfterImage } = req.body;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) return res.status(404).json({ error: 'No encontrado' });

    const tecnicoActual = assignedTo ? { email: assignedTo, name: assignedToName || assignedTo } : null;

    await ticket.update({
      title: title ?? ticket.title,
      empresa: empresa ?? ticket.empresa,
      status: status ?? ticket.status,
      descripcion: descripcion ?? ticket.descripcion,
      assignedTo: tecnicoActual?.email ?? assignedTo ?? ticket.assignedTo,
      assignedToName: tecnicoActual?.name ?? assignedToName ?? ticket.assignedToName,
      notification: notification || ticket.notification,
      evidenceBefore: evidenceBefore ?? ticket.evidenceBefore,
      evidenceAfter: evidenceAfter ?? ticket.evidenceAfter,
      evidenceBeforeImage: evidenceBeforeImage ?? ticket.evidenceBeforeImage,
      evidenceAfterImage: evidenceAfterImage ?? ticket.evidenceAfterImage
    });

    res.json({ mensaje: 'Actualizado', ticket });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};

exports.eliminarTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) return res.status(404).json({ error: 'No encontrado' });

    await ticket.destroy();
    res.json({ mensaje: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error interno' });
  }
};