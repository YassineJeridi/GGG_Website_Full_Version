import React from 'react';
import { FiCpu, FiMonitor, FiZap, FiSettings } from 'react-icons/fi';
import styles from './CustomPCBanner.module.css';

const CustomPCBanner = () => {
  const features = [
    {
      icon: <FiCpu />,
      title: "Choose Components",
      description: "Select from premium parts"
    },
    {
      icon: <FiSettings />,
      title: "Custom Assembly",
      description: "Professional building service"
    },
    {
      icon: <FiZap />,
      title: "Performance Tested",
      description: "Guaranteed compatibility"
    },
    {
      icon: <FiMonitor />,
      title: "Full Support",
      description: "Lifetime technical assistance"
    }
  ];

  return (
    <div className={styles.pcBuilderBanner}>
      <div className={styles.container}>
        <div className={styles.bannerContent}>
          <div className={styles.textSection}>
            <div className={styles.badgeWrapper}>
              <span className={styles.badge}>Custom PC Builder</span>
            </div>
            <h2 className={styles.title}>Build Your Dream Gaming PC</h2>
            <p className={styles.description}>
              Create the perfect gaming setup with our professional PC building service. 
              Choose from premium components, get expert assembly, and enjoy lifetime support.
            </p>
            
            {/* Features Grid */}
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    {feature.icon}
                  </div>
                  <div className={styles.featureContent}>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.ctaSection}>
              <a href="/pc-builder" className={styles.primaryCta}>
                Start Building Now
              </a>
              <a href="/products?category=components" className={styles.secondaryCta}>
                Browse Components
              </a>
            </div>
          </div>

          <div className={styles.visualSection}>
            <div className={styles.pcIllustration}>
              <div className={styles.pcCase}>
                <div className={styles.rgb}></div>
                <div className={styles.fans}>
                  <div className={styles.fan}></div>
                  <div className={styles.fan}></div>
                  <div className={styles.fan}></div>
                </div>
                <div className={styles.components}>
                  <div className={styles.gpu}></div>
                  <div className={styles.ram}></div>
                  <div className={styles.motherboard}></div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className={styles.floatingElements}>
              <div className={styles.floatingIcon} style={{ '--delay': '0s' }}>
                <FiCpu />
              </div>
              <div className={styles.floatingIcon} style={{ '--delay': '1s' }}>
                <FiMonitor />
              </div>
              <div className={styles.floatingIcon} style={{ '--delay': '2s' }}>
                <FiZap />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPCBanner;
