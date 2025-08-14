import React, { useState, useEffect } from 'react';
import { FiClock, FiZap } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../ProductCard/ProductCard';
import { toast } from 'react-toastify';
import styles from './FlashSale.module.css';

const FlashSale = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loading, setLoading] = useState(true);
  const [hasActiveFlashSale, setHasActiveFlashSale] = useState(false);
  const [flashSaleEndDate, setFlashSaleEndDate] = useState(null);
  const { addToCart } = useCart();

  // Fetch flash sale products based on venteFlash.active = true
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        
        // Fetch all products to filter client-side for venteFlash.active
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?limit=50`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.products) {
          // Filter products where venteFlash.active is true and venteFlash.endDate is in the future
          const currentDate = new Date();
          const activeFlashSaleProducts = data.data.products.filter(product => {
            if (!product.venteFlash || !product.venteFlash.active) {
              return false;
            }
            
            // Check if flash sale is still valid (endDate is in the future)
            const endDate = new Date(product.venteFlash.endDate);
            return endDate > currentDate;
          });

          console.log('Active flash sale products found:', activeFlashSaleProducts.length);

          if (activeFlashSaleProducts.length > 0) {
            setFlashSaleProducts(activeFlashSaleProducts.slice(0, 8)); // Limit to 8 products
            setHasActiveFlashSale(true);
            
            // Set the earliest end date for countdown
            const earliestEndDate = activeFlashSaleProducts.reduce((earliest, product) => {
              const endDate = new Date(product.venteFlash.endDate);
              return !earliest || endDate < earliest ? endDate : earliest;
            }, null);
            
            setFlashSaleEndDate(earliestEndDate);
          } else {
            console.log('No active flash sale products found');
            setHasActiveFlashSale(false);
            setFlashSaleProducts([]);
          }
        } else {
          console.log('No products data received');
          setHasActiveFlashSale(false);
        }
      } catch (error) {
        console.error('Error fetching flash sale products:', error);
        setHasActiveFlashSale(false);
        setFlashSaleProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Countdown timer for flash sale based on actual endDate
  useEffect(() => {
    if (!flashSaleEndDate) return;

    const calculateTimeRemaining = () => {
      const now = new Date();
      const timeDiff = flashSaleEndDate.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeRemaining({ hours, minutes, seconds });
      } else {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
        // Flash sale ended, refresh the products
        setHasActiveFlashSale(false);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [flashSaleEndDate]);

  const handleAddToCart = (product) => {
    // Calculate discounted price for cart
    const originalPrice = product.originalPrice || product.price;
    const discount = product.venteFlash?.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount / 100);
    
    // Create modified product object with discounted price for cart
    const cartProduct = {
      ...product,
      price: discountedPrice,
      originalPrice: originalPrice
    };

    addToCart(cartProduct, 1);
    toast.success(`${product.name} added to cart with ${discount}% discount!`);
  };

  // Don't render the component if no active flash sale products
  if (loading) {
    return (
      <div className={styles.flashSaleContainer}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Checking for Flash Sale Products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Return null if no active flash sale products
  if (!hasActiveFlashSale || flashSaleProducts.length === 0) {
    return null; // Component will not be displayed
  }

  return (
    <div className={styles.flashSaleContainer}>
      <div className={styles.container}>
        {/* Flash Sale Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <FiZap className={styles.flashIcon} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Flash Sale</h2>
              <p className={styles.sectionSubtitle}>
                Limited Time Offers - Up to {Math.max(...flashSaleProducts.map(p => p.venteFlash?.discount || 0))}% Off!
              </p>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className={styles.countdownContainer}>
            <div className={styles.timerLabel}>
              <FiClock className={styles.clockIcon} />
              <span>Ends in:</span>
            </div>
            <div className={styles.countdown}>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{String(timeRemaining.hours).padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Hours</span>
              </div>
              <div className={styles.timeSeparator}>:</div>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{String(timeRemaining.minutes).padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Min</span>
              </div>
              <div className={styles.timeSeparator}>:</div>
              <div className={styles.timeUnit}>
                <span className={styles.timeValue}>{String(timeRemaining.seconds).padStart(2, '0')}</span>
                <span className={styles.timeLabel}>Sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Products Grid */}
        <div className={styles.productsGrid}>
          {flashSaleProducts.map((product) => {
            // Calculate discounted price for display
            const originalPrice = product.originalPrice || product.price;
            const discount = product.venteFlash?.discount || 0;
            const discountedPrice = originalPrice - (originalPrice * discount / 100);
            
            // Create modified product object with discounted price for display
            const displayProduct = {
              ...product,
              price: discountedPrice,
              originalPrice: originalPrice
            };

            return (
              <div key={product._id || product.id} className={styles.productWrapper}>
                <div className={styles.flashBadge}>
                  <FiZap className={styles.badgeIcon} />
                  <span>Flash Sale</span>
                </div>
                
                {/* Discount percentage badge */}
                <div className={styles.discountBadge}>
                  -{discount}%
                </div>

                <ProductCard
                  product={displayProduct}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={() => {}} // Implement if needed
                  isInWishlist={false}
                />
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className={styles.viewAllContainer}>
          <a href="/products?flashSale=true" className={styles.viewAllButton}>
            View All Flash Sale Products ({flashSaleProducts.length})
          </a>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;
