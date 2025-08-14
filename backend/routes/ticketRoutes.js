const express = require('express');
const {
  createTicket,
  getUserTickets,
  getTicketById,
  addMessage,
  updateTicketStatus
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .get(protect, getUserTickets)
  .post(protect, createTicket);

router.route('/:id')
  .get(protect, getTicketById);

router.route('/:id/messages')
  .post(protect, upload.array('attachments', 3), addMessage);

router.route('/:id/status')
  .put(protect, admin, updateTicketStatus);

module.exports = router;
