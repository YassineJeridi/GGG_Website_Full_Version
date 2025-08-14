import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import styles from './ProductCard.module.css';

const ProductCard = ({ product, onToggleWishlist, isInWishlist = false }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addToCart(product, 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = () => {
    const productId = product._id || product.id;
    if (productId) {
      navigate(`/product/${productId}`);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const getImageSrc = () => {
    if (imageError) {
      return '/placeholder-image.jpg';
    }
    
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      const imageUrl = typeof firstImage === 'object' ? firstImage.url : firstImage;
      
      if (imageUrl.startsWith('uploads/')) {
        return `http://localhost:5000/${imageUrl}`;
      }
      
      return imageUrl;
    }
    
    return '/placeholder-image.jpg';
  };

  const renderRating = () => {
    const rating = product.rating || 0;
    const numReviews = product.numReviews || 0;
    
    return (
      <div className={styles.rating}>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map(star => (
            <FiStar
              key={star}
              className={star <= rating ? styles.starFilled : styles.starEmpty}
            />
          ))}
        </div>
        <span className={styles.ratingText}>
          {rating.toFixed(1)} ({numReviews})
        </span>
      </div>
    );
  };

  return (
    <div className={styles.productCard}>
      <div className={styles.imageContainer} onClick={handleProductClick}>
        <img
          src={getImageSrc()}
          alt={product.name}
          className={styles.productImage}
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className={styles.imageOverlay}>
          <button
            className={styles.actionButton}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
          >
            <FiHeart className={isInWishlist ? styles.heartFilled : styles.heart} />
          </button>
          <button 
            className={styles.actionButton} 
            onClick={(e) => {
              e.stopPropagation();
              handleProductClick();
            }}
          >
            <FiEye />
          </button>
        </div>
      </div>

      <div className={styles.productInfo}>
        <div className={styles.productBrand}>{product.brand}</div>
        <h3 className={styles.productName} onClick={handleProductClick}>
          {product.name}
        </h3>
        <p className={styles.productDescription}>
          {product.description.substring(0, 100)}...
        </p>
        
        {renderRating()}

        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className={styles.stockInfo}>
          {product.stock > 0 ? (
            <span className={styles.inStock}>In Stock ({product.stock})</span>
          ) : (
            <span className={styles.outOfStock}>Out of Stock</span>
          )}
        </div>

        <button
          className={`${styles.addToCartButton} ${isLoading ? styles.loading : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          disabled={product.stock === 0 || isLoading}
        >
          <FiShoppingCart />
          {isLoading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
