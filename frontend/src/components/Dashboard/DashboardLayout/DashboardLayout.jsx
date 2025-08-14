import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiPlus, 
  FiHeadphones, 
  FiSettings, 
  FiLogOut, 
  FiMenu,
  FiX,
  FiUser
} from 'react-icons/fi';
import styles from './DashboardLayout.module.css';

const DashboardLayout = ({ children, admin, onLogout, sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <FiHome />,
      label: 'Overview',
      exact: true
    },
    {
      path: '/admin/dashboard/products',
      icon: <FiPackage />,
      label: 'Products',
      submenu: [
        {
          path: '/admin/dashboard/products',
          label: 'All Products',
          exact: true
        },
        {
          path: '/admin/dashboard/products/add',
          label: 'Add Product'
        }
      ]
    },
    {
      path: '/admin/dashboard/tickets',
      icon: <FiHeadphones />,
      label: 'Support Tickets'
    },
    {
      path: '/admin/dashboard/settings',
      icon: <FiSettings />,
      label: 'Settings'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={styles.dashboardLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>GGG</span>
            {!sidebarCollapsed && <span className={styles.logoText}>Admin</span>}
          </div>
          <button
            className={styles.toggleButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        <nav className={styles.navigation}>
          {menuItems.map((item) => (
            <div key={item.path} className={styles.navItem}>
              <Link
                to={item.path}
                className={`${styles.navLink} ${isActive(item.path, item.exact) ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
              
              {item.submenu && !sidebarCollapsed && isActive(item.path) && (
                <div className={styles.submenu}>
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.path}
                      to={subItem.path}
                      className={`${styles.submenuLink} ${isActive(subItem.path, subItem.exact) ? styles.active : ''}`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.adminInfo}>
            <div className={styles.adminAvatar}>
              <FiUser />
            </div>
            {!sidebarCollapsed && (
              <div className={styles.adminDetails}>
                <span className={styles.adminName}>{admin?.username || 'Admin'}</span>
                <span className={styles.adminRole}>Administrator</span>
              </div>
            )}
          </div>
          
          <button className={styles.logoutButton} onClick={onLogout} title="Logout">
            <FiLogOut />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
