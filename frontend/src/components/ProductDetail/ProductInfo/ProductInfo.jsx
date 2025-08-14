import React, { useState } from 'react';
import { FiStar, FiShoppingCart, FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { toast } from 'react-toastify';
import QuantitySelector from '../QuantitySelector/QuantitySelector';
import styles from './ProductInfo.module.css';

const ProductInfo = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  isInWishlist = false 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const renderRating = () => {
    const rating = product.rating || 0;
    const numReviews = product.numReviews || product.reviews?.length || 0;
    
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
          {rating.toFixed(1)} ({numReviews} review{numReviews !== 1 ? 's' : ''})
        </span>
      </div>
    );
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(product, quantity);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description.substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const calculateDiscount = () => {
    if (product.originalPrice && product.originalPrice > product.price) {
      const discount = ((product.originalPrice - product.price) / product.originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div className={styles.productInfo}>
      {/* Brand and Category */}
      <div className={styles.productMeta}>
        <span className={styles.brand}>{product.brand}</span>
        <span className={styles.category}>{product.category}</span>
      </div>

      {/* Product Name */}
      <h1 className={styles.productName}>{product.name}</h1>

      {/* Rating */}
      {renderRating()}

      {/* Price Section */}
      <div className={styles.priceSection}>
        <div className={styles.priceContainer}>
          <span className={styles.currentPrice}>
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <>
              <span className={styles.originalPrice}>
                {formatPrice(product.originalPrice)}
              </span>
              <span className={styles.discount}>-{discount}%</span>
            </>
          )}
        </div>
        
        {/* Stock Status */}
        <div className={styles.stockStatus}>
          {product.stock > 0 ? (
            <span className={styles.inStock}>
              ✓ In Stock ({product.stock} available)
            </span>
          ) : (
            <span className={styles.outOfStock}>
              ✗ Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className={styles.description}>
        <p>{product.description}</p>
      </div>

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className={styles.features}>
          <h3>Key Features:</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Purchase Section */}
      <div className={styles.purchaseSection}>
        <div className={styles.quantitySection}>
          <label className={styles.quantityLabel}>Quantity:</label>
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            max={product.stock}
            disabled={product.stock === 0}
          />
        </div>

        <div className={styles.actionButtons}>
          <button
            className={`${styles.addToCartBtn} ${isLoading ? styles.loading : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
          >
            <FiShoppingCart />
            {isLoading ? 'Adding...' : 'Add to Cart'}
          </button>

          <button
            className={`${styles.wishlistBtn} ${isInWishlist ? styles.inWishlist : ''}`}
            onClick={() => onToggleWishlist(product)}
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart />
          </button>

          <button
            className={styles.shareBtn}
            onClick={handleShare}
            aria-label="Share product"
          >
            <FiShare2 />
          </button>
        </div>
      </div>

      {/* Product Benefits */}
      <div className={styles.benefits}>
        <div className={styles.benefit}>
          <FiTruck className={styles.benefitIcon} />
          <div>
            <strong>Free Delivery</strong>
            <p>On orders over 100 TND</p>
          </div>
        </div>
        <div className={styles.benefit}>
          <FiShield className={styles.benefitIcon} />
          <div>
            <strong>Warranty</strong>
            <p>{product.warranty?.duration || '1 Year'} manufacturer warranty</p>
          </div>
        </div>
        <div className={styles.benefit}>
          <FiRefreshCw className={styles.benefitIcon} />
          <div>
            <strong>Easy Returns</strong>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
