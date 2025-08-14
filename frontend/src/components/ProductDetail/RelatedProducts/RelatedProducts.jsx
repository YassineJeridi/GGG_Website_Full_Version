import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from '../../ProductCard/ProductCard';
import styles from './RelatedProducts.module.css';

const RelatedProducts = ({ 
  products = [], 
  onAddToCart, 
  onToggleWishlist, 
  wishlistItems = [] 
}) => {
  const scrollContainer = React.useRef(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={styles.relatedProductsContainer}>
      <div className={styles.sectionHeader}>
        <h2>Related Products</h2>
        <p>You might also like these products</p>
      </div>

      <div className={styles.productsWrapper}>
        {/* Navigation Buttons */}
        <button
          className={`${styles.navButton} ${styles.navLeft}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <FiChevronLeft />
        </button>

        <button
          className={`${styles.navButton} ${styles.navRight}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <FiChevronRight />
        </button>

        {/* Products Scroll Container */}
        <div 
          ref={scrollContainer}
          className={styles.productsScroll}
        >
          <div className={styles.productsGrid}>
            {products.map(product => (
              <div key={product._id || product.id} className={styles.productWrapper}>
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={wishlistItems.includes(product._id || product.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
