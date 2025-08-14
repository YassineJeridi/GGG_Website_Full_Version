import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from '../../components/Dashboard/DashboardLayout/DashboardLayout';
import DashboardOverview from '../../components/Dashboard/DashboardOverview/DashboardOverview';
import ProductManagement from '../../components/Dashboard/ProductManagement/ProductManagement';
import AddProduct from '../../components/Dashboard/AddProduct/AddProduct';
import SupportTickets from '../../components/Dashboard/SupportTickets/SupportTickets';
import Settings from '../../components/Dashboard/Settings/Settings.jsx';
import { useAuth } from '../../context/AuthContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.dashboard}>
      <DashboardLayout
        admin={admin}
        onLogout={logout}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      >
        <div className={styles.dashboardContent}>
          <Routes>
            <Route path="/" element={<DashboardOverview />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<AddProduct />} />
            <Route path="/tickets" element={<SupportTickets />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Dashboard;
