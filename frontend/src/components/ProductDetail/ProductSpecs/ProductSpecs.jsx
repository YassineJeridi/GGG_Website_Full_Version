import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './ProductSpecs.module.css';

const ProductSpecs = ({ product }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!product || !product.specifications) {
    return null;
  }

  const specs = product.specifications;
  const specsEntries = typeof specs === 'object' ? Object.entries(specs) : [];

  if (specsEntries.length === 0) {
    return null;
  }

  return (
    <div className={styles.specsContainer}>
      <div className={styles.specsHeader}>
        <h3>Technical Specifications</h3>
        <button
          className={styles.toggleButton}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse specifications' : 'Expand specifications'}
        >
          {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
        </button>
      </div>

      {isExpanded && (
        <div className={styles.specsContent}>
          <div className={styles.specsGrid}>
            {specsEntries.map(([key, value], index) => (
              <div key={index} className={styles.specRow}>
                <div className={styles.specLabel}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
                <div className={styles.specValue}>
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* Additional product details */}
          {product.dimensions && (
            <div className={styles.additionalSpecs}>
              <h4>Dimensions & Weight</h4>
              <div className={styles.specsGrid}>
                {product.dimensions.length && (
                  <div className={styles.specRow}>
                    <div className={styles.specLabel}>Length</div>
                    <div className={styles.specValue}>{product.dimensions.length} mm</div>
                  </div>
                )}
                {product.dimensions.width && (
                  <div className={styles.specRow}>
                    <div className={styles.specLabel}>Width</div>
                    <div className={styles.specValue}>{product.dimensions.width} mm</div>
                  </div>
                )}
                {product.dimensions.height && (
                  <div className={styles.specRow}>
                    <div className={styles.specLabel}>Height</div>
                    <div className={styles.specValue}>{product.dimensions.height} mm</div>
                  </div>
                )}
                {product.weight && (
                  <div className={styles.specRow}>
                    <div className={styles.specLabel}>Weight</div>
                    <div className={styles.specValue}>{product.weight} kg</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warranty Information */}
          {product.warranty && (
            <div className={styles.additionalSpecs}>
              <h4>Warranty Information</h4>
              <div className={styles.specsGrid}>
                <div className={styles.specRow}>
                  <div className={styles.specLabel}>Duration</div>
                  <div className={styles.specValue}>{product.warranty.duration}</div>
                </div>
                {product.warranty.type && (
                  <div className={styles.specRow}>
                    <div className={styles.specLabel}>Type</div>
                    <div className={styles.specValue}>{product.warranty.type}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSpecs;
