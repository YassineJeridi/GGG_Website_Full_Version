import React from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import styles from './ProductFilters.module.css';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  filterOptions, 
  onClearFilters,
  isVisible,
  onToggleVisibility 
}) => {
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      ...filters,
      [filterType]: value
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => 
    filter !== '' && filter !== null && filter !== undefined
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button 
        className={styles.mobileToggle}
        onClick={onToggleVisibility}
      >
        <FiFilter />
        <span>Filters</span>
        {hasActiveFilters && <span className={styles.activeIndicator} />}
      </button>

      {/* Filters Panel */}
      <div className={`${styles.filtersPanel} ${isVisible ? styles.visible : ''}`}>
        <div className={styles.filtersHeader}>
          <h3>Filters</h3>
          <div className={styles.headerActions}>
            {hasActiveFilters && (
              <button 
                onClick={onClearFilters}
                className={styles.clearButton}
              >
                Clear All
              </button>
            )}
            <button 
              className={styles.closeButton}
              onClick={onToggleVisibility}
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className={styles.filtersContent}>
          {/* Category Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Brand</label>
            <select
              value={filters.brand || ''}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Brands</option>
              {filterOptions.brands.map(brand => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Price Range (TND)</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className={styles.priceInput}
              />
              <span className={styles.priceSeparator}>to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className={styles.priceInput}
              />
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className={styles.activeFilters}>
              <h4>Active Filters:</h4>
              <div className={styles.filterTags}>
                {filters.category && (
                  <span className={styles.filterTag}>
                    Category: {filters.category}
                    <button onClick={() => handleFilterChange('category', '')}>
                      <FiX />
                    </button>
                  </span>
                )}
                {filters.brand && (
                  <span className={styles.filterTag}>
                    Brand: {filters.brand}
                    <button onClick={() => handleFilterChange('brand', '')}>
                      <FiX />
                    </button>
                  </span>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <span className={styles.filterTag}>
                    Price: {filters.minPrice || '0'} - {filters.maxPrice || '∞'} TND
                    <button onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                    }}>
                      <FiX />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isVisible && <div className={styles.overlay} onClick={onToggleVisibility} />}
    </>
  );
};

export default ProductFilters;
