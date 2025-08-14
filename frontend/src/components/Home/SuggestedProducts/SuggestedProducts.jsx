import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiStar } from 'react-icons/fi';
import { useCart } from '../../../context/CartContext';
import ProductCard from '../../ProductCard/ProductCard';
import { toast } from 'react-toastify';
import styles from './SuggestedProducts.module.css';

const SuggestedProducts = () => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const fetchRandomProducts = async () => {
    try {
      setLoading(true);
      // Fetch random products by getting all and shuffling, or implementing random endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?limit=20`);
      const data = await response.json();
      
      if (data.success) {
        // Shuffle products randomly
        const shuffled = data.data.products.sort(() => 0.5 - Math.random());
        setSuggestedProducts(shuffled.slice(0, 8));
      }
    } catch (error) {
      console.error('Error fetching suggested products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleRefresh = () => {
    fetchRandomProducts();
  };

  if (loading) {
    return (
      <div className={styles.suggestedContainer}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            <div className={styles.spinner}></div>
            <p>Finding Perfect Products For You...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.suggestedContainer}>
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.titleSection}>
            <div className={styles.iconWrapper}>
              <FiStar className={styles.starIcon} />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Suggested for You</h2>
              <p className={styles.sectionSubtitle}>Handpicked products based on trending items</p>
            </div>
          </div>
          
          <button className={styles.refreshButton} onClick={handleRefresh}>
            <FiRefreshCw className={styles.refreshIcon} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Products Grid */}
        <div className={styles.productsGrid}>
          {suggestedProducts.map((product, index) => (
            <div 
              key={product._id || product.id} 
              className={styles.productWrapper}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onToggleWishlist={() => {}} // Implement if needed
                isInWishlist={false}
              />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className={styles.viewAllContainer}>
          <a href="/products" className={styles.viewAllButton}>
            Explore All Products
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuggestedProducts;
