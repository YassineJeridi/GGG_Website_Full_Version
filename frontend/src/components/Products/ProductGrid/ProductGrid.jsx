import React from 'react';
import ProductCard from '../../ProductCard/ProductCard';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import styles from './ProductGrid.module.css';

const ProductGrid = ({ 
  products, 
  loading, 
  onAddToCart, 
  onToggleWishlist,
  wishlistItems = [] 
}) => {
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📦</div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id || product.id || `product-${index}`}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={wishlistItems.includes(product._id || product.id)}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
