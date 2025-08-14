import React from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import styles from './BreadcrumbNavigation.module.css';

const BreadcrumbNavigation = ({ items = [] }) => {
  const defaultItems = [
    { label: 'Home', path: '/', icon: <FiHome /> },
    { label: 'Products', path: '/products' }
  ];

  const allItems = [...defaultItems, ...items];

  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.breadcrumbList}>
        {allItems.map((item, index) => (
          <li key={index} className={styles.breadcrumbItem}>
            {index < allItems.length - 1 ? (
              <>
                <Link to={item.path} className={styles.breadcrumbLink}>
                  {item.icon && <span className={styles.breadcrumbIcon}>{item.icon}</span>}
                  {item.label}
                </Link>
                <FiChevronRight className={styles.separator} />
              </>
            ) : (
              <span className={styles.breadcrumbCurrent}>
                {item.icon && <span className={styles.breadcrumbIcon}>{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;
