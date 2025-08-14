import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2 } from 'react-icons/fi';
import styles from './ProductImageGallery.module.css';

const ProductImageGallery = ({ images = [], productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [imageError, setImageError] = useState({});

  const getImageSrc = (image, index) => {
    if (imageError[index]) {
      return '/placeholder-image.jpg';
    }
    
    if (typeof image === 'object' && image.url) {
      return image.url.startsWith('uploads/') 
        ? `http://localhost:5000/${image.url}` 
        : image.url;
    }
    
    return typeof image === 'string' 
      ? (image.startsWith('uploads/') ? `http://localhost:5000/${image}` : image)
      : '/placeholder-image.jpg';
  };

  const handleImageError = (index) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const openLightbox = () => {
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  if (!images || images.length === 0) {
    return (
      <div className={styles.galleryContainer}>
        <div className={styles.mainImage}>
          <img 
            src="/placeholder-image.jpg" 
            alt={productName}
            className={styles.image}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryContainer}>
      {/* Main Image */}
      <div className={styles.mainImage}>
        <img
          src={getImageSrc(images[currentImageIndex], currentImageIndex)}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className={styles.image}
          onError={() => handleImageError(currentImageIndex)}
          onClick={openLightbox}
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
              aria-label="Previous image"
            >
              <FiChevronLeft />
            </button>
            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
              aria-label="Next image"
            >
              <FiChevronRight />
            </button>
          </>
        )}

        {/* Zoom Button */}
        <button
          className={styles.zoomButton}
          onClick={openLightbox}
          aria-label="View full size"
        >
          <FiMaximize2 />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className={styles.imageCounter}>
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {images.map((image, index) => (
            <button
              key={index}
              className={`${styles.thumbnail} ${
                index === currentImageIndex ? styles.activeThumbnail : ''
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={getImageSrc(image, index)}
                alt={`${productName} thumbnail ${index + 1}`}
                onError={() => handleImageError(index)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isLightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.lightboxClose}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <img
              src={getImageSrc(images[currentImageIndex], currentImageIndex)}
              alt={`${productName} - Full size`}
              className={styles.lightboxImage}
            />
            
            {images.length > 1 && (
              <>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxPrev}`}
                  onClick={prevImage}
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button
                  className={`${styles.lightboxNav} ${styles.lightboxNext}`}
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
