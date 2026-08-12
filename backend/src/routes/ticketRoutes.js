const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
router.get('/', ticketController.obtenerTickets);
router.post('/', ticketController.crearTicket);
router.put('/:id', ticketController.actualizarTicket);
router.delete('/:id', ticketController.eliminarTicket);
module.exports = router;