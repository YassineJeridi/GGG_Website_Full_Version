import React, { useState, useEffect } from 'react';
import { FiStar, FiZap, FiGift } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../ProductCard/ProductCard';
import { toast } from 'react-toastify';
import styles from './ExclusivePromotions.module.css';

const ExclusivePromotions = () => {
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasActivePromos, setHasActivePromos] = useState(false);
  const { addToCart } = useCart();

  // Fetch exclusive promotion products
  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products or products with high discounts
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?featured=true&limit=30`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.products) {
          // Filter products that have originalPrice > price (indicating a promotion)
          const exclusivePromos = data.data.products.filter(product => {
            return product.originalPrice && product.originalPrice > product.price;
          });

          console.log('Exclusive promotion products found:', exclusivePromos.length);

          if (exclusivePromos.length > 0) {
            setPromoProducts(exclusivePromos.slice(0, 6)); // Limit to 6 products
            setHasActivePromos(true);
          } else {
            // Fallback: Get some featured products
            const fallbackPromos = data.data.products.slice(0, 6);
            setPromoProducts(fallbackPromos);
            setHasActivePromos(fallbackPromos.length > 0);
          }
        } else {
          console.log('No promotion products data received');
          setHasActivePromos(false);
        }
      } catch (error) {
        console.error('Error fetching exclusive promotions:', error);
        setHasActivePromos(false);
        setPromoProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const calculateDiscountPercentage = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Don't r  er if no promotions
  if (loading) {
    return (
      <div className={styles.promoContainer}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Loading Exclusive Promotions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasActivePromos || promoProducts.length === 0) {
    return null;
  }

  return (
    <div className={styles.promoContainer}>
      <div className={styles.container}>
        {/* Exclusive Promotions Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <FiGift className={styles.giftIcon} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Exclusive Promotions</h2>
              <p className={styles.sectionSubtitle}>
                Hand-picked deals just for you - Premium products at unbeatable prices
              </p>
            </div>
          </div>
          
          <div className={styles.exclusiveBadge}>
            <FiStar className={styles.exclusiveIcon} />
            <span>Members Only</span>
          </div>
        </div>

        {/* Promotions Grid */}
        <div className={styles.productsGrid}>
          {promoProducts.map((product, index) => {
            const discount = calculateDiscountPercentage(product.originalPrice, product.price);
            
            return (
              <div key={product._id || product.id} className={styles.productWrapper} style={{ animationDelay: `${index * 0.1}s` }}>
                {discount > 0 && (
                  <div className={styles.exclusiveBadgeCorner}>
                    <FiZap className={styles.badgeIcon} />
                    <span>{discount}% OFF</span>
                  </div>
                )}
                
                <div className={styles.exclusiveIndicator}>
                  <FiStar className={styles.starIcon} />
                  <span>Exclusive</span>
                </div>

                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={() => {}}
                  isInWishlist={false}
                />
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className={styles.viewAllContainer}>
          <a href="/products?featured=true" className={styles.viewAllButton}>
            <FiGift className={styles.buttonIcon} />
            Explore All Exclusive Deals
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExclusivePromotions;
