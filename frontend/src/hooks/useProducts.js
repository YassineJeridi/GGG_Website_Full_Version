import { useState, useEffect, useMemo, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const productsPerPage = 12;

  // ✅ Memoize the query params to prevent infinite re-renders
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    
    params.append('page', currentPage);
    params.append('limit', productsPerPage);
    
    if (filters.category) params.append('category', filters.category);
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.search) params.append('search', filters.search);
    if (sortBy) params.append('sort', sortBy);
    
    return params.toString();
  }, [filters, sortBy, currentPage, productsPerPage]);

  // ✅ Memoize the fetch function
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data.products);
        setFilteredProducts(data.data.products);
        setTotalProducts(data.data.pagination.total);
        setTotalPages(data.data.pagination.pages);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  // ✅ Use useEffect properly with dependencies
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ✅ Memoize the filter change handler
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // ✅ Memoize the sort change handler
  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  }, []);

  // ✅ Memoize filter options
  const filterOptions = useMemo(() => ({
    categories: [...new Set(products.map(p => p.category))].sort(),
    brands: [...new Set(products.map(p => p.brand))].sort()
  }), [products]);

  return {
    products: filteredProducts,
    allProducts: filteredProducts,
    filters,
    setFilters: handleFilterChange,
    sortBy,
    setSortBy: handleSortChange,
    currentPage,
    setCurrentPage,
    totalPages,
    totalProducts,
    loading,
    error,
    filterOptions,
    refetch: fetchProducts
  };
};

export default useProducts;
