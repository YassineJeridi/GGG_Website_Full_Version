const Ticket = require('../models/Ticket');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { subject, category, description, priority, relatedOrder, relatedProduct } = req.body;

    const ticket = await Ticket.create({
      user: req.user._id,
      subject,
      category,
      description,
      priority: priority || 'medium',
      relatedOrder,
      relatedProduct
    });

    await ticket.populate('user', 'name email');

    // Send confirmation email
    try {
      await sendEmail({
        email: ticket.user.email,
        subject: `Ticket Created - ${ticket.ticketNumber}`,
        message: `Your support ticket has been created successfully. We'll get back to you soon.`
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user tickets
// @route   GET /api/tickets
// @access  Private
const getUserTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = { user: req.user._id };
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const tickets = await Ticket.find(filter)
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit)
      .populate('relatedOrder relatedProduct', 'orderNumber name');

    const total = await Ticket.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name')
      .populate('relatedOrder relatedProduct', 'orderNumber name')
      .populate('messages.sender', 'name role');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user owns the ticket or is admin
    if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add message to ticket
// @route   POST /api/tickets/:id/messages
// @access  Private
const addMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Check if user owns the ticket or is admin
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const newMessage = {
      sender: req.user._id,
      senderType: req.user.role,
      message,
      attachments: req.files ? req.files.map(file => ({
        filename: file.originalname,
        url: file.path,
        fileType: file.mimetype
      })) : []
    };

    ticket.messages.push(newMessage);
    
    // Update status if customer replies to closed ticket
    if (ticket.status === 'closed' && req.user.role === 'user') {
      ticket.status = 'open';
    }

    await ticket.save();
    await ticket.populate('messages.sender', 'name role');

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket.status = status;
    
    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }
    
    if (status === 'resolved' || status === 'closed') {
      ticket.resolvedAt = new Date();
    }

    await ticket.save();

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createTicket,
  getUserTickets,
  getTicketById,
  addMessage,
  updateTicketStatus
};
