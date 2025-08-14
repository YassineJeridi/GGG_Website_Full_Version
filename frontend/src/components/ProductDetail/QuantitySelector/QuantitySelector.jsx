import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import styles from './QuantitySelector.module.css';

const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  min = 1, 
  max = 99, 
  disabled = false 
}) => {
  const handleIncrease = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className={styles.quantitySelector}>
      <button
        className={styles.quantityButton}
        onClick={handleDecrease}
        disabled={quantity <= min || disabled}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>
      
      <input
        type="number"
        className={styles.quantityInput}
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        aria-label="Quantity"
      />
      
      <button
        className={styles.quantityButton}
        onClick={handleIncrease}
        disabled={quantity >= max || disabled}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
};

export default QuantitySelector;
