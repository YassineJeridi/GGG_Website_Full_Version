import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiHeadphones, 
  FiTrendingUp, 
  FiUsers,
  FiPlus,
  FiEye
} from 'react-icons/fi';
import ApiService from '../../../services/api';
import styles from './DashboardOverview.module.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTickets: 0,
    pendingTickets: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch products count
        const productsResponse = await ApiService.getProducts({ limit: 1 });
        const totalProducts = productsResponse.data?.pagination?.total || 0;

        // Simulate other stats (implement these endpoints as needed)
        setStats({
          totalProducts,
          totalTickets: 25, // Replace with actual API call
          pendingTickets: 8, // Replace with actual API call
          recentActivity: [
            { type: 'product', action: 'added', item: 'MSI RTX 4070', time: '2 hours ago' },
            { type: 'ticket', action: 'resolved', item: 'Support Ticket #1234', time: '4 hours ago' },
            { type: 'product', action: 'updated', item: 'Gaming Keyboard', time: '1 day ago' }
          ]
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <FiPackage />,
      color: 'blue',
      link: '/admin/dashboard/products'
    },
    {
      title: 'Support Tickets',
      value: stats.totalTickets,
      icon: <FiHeadphones />,
      color: 'green',
      link: '/admin/dashboard/tickets'
    },
    {
      title: 'Pending Tickets',
      value: stats.pendingTickets,
      icon: <FiTrendingUp />,
      color: 'orange',
      link: '/admin/dashboard/tickets?status=pending'
    },
    {
      title: 'This Month',
      value: '12K',
      icon: <FiUsers />,
      color: 'purple',
      link: '#'
    }
  ];

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardOverview}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>Welcome to GGG Admin Panel</p>
        </div>
        
        <div className={styles.quickActions}>
          <Link to="/admin/dashboard/products/add" className={styles.primaryAction}>
            <FiPlus />
            <span>Add Product</span>
          </Link>
          <Link to="/admin/dashboard/tickets" className={styles.secondaryAction}>
            <FiEye />
            <span>View Tickets</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[card.color]}`}>
              {card.icon}
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{card.value}</h3>
              <p className={styles.statTitle}>{card.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={styles.recentActivity}>
        <h2>Recent Activity</h2>
        <div className={styles.activityList}>
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                {activity.type === 'product' ? <FiPackage /> : <FiHeadphones />}
              </div>
              <div className={styles.activityContent}>
                <p>
                  <strong>{activity.action}</strong> {activity.item}
                </p>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
