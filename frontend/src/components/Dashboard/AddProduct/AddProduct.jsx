import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiX, FiUpload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ApiService from '../../../services/api';
import styles from './AddProduct.module.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand: '',
    category: '',
    price: '',
    originalPrice: '',
    stock: '',
    images: [],
    specifications: {},
    features: [],
    tags: [],
    isFeatured: false,
    venteFlash: {
      active: false,
      startDate: '',
      endDate: '',
      discount: 0
    }
  });

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
    if (isEditing) {
      fetchProduct();
    }
  }, [id, isEditing]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProduct(id);
      if (response.success) {
        setFormData(response.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      navigate('/admin/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('venteFlash.')) {
      const flashField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        venteFlash: {
          ...prev.venteFlash,
          [flashField]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSpecificationChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        stock: parseInt(formData.stock) || 0,
        venteFlash: {
          ...formData.venteFlash,
          discount: parseFloat(formData.venteFlash.discount) || 0
        }
      };

      let response;
      if (isEditing) {
        response = await ApiService.updateProduct(id, productData);
      } else {
        response = await ApiService.createProduct(productData);
      }

      if (response.success) {
        toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully!`);
        navigate('/admin/dashboard/products');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <div className={styles.addProduct}>
      <div className={styles.header}>
        <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/admin/dashboard/products')}
            className={styles.cancelButton}
          >
            <FiX />
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className={styles.saveButton}
          >
            <FiSave />
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          {/* Basic Information */}
          <div className={styles.section}>
            <h2>Basic Information</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="brand">Brand *</label>
                <select
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select brand</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter product description"
                rows="4"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className={styles.section}>
            <h2>Pricing & Stock</h2>
            
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="price">Price (TND) *</label>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="originalPrice">Original Price (TND)</label>
                <input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="stock">Stock Quantity</label>
                <input
                  id="stock"
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Flash Sale */}
          <div className={styles.section}>
            <h2>Flash Sale</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="venteFlash.active"
                  checked={formData.venteFlash.active}
                  onChange={handleInputChange}
                />
                Enable Flash Sale
              </label>
            </div>

            {formData.venteFlash.active && (
              <div className={styles.flashSaleFields}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      id="startDate"
                      type="datetime-local"
                      name="venteFlash.startDate"
                      value={formData.venteFlash.startDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="endDate">End Date</label>
                    <input
                      id="endDate"
                      type="datetime-local"
                      name="venteFlash.endDate"
                      value={formData.venteFlash.endDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="discount">Discount (%)</label>
                    <input
                      id="discount"
                      type="number"
                      name="venteFlash.discount"
                      value={formData.venteFlash.discount}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className={styles.section}>
            <h2>Additional Information</h2>
            
            <div className={styles.inputGroup}>
              <label htmlFor="features">Features (comma-separated)</label>
              <input
                id="features"
                type="text"
                value={formData.features.join(', ')}
                onChange={(e) => handleArrayChange('features', e.target.value)}
                placeholder="High Performance, RGB Lighting, Gaming Optimized"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                id="tags"
                type="text"
                value={formData.tags.join(', ')}
                onChange={(e) => handleArrayChange('tags', e.target.value)}
                placeholder="gaming, pc, hardware"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                Featured Product
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
