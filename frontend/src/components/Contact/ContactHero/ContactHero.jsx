import React from 'react';
import { FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import styles from './ContactHero.module.css';

const ContactHero = () => {
  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.title}>Get In Touch</h1>
            <p className={styles.subtitle}>
              Have questions about our gaming products or need expert advice? 
              Our team is here to help you build the perfect gaming setup!
            </p>
            
            <div className={styles.quickContact}>
              <div className={styles.contactQuick}>
                <FiPhone className={styles.quickIcon} />
                <div>
                  <span className={styles.quickLabel}>Call Us</span>
                  <span className={styles.quickValue}>+216 25 910 385</span>
                </div>
              </div>
              <div className={styles.contactQuick}>
                <FiMail className={styles.quickIcon} />
                <div>
                  <span className={styles.quickLabel}>Email Us</span>
                  <span className={styles.quickValue}>info@ggguys.store</span>
                </div>
              </div>
              <div className={styles.contactQuick}>
                <FiGlobe className={styles.quickIcon} />
                <div>
                  <span className={styles.quickLabel}>Online Store</span>
                  <span className={styles.quickValue}>100% Digital</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.contactIllustration}>
              <div className={styles.floatingCard}>
                <FiMail className={styles.cardIcon} />
                <span>24/7 Support</span>
              </div>
              <div className={styles.floatingCard} style={{ '--delay': '1s' }}>
                <FiPhone className={styles.cardIcon} />
                <span>Fast Response</span>
              </div>
              <div className={styles.floatingCard} style={{ '--delay': '2s' }}>
                <FiGlobe className={styles.cardIcon} />
                <span>Expert Advice</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
