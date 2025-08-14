import React from 'react';
import styles from './ProductSorting.module.css';

const ProductSorting = ({ sortBy, onSortChange, totalProducts }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'reviews', label: 'Most Reviewed' }
  ];

  return (
    <div className={styles.sortingContainer}>
      <div className={styles.resultsCount}>
        <span>{totalProducts} product{totalProducts !== 1 ? 's' : ''} found</span>
      </div>
      
      <div className={styles.sortingControls}>
        <label className={styles.sortLabel}>Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={styles.sortSelect}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductSorting;
