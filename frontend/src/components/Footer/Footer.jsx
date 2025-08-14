import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import styles from './Footer.module.css';

const Footer = () => {
  const quickLinks = [
    'About Us',
    'Privacy Policy',
    'Terms of Service',
    'Shipping Info',
    'Returns & Refunds',
    'FAQ'
  ];

  const categories = [
    'Gaming PCs',
    'Components',
    'Peripherals',
    'Consoles',
    'Accessories',
    'Software'
  ];

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.container}>
        <div className={styles.footerContent}>
          {/* Quick Links */}
          <div className={styles.footerSection}>
            <h3>Quick Links</h3>
            <ul className={styles.linksList}>
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className={styles.footerLink}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className={styles.footerSection}>
            <h3>Categories</h3>
            <ul className={styles.linksList}>
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#" className={styles.footerLink}>{category}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerSection}>
            <h3>Contact Info</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FiMapPin className={styles.contactIcon} />
                <span>Carthage, Tunisia</span>
              </div>
              <div className={styles.contactItem}>
                <FiPhone className={styles.contactIcon} />
                <span>+216 25 910 385</span>
              </div>
              <div className={styles.contactItem}>
                <FiMail className={styles.contactIcon} />
                <a href="mailto:info@ggguys.store">info@ggguys.store</a>
              </div>
              <div className={styles.contactItem}>
                <FiClock className={styles.contactIcon} />
                <span>Daily 09:00-23:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.footerBottom}>
          <p>&copy; 2025 REDIX Digital Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
