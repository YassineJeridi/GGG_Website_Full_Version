import React, { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import ProductSearch from '../../components/Products/ProductSearch/ProductSearch';
import ProductFilters from '../../components/Products/ProductFilters/ProductFilters';
import ProductSorting from '../../components/Products/ProductSorting/ProductSorting';
import ProductGrid from '../../components/Products/ProductGrid/ProductGrid';
import Pagination from '../../components/Products/Pagination/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import useProducts from '../../hooks/useProducts';
import ApiService from '../../services/api';
import styles from './Products.module.css';

const Products = () => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  const {
    products,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    totalPages,
    totalProducts,
    loading,
    error,
    filterOptions,
    refetch
  } = useProducts();

  // ✅ Memoized callback handlers to prevent re-renders
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  }, [setFilters]);

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, [setFilters]);

  const handleAddToCart = useCallback(async (product) => {
    try {
      const response = await ApiService.addToCart(product._id || product.id, 1);
      if (response.success) {
        toast.success(`${product.name} added to cart!`);
      }
    } catch (error) {
      if (error.message.includes('401')) {
        toast.error('Please login to add items to cart');
      } else {
        toast.error('Failed to add product to cart');
      }
    }
  }, []);

  const handleToggleWishlist = useCallback((product) => {
    setWishlistItems(prev => {
      const productId = product._id || product.id;
      const isInWishlist = prev.includes(productId);
      if (isInWishlist) {
        toast.info(`${product.name} removed from wishlist`);
        return prev.filter(id => id !== productId);
      } else {
        toast.success(`${product.name} added to wishlist!`);
        return [...prev, productId];
      }
    });
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleRetry} className={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.productsPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1>Our Products</h1>
          <p>Discover our complete collection of gaming hardware and accessories</p>
        </div>

        {/* ✅ UPDATED: Mobile-only search bar */}
        <div className={styles.mobileSearchContainer}>
          <ProductSearch onSearch={handleSearch} />
        </div>

        <div className={styles.productsContent}>
          <aside className={styles.sidebar}>
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              filterOptions={filterOptions}
              onClearFilters={handleClearFilters}
              isVisible={filtersVisible}
              onToggleVisibility={() => setFiltersVisible(!filtersVisible)}
            />
          </aside>

          <main className={styles.mainContent}>
            <ProductSorting
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalProducts={totalProducts}
            />

            {loading && products.length === 0 ? (
              <div className={styles.initialLoadingContainer}>
                <LoadingSpinner size="large" />
                <p>Loading products...</p>
              </div>
            ) : (
              <>
                <ProductGrid
                  products={products}
                  loading={loading}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistItems={wishlistItems}
                />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
