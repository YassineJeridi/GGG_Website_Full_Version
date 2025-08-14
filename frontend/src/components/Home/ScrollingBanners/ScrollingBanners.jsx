import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './ScrollingBanners.module.css';

// ✅ UPDATED: Import with exact paths (adjust based on your folder structure)
import banner1 from '../../../assets/banner/Banner (1).png';
import banner2 from '../../../assets/banner/Banner (2).png';
import banner3 from '../../../assets/banner/Banner (3).png';


const ScrollingBanners = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // ✅ DEBUGGING: Add fallback images for testing
  const banners = [
    {
      id: 1,
      title: "Gaming Setup Sale",
      subtitle: "Up to 50% Off All Gaming PCs",
      description: "Build your ultimate gaming rig with our premium components",
      image: banner1,
      ctaText: "Shop Now",
      ctaLink: "/products?category=pc-gamer"
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Latest Gaming Hardware",
      description: "Discover the newest graphics cards and processors",
      image: banner2,
      ctaText: "Explore",
      ctaLink: "/products?sort=newest"
    },
    {
      id: 3,
      title: "Flash Weekend Sale",
      subtitle: "72 Hours Only",
      description: "Massive discounts on gaming accessories and peripherals",
      image: banner3,
      ctaText: "Get Deals",
      ctaLink: "/products?category=gaming-accessories"
    }
  ];

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);
  
  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToBanner = (index) => {
    setCurrentBanner(index);
  };

  // ✅ DEBUGGING: Log image URLs to console
  useEffect(() => {
    console.log('Banner images:', banners.map(b => b.image));
  }, []);

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerSlider}>
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`${styles.banner} ${index === currentBanner ? styles.active : ''}`}
            style={{
              // ✅ DEBUGGING: Reduce overlay opacity to see if images are loading
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${banner.image})`
            }}
          >
            <div className={styles.bannerContent}>
              <div className={styles.container}>
                <div className={styles.textContent}>
                  <h1 className={styles.title}>{banner.title}</h1>
                  <h2 className={styles.subtitle}>{banner.subtitle}</h2>
                  <p className={styles.description}>{banner.description}</p>
                  <a href={banner.ctaLink} className={styles.ctaButton}>
                    {banner.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button className={styles.navButton} onClick={prevBanner} aria-label="Previous banner">
        <FiChevronLeft />
      </button>
      <button className={`${styles.navButton} ${styles.next}`} onClick={nextBanner} aria-label="Next banner">
        <FiChevronRight />
      </button>

      {/* Dots Indicator */}
      <div className={styles.indicators}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentBanner ? styles.activeDot : ''}`}
            onClick={() => goToBanner(index)}
            aria-label={`Go to banner ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ScrollingBanners;
