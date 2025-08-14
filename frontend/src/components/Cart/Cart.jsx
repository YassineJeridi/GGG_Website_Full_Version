import React, { useState } from 'react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCart } from '../../context/CartContext';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import styles from './Cart.module.css';

const Cart = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice
  } = useCart();

  const [showCheckout, setShowCheckout] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    setShowCheckout(true);
  };

  const handleCheckoutSuccess = () => {
    setShowCheckout(false);
    clearCart();
    closeCart();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Cart Overlay */}
      <div className={styles.overlay} onClick={closeCart} />
      
      {/* Cart Panel */}
      <div className={styles.cartPanel}>
        {/* Cart Header */}
        <div className={styles.cartHeader}>
          <h2>
            <FiShoppingBag /> Shopping Cart ({items.length})
          </h2>
          <button className={styles.closeButton} onClick={closeCart}>
            <FiX />
          </button>
        </div>

        {/* Cart Content */}
        <div className={styles.cartContent}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <FiShoppingBag className={styles.emptyIcon} />
              <h3>Your cart is empty</h3>
              <p>Add some products to get started!</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className={styles.cartItems}>
                {items.map((item) => (
                  <div key={item._id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img
                        src={item.image.startsWith('uploads/') 
                          ? `http://localhost:5000/${item.image}` 
                          : item.image
                        }
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>

                    <div className={styles.itemDetails}>
                      <h4 className={styles.itemName}>{item.name}</h4>
                      <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                      
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FiMinus />
                        </button>
                        
                        <span className={styles.quantity}>{item.quantity}</span>
                        
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <FiPlus />
                        </button>
                      </div>

                      <p className={styles.itemTotal}>
                        Total: {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      className={styles.removeButton}
                      onClick={() => removeFromCart(item._id)}
                      title="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Footer */}
              <div className={styles.cartFooter}>
                <div className={styles.totalSection}>
                  <div className={styles.totalPrice}>
                    <strong>Total: {formatPrice(getTotalPrice())}</strong>
                  </div>
                  
                  <div className={styles.footerActions}>
                    <button
                      className={styles.clearButton}
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                    
                    <button
                      className={styles.checkoutButton}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckout && (
        <CheckoutForm
          items={items}
          total={getTotalPrice()}
          onSuccess={handleCheckoutSuccess}
          onCancel={() => setShowCheckout(false)}
        />
      )}
    </>
  );
};

export default Cart;
