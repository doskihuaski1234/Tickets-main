const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tickets', authMiddleware(), ticketRoutes);
app.get('/', (req, res) => { res.send('API del Sistema de Tickets funcionando'); });
module.exports = app;