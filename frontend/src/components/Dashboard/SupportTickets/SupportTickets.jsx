import React, { useState, useEffect } from 'react';
import { FiMessageCircle, FiClock, FiCheck, FiX, FiUser, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './SupportTickets.module.css';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Mock ticket data - replace with actual API calls
  const mockTickets = [
    {
      id: '1',
      ticketNumber: 'TKT-001',
      subject: 'Graphics Card Not Working',
      category: 'Technical Support',
      priority: 'high',
      status: 'open',
      user: { name: 'Ahmed Ben Ali', email: 'ahmed@example.com' },
      createdAt: '2025-01-13T10:00:00Z',
      lastActivity: '2025-01-13T14:30:00Z',
      messages: [
        {
          sender: { name: 'Ahmed Ben Ali' },
          message: 'My RTX 4070 is not being detected by my system.',
          createdAt: '2025-01-13T10:00:00Z'
        }
      ]
    },
    {
      id: '2',
      ticketNumber: 'TKT-002',
      subject: 'Order Status Inquiry',
      category: 'Order Support',
      priority: 'medium',
      status: 'pending',
      user: { name: 'Fatma Trabelsi', email: 'fatma@example.com' },
      createdAt: '2025-01-12T15:20:00Z',
      lastActivity: '2025-01-13T09:15:00Z',
      messages: [
        {
          sender: { name: 'Fatma Trabelsi' },
          message: 'When will my gaming keyboard be delivered?',
          createdAt: '2025-01-12T15:20:00Z'
        }
      ]
    }
  ];

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let filteredTickets = mockTickets;
      if (filter !== 'all') {
        filteredTickets = mockTickets.filter(ticket => ticket.status === filter);
      }
      
      setTickets(filteredTickets);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId, newStatus) => {
    try {
      // Simulate API call
      setTickets(prev => prev.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      ));
      toast.success(`Ticket ${newStatus === 'resolved' ? 'resolved' : 'updated'} successfully`);
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update ticket');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FiMessageCircle className={styles.statusOpen} />;
      case 'pending': return <FiClock className={styles.statusPending} />;
      case 'resolved': return <FiCheck className={styles.statusResolved} />;
      case 'closed': return <FiX className={styles.statusClosed} />;
      default: return <FiMessageCircle />;
    }
  };

  const getPriorityClass = (priority) => {
    return styles[`priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className={styles.supportTickets}>
      <div className={styles.header}>
        <h1>Support Tickets</h1>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FiFilter />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.ticketsContainer}>
        {tickets.length === 0 ? (
          <div className={styles.emptyState}>
            <FiMessageCircle />
            <h3>No Tickets Found</h3>
            <p>There are no support tickets matching your filter criteria.</p>
          </div>
        ) : (
          <div className={styles.ticketsList}>
            {tickets.map(ticket => (
              <div
                key={ticket.id}
                className={`${styles.ticketCard} ${selectedTicket?.id === ticket.id ? styles.selected : ''}`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className={styles.ticketHeader}>
                  <div className={styles.ticketMeta}>
                    <span className={styles.ticketNumber}>{ticket.ticketNumber}</span>
                    <div className={styles.ticketStatus}>
                      {getStatusIcon(ticket.status)}
                      <span className={styles.statusText}>{ticket.status}</span>
                    </div>
                  </div>
                  <div className={`${styles.priority} ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority}
                  </div>
                </div>

                <div className={styles.ticketContent}>
                  <h3 className={styles.ticketSubject}>{ticket.subject}</h3>
                  <div className={styles.ticketInfo}>
                    <div className={styles.userInfo}>
                      <FiUser />
                      <span>{ticket.user.name}</span>
                    </div>
                    <span className={styles.category}>{ticket.category}</span>
                  </div>
                  <p className={styles.lastMessage}>
                    {ticket.messages[ticket.messages.length - 1]?.message}
                  </p>
                </div>

                <div className={styles.ticketFooter}>
                  <span className={styles.timestamp}>
                    Last activity: {formatDate(ticket.lastActivity)}
                  </span>
                  <div className={styles.ticketActions}>
                    {ticket.status !== 'resolved' && (
                      <button
                        className={styles.resolveButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          updateTicketStatus(ticket.id, 'resolved');
                        }}
                      >
                        <FiCheck />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTicket && (
          <div className={styles.ticketDetails}>
            <div className={styles.detailsHeader}>
              <h2>{selectedTicket.subject}</h2>
              <button
                className={styles.closeDetails}
                onClick={() => setSelectedTicket(null)}
              >
                <FiX />
              </button>
            </div>

            <div className={styles.ticketInfo}>
              <div className={styles.infoItem}>
                <strong>Ticket:</strong> {selectedTicket.ticketNumber}
              </div>
              <div className={styles.infoItem}>
                <strong>Status:</strong> 
                <span className={`${styles.statusBadge} ${styles[selectedTicket.status]}`}>
                  {selectedTicket.status}
                </span>
              </div>
              <div className={styles.infoItem}>
                <strong>Priority:</strong>
                <span className={`${styles.priorityBadge} ${getPriorityClass(selectedTicket.priority)}`}>
                  {selectedTicket.priority}
                </span>
              </div>
              <div className={styles.infoItem}>
                <strong>Customer:</strong> {selectedTicket.user.name}
              </div>
              <div className={styles.infoItem}>
                <strong>Email:</strong> {selectedTicket.user.email}
              </div>
              <div className={styles.infoItem}>
                <strong>Created:</strong> {formatDate(selectedTicket.createdAt)}
              </div>
            </div>

            <div className={styles.messagesContainer}>
              <h3>Messages</h3>
              <div className={styles.messages}>
                {selectedTicket.messages.map((message, index) => (
                  <div key={index} className={styles.message}>
                    <div className={styles.messageHeader}>
                      <strong>{message.sender.name}</strong>
                      <span className={styles.messageTime}>
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className={styles.messageContent}>{message.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
