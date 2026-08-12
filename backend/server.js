const app = require('./src/app');
const sequelize = require('./src/config/database');
const Ticket = require('./src/models/Ticket');
const User = require('./src/models/User');
require('dotenv').config();

async function iniciarServidor() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    await sequelize.sync();
    console.log('Base de datos sincronizada.');

    const totalTickets = await Ticket.count();

    if (totalTickets === 0) {
      await Ticket.bulkCreate([
        {
          id: 'T-1001',
          title: 'Falla en servidor de ventas',
          empresa: 'Acme S.A.',
          status: 'Pendiente',
          descripcion: 'El sistema de ventas presenta errores al generar reportes.'
        },
        {
          id: 'T-1002',
          title: 'Solicitud de actualización de módulo',
          empresa: 'GlobalTech',
          status: 'En proceso',
          descripcion: 'Se requiere habilitar nuevas funciones de seguimiento.'
        },
        {
          id: 'T-1003',
          title: 'Consulta de acceso a reportes',
          empresa: 'Innova',
          status: 'Completado',
          descripcion: 'Se resolvió el acceso para el equipo de operaciones.'
        }
      ]);
    }

    const demoUsers = [
      {
        name: 'Administrador',
        email: 'admin@tickets.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'Técnico',
        email: 'tecnico@tickets.com',
        password: 'tec123',
        role: 'tecnico'
      },
      {
        name: 'Técnico 1',
        email: 'tecnico1@tickets.com',
        password: 'tec123',
        role: 'tecnico'
      },
      {
        name: 'Técnico 2',
        email: 'tecnico2@tickets.com',
        password: 'tec123',
        role: 'tecnico'
      }
    ];

    for (const userData of demoUsers) {
      const [user] = await User.findOrCreate({
        where: { email: userData.email },
        defaults: userData
      });
    }

    console.log('Usuarios de prueba verificados.');

  } catch (error) {
    console.error('Error al iniciar la base de datos:', error);
  }
}

iniciarServidor();

module.exports = app;