import React, { useRef, useEffect } from 'react';
import { FiAward, FiShield, FiTrendingUp } from 'react-icons/fi';
import styles from './TrustedPartners.module.css';

const TrustedPartners = () => {
  const scrollRef = useRef(null);

  const partners = [
    { name: 'AMD', logo: '/src/assets/partners/AMD.png' },
    { name: 'ASUS', logo: '/src/assets/partners/asus.png' },
    { name: 'Corsair', logo: '/src/assets/partners/Corsair.png' },
    { name: 'HyperX', logo: '/src/assets/partners/HyperX.png' },
    { name: 'Intel', logo: '/src/assets/partners/intel.png' },
    { name: 'Logitech', logo: '/src/assets/partners/logitech.png' },
    { name: 'Microsoft', logo: '/src/assets/partners/microsoft.png' },
    { name: 'Nintendo', logo: '/src/assets/partners/nintendo.png' },
    { name: 'NVIDIA', logo: '/src/assets/partners/NVIDIA.png' },
    { name: 'Razer', logo: '/src/assets/partners/razer.png' },
    { name: 'Redragon', logo: '/src/assets/partners/redragon.png' },
    { name: 'Sony', logo: '/src/assets/partners/sony.png' }
  ];

  // Auto-scroll partners
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scroll = () => {
      if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += 1;
      }
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.partnersContainer}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Trusted by Leading Brands</h2>
          <p className={styles.sectionSubtitle}>
            We partner with the world's top gaming hardware manufacturers to bring you the best products
          </p>
        </div>

        {/* Partners Slider */}
        <div className={styles.partnersSection}>
          <div className={styles.partnersSlider} ref={scrollRef}>
            <div className={styles.partnersTrack}>
              {/* Duplicate partners for seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <div key={index} className={styles.partnerCard}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name}
                    className={styles.partnerLogo}
                    onError={(e) => {
                      // Fallback to text if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className={styles.partnerName}>{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={styles.trustIndicators}>
          <div className={styles.trustItem}>
            <FiShield className={styles.trustIcon} />
            <span>Authorized Dealer</span>
          </div>
          <div className={styles.trustItem}>
            <FiAward className={styles.trustIcon} />
            <span>Certified Quality</span>
          </div>
          <div className={styles.trustItem}>
            <FiTrendingUp className={styles.trustIcon} />
            <span>Trusted Since 2020</span>
          </div>
          <div className={styles.trustItem}>
            <FiAward className={styles.trustIcon} />
            <span>10,000+ Happy Customers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedPartners;
