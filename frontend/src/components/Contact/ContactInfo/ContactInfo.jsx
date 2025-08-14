import React from 'react';
import { 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiGlobe,
  FiFacebook, 
  FiInstagram, 
  FiTwitter,
  FiMessageCircle
} from 'react-icons/fi';
import styles from './ContactInfo.module.css';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: <FiGlobe />,
      title: "Online Store",
      description: "We operate 100% online for better prices and convenience",
      info: "Carthage, Tunisia",
      highlight: "No physical address - Digital first!"
    },
    {
      icon: <FiPhone />,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      info: "+216 25 910 385",
      highlight: "Available during business hours"
    },
    {
      icon: <FiMail />,
      title: "Email Support",
      description: "Send us your questions anytime",
      info: "info@ggguys.store",
      highlight: "We respond within 24 hours"
    },
    {
      icon: <FiClock />,
      title: "Business Hours",
      description: "When our team is available",
      info: "Daily 09:00 - 23:00",
      highlight: "Tunisia Time (GMT+1)"
    }
  ];

  return (
    <div className={styles.contactInfo}>
      <div className={styles.infoHeader}>
        <h2>Contact Information</h2>
        <p>Multiple ways to reach our gaming experts</p>
      </div>

      <div className={styles.contactDetails}>
        {contactDetails.map((contact, index) => (
          <div key={index} className={styles.contactItem}>
            <div className={styles.contactIcon}>
              {contact.icon}
            </div>
            <div className={styles.contactContent}>
              <h4>{contact.title}</h4>
              <p className={styles.description}>{contact.description}</p>
              <span className={styles.contactValue}>{contact.info}</span>
              <small className={styles.highlight}>{contact.highlight}</small>
            </div>
          </div>
        ))}
      </div>

      {/* Social Media Section */}
      <div className={styles.socialSection}>
        <h3>Follow Us</h3>
        <p>Stay updated with the latest gaming hardware and deals</p>
        
        <div className={styles.socialLinks}>
          <a href="#" className={styles.socialLink} aria-label="Facebook">
            <FiFacebook />
            <span>Facebook</span>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Instagram">
            <FiInstagram />
            <span>Instagram</span>
          </a>
          <a href="#" className={styles.socialLink} aria-label="Twitter">
            <FiTwitter />
            <span>Twitter</span>
          </a>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h3>Quick Actions</h3>
        <div className={styles.actionButtons}>
          <a href="tel:+21625910385" className={styles.actionBtn}>
            <FiPhone />
            <span>Call Now</span>
          </a>
          <a href="mailto:info@ggguys.store" className={styles.actionBtn}>
            <FiMail />
            <span>Send Email</span>
          </a>


        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
