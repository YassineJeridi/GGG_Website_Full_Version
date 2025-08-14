import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiSearch, 
  FiFilter,
  FiPackage,
  FiGrid,
  FiList,
  FiMoreVertical
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import ApiService from '../../../services/api';
import styles from './ProductManagement.module.css';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    featured: '',
    flashSale: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  const categories = [
    'GraphicsCards',
    'Processors',
    'Memory',
    'Cases',
    'Motherboards',
    'Storage',
    'PowerSupply',
    'Cooling',
    'Peripherals',
    'Gaming-Accessories'
  ];

  const brands = [
    'MSI', 'ASUS', 'NVIDIA', 'AMD', 'Intel', 'Corsair',
    'Cooler Master', 'Razer', 'Logitech', 'HyperX'
  ];

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, searchTerm, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(filters.category && { category: filters.category }),
        ...(filters.brand && { brand: filters.brand }),
        ...(filters.featured && { featured: filters.featured }),
        ...(filters.flashSale && { flashSale: filters.flashSale })
      });

      const response = await ApiService.getProducts(Object.fromEntries(queryParams));
      
      if (response.success) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(productId);
      const response = await ApiService.deleteProduct(productId);
      
      if (response.success) {
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const deletePromises = selectedProducts.map(productId => 
        ApiService.deleteProduct(productId)
      );
      
      await Promise.all(deletePromises);
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete some products');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product._id));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 2
    }).format(price);
  };

  const getStatusBadge = (product) => {
    if (product.venteFlash?.active) {
      return <span className={`${styles.badge} ${styles.flashSale}`}>Flash Sale</span>;
    }
    if (product.isFeatured) {
      return <span className={`${styles.badge} ${styles.featured}`}>Featured</span>;
    }
    if (product.stock === 0) {
      return <span className={`${styles.badge} ${styles.outOfStock}`}>Out of Stock</span>;
    }
    if (product.stock < 5) {
      return <span className={`${styles.badge} ${styles.lowStock}`}>Low Stock</span>;
    }
    return <span className={`${styles.badge} ${styles.inStock}`}>In Stock</span>;
  };

  if (loading && products.length === 0) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className={styles.productManagement}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Product Management</h1>
          <p className={styles.subtitle}>
            Manage your gaming hardware inventory ({pagination.total} products)
          </p>
        </div>
        
        <div className={styles.headerActions}>
          <Link to="/admin/dashboard/products/add" className={styles.addButton}>
            <FiPlus />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={styles.controlsSection}>
        <div className={styles.searchSection}>
          <div className={styles.searchWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search products by name, brand, or category..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
          </div>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <FiFilter className={styles.filterIcon} />
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Products</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <select
              value={filters.flashSale}
              onChange={(e) => handleFilterChange('flashSale', e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Products</option>
              <option value="true">Flash Sale Only</option>
              <option value="false">Regular Products</option>
            </select>
          </div>
        </div>

        <div className={styles.viewControls}>
          <button
            className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <FiGrid />
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => setViewMode('list')}
          >
            <FiList />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className={styles.bulkActions}>
          <div className={styles.bulkInfo}>
            <label className={styles.selectAllLabel}>
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length}
                onChange={handleSelectAll}
              />
              {selectedProducts.length} of {products.length} selected
            </label>
          </div>
          <div className={styles.bulkButtons}>
            <button
              className={styles.bulkDeleteButton}
              onClick={handleBulkDelete}
            >
              <FiTrash2 />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Display */}
      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <FiPackage className={styles.emptyIcon} />
          <h3>No Products Found</h3>
          <p>No products match your current filters. Try adjusting your search criteria or add new products.</p>
          <Link to="/admin/dashboard/products/add" className={styles.addFirstProduct}>
            <FiPlus />
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <div className={`${styles.productsContainer} ${styles[viewMode]}`}>
            {products.map(product => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productHeader}>
                  <label className={styles.selectProduct}>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product._id)}
                      onChange={() => handleSelectProduct(product._id)}
                    />
                  </label>
                  {getStatusBadge(product)}
                </div>

                <div className={styles.productImage}>
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0].url || product.images[0]} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                  ) : (
                    <div className={styles.placeholderImage}>
                      <FiPackage />
                    </div>
                  )}
                </div>

                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productBrand}>{product.brand}</p>
                  <p className={styles.productCategory}>{product.category}</p>
                  
                  <div className={styles.productPricing}>
                    <span className={styles.currentPrice}>
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className={styles.originalPrice}>
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className={styles.productStock}>
                    <span className={styles.stockLabel}>Stock:</span>
                    <span className={`${styles.stockValue} ${product.stock < 5 ? styles.lowStock : ''}`}>
                      {product.stock}
                    </span>
                  </div>
                </div>

                <div className={styles.productActions}>
                  <button
                    className={styles.actionButton}
                    onClick={() => navigate(`/product/${product._id}`)}
                    title="View Product"
                  >
                    <FiEye />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => navigate(`/admin/dashboard/products/edit/${product._id}`)}
                    title="Edit Product"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    onClick={() => handleDeleteProduct(product._id, product.name)}
                    disabled={deleteLoading === product._id}
                    title="Delete Product"
                  >
                    {deleteLoading === product._id ? (
                      <div className={styles.miniSpinner}></div>
                    ) : (
                      <FiTrash2 />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === pagination.pages || 
                    Math.abs(page - pagination.page) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] < page - 1 && (
                        <span className={styles.pageEllipsis}>...</span>
                      )}
                      <button
                        className={`${styles.pageButton} ${page === pagination.page ? styles.active : ''}`}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))
                }
              </div>

              <button
                className={styles.pageButton}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductManagement;
