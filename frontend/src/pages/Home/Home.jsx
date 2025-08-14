import React from 'react';
import ScrollingBanners from '../../components/Home/ScrollingBanners/ScrollingBanners';
import FlashSale from '../../components/Home/FlashSale/FlashSale';
import SuggestedProducts from '../../components/Home/SuggestedProducts/SuggestedProducts';
import CustomPCBanner from '../../components/Home/CustomPCBanner/CustomPCBanner';
import TrustedPartners from '../../components/Home/TrustedPartners/TrustedPartners';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePage}>
      {/* 1. Scrolling Banners */}
      <section className={styles.heroSection}>
        <ScrollingBanners />
      </section>

      {/* 2. Flash Sale Section */}
      <section className={styles.flashSaleSection}>
        <FlashSale />
      </section>

      {/* 3. Suggested Products */}
      <section className={styles.suggestedSection}>
        <SuggestedProducts />
      </section>

      {/* 4. Custom PC Builder Banner */}
      <section className={styles.pcBuilderSection}>
        <CustomPCBanner />
      </section>

      {/* 5. Trusted Partners */}
      <section className={styles.partnersSection}>
        <TrustedPartners />
      </section>
    </div>
  );
};

export default Home;
