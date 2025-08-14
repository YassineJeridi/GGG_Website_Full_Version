import React from 'react';
import { FiZap, FiAward, FiUsers, FiTrendingUp } from 'react-icons/fi';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  const stats = [
    {
      icon: <FiUsers />,
      number: '2000+',
      label: 'Happy Customers',
      color: '#007bff'
    },
    {
      icon: <FiZap />,
      number: '500+',
      label: 'Products Available',
      color: '#28a745'
    },
    {
      icon: <FiAward />,
      number: '24/7',
      label: 'Expert Support',
      color: '#ffc107'
    },
    {
      icon: <FiTrendingUp />,
      number: '99%',
      label: 'Customer Satisfaction',
      color: '#dc3545'
    }
  ];



  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <div className={styles.aboutContent}>
          <div className={styles.aboutText}>
            <div className={styles.sectionHeader}>
              <h2>About GGG - Good Game Guys</h2>
              <p className={styles.subtitle}>
                Tunisia's premier destination for gaming hardware and accessories
              </p>
            </div>
            
            <div className={styles.aboutIntro}>
              <p>
                Welcome to <strong>Good Game Guys (GGG)</strong>, your trusted online gaming hardware specialist in Tunisia. 
                Since our founding, we've been passionate about bringing the latest gaming technology directly to gamers across Tunisia 
                through our 100% digital platform.
              </p>
            </div>
          </div>
          
          <div className={styles.statsSection}>
            <h3>Our Achievements</h3>
            <div className={styles.stats}>
              {stats.map((stat, index) => (
                <div key={index} className={styles.stat}>
                  <div className={styles.statIcon} style={{ '--color': stat.color }}>
                    {stat.icon}
                  </div>
                  <div className={styles.statContent}>
                    <h4>{stat.number}</h4>
                    <p>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
