const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  empresa: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Pendiente' },
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  assignedTo: { type: DataTypes.STRING, allowNull: true },
  assignedToName: { type: DataTypes.STRING, allowNull: true },
  notification: { type: DataTypes.TEXT, allowNull: true },
  evidenceBefore: { type: DataTypes.TEXT, allowNull: true },
  evidenceAfter: { type: DataTypes.TEXT, allowNull: true },
  evidenceBeforeImage: { type: DataTypes.TEXT, allowNull: true },
  evidenceAfterImage: { type: DataTypes.TEXT, allowNull: true },
  createdBy: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'tickets', timestamps: true });

module.exports = Ticket;