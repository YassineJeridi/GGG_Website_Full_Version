import React from 'react';
import ContactHero from '../../components/Contact/ContactHero/ContactHero';
import ContactInfo from '../../components/Contact/ContactInfo/ContactInfo';
import ContactForm from '../../components/Contact/ContactForm/ContactForm';
import ContactFAQ from '../../components/Contact/ContactFAQ/ContactFAQ';
import AboutSection from '../../components/Contact/AboutSection/AboutSection';
import styles from './Contact.module.css';

const Contact = () => {
  return (
    <div className={styles.contactPage}>
      <ContactHero />
      <AboutSection />
      <div className={styles.contactMainSection}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </div>
      <ContactFAQ />
    </div>
  );
};

export default Contact;
