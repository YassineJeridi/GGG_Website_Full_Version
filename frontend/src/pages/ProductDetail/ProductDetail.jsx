import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BreadcrumbNavigation from '../../components/ProductDetail/BreadcrumbNavigation/BreadcrumbNavigation';
import ProductImageGallery from '../../components/ProductDetail/ProductImageGallery/ProductImageGallery';
import ProductInfo from '../../components/ProductDetail/ProductInfo/ProductInfo';
import ProductSpecs from '../../components/ProductDetail/ProductSpecs/ProductSpecs';
import ProductReviews from '../../components/ProductDetail/ProductReviews/ProductReviews';
import RelatedProducts from '../../components/ProductDetail/RelatedProducts/RelatedProducts';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import useProductDetail from '../../hooks/useProductDetail';
import ApiService from '../../services/api';
import styles from './ProductDetail.module.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState([]);

  const {
    product,
    relatedProducts,
    reviews,
    loading,
    reviewsLoading,
    error,
    refetch,
    addReview
  } = useProductDetail(id);

  const handleAddToCart = useCallback(async (product, quantity = 1) => {
    try {
      const response = await ApiService.addToCart(product._id || product.id, quantity);
      if (response.success) {
        toast.success(`${quantity} x ${product.name} added to cart!`);
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

  const handleAddReview = useCallback(async (reviewData) => {
    try {
      await addReview(reviewData);
      toast.success('Review added successfully!');
      return true;
    } catch (error) {
      if (error.message.includes('401')) {
        toast.error('Please login to add a review');
      } else {
        toast.error('Failed to add review');
      }
      return false;
    }
  }, [addReview]);

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Product Not Found</h2>
          <p>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={handleRetry} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={() => navigate('/products')} className={styles.backButton}>
              Back to Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Product Not Found</h2>
          <p>The product you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/products')} className={styles.backButton}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: product.category, path: `/products?category=${product.category}` },
    { label: product.name }
  ];

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        <BreadcrumbNavigation items={breadcrumbItems} />

        {/* Main Product Section */}
        <div className={styles.productSection}>
          <div className={styles.imageSection}>
            <ProductImageGallery 
              images={product.images} 
              productName={product.name} 
            />
          </div>

          <div className={styles.infoSection}>
            <ProductInfo
              product={product}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              isInWishlist={wishlistItems.includes(product._id || product.id)}
            />
          </div>
        </div>

        {/* Specifications Section */}
        <div className={styles.specsSection}>
          <ProductSpecs product={product} />
        </div>

        {/* Reviews Section */}
        <div className={styles.reviewsSection}>
          <ProductReviews
            product={product}
            reviews={reviews}
            onAddReview={handleAddReview}
            loading={reviewsLoading}
          />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <RelatedProducts
              products={relatedProducts}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              wishlistItems={wishlistItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
