import React, { useState } from 'react';
import { FiX, FiMapPin, FiEdit3, FiLoader } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './CheckoutForm.module.css';

const CheckoutForm = ({ items, total, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    addressType: 'text', // 'text' or 'location'
    address: '',
    location: { lat: '', lng: '', address: '' }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND'
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      addressType: type,
      address: type === 'location' ? '' : prev.address,
      location: type === 'text' ? { lat: '', lng: '', address: '' } : prev.location
    }));
  };

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Geolocation is not supported by this browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      
      setFormData(prev => ({
        ...prev,
        location: {
          lat: latitude.toString(),
          lng: longitude.toString(),
          address: `Tunisia - Coordinates: ${locationString}`
        }
      }));
      
      toast.success('Location obtained successfully!');
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Please allow location access to use this feature');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location unavailable. Please enter address manually');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out. Please try again');
          break;
        default:
          toast.error('Failed to get location. Please enter address manually');
          break;
      }
    }
  );
};


  const sendToTelegram = async (orderData) => {
    const telegramToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!telegramToken || !chatId) {
      throw new Error('Telegram configuration is missing');
    }

    const message = `
🛒 **NEW ORDER** 🛒

👤 **Customer Information:**
• Name: ${orderData.firstName} ${orderData.lastName}
• Phone: ${orderData.phone}
• Email: ${orderData.email || 'Not provided'}

📍 **Delivery Address:**
${orderData.addressType === 'location' 
  ? `📍 Location: ${orderData.location.address}\n🗺️ Coordinates: ${orderData.location.lat}, ${orderData.location.lng}` 
  : `📮 Address: ${orderData.address}`
}

🛍️ **Order Items:**
${orderData.items.map(item => 
  `• ${item.name}\n  Quantity: ${item.quantity}\n  Unit Price: ${formatPrice(item.price)}\n  Subtotal: ${formatPrice(item.price * item.quantity)}\n`
).join('\n')}

💰 **Total Amount: ${formatPrice(orderData.total)}**

📅 **Order Date:** ${new Date().toLocaleString('en-US', { timeZone: 'Africa/Tunis' })}
    `;

    const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Telegram');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.addressType === 'text' && !formData.address.trim()) {
      toast.error('Please provide your address');
      return;
    }

    if (formData.addressType === 'location' && (!formData.location.lat || !formData.location.lng)) {
      toast.error('Please provide your location');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        items,
        total,
        orderDate: new Date().toISOString()
      };

      await sendToTelegram(orderData);
      
      toast.success('Order placed successfully! You will be contacted soon.');
      onSuccess();
      
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Checkout</h2>
          <button className={styles.closeButton} onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Personal Information */}
          <div className={styles.section}>
            <h3>Personal Information</h3>
            
            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="firstName">First Name *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.field}>
                <label htmlFor="lastName">Last Name *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+216 XX XXX XXX"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email Address (Optional)</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className={styles.section}>
            <h3>Delivery Address</h3>
            
            <div className={styles.addressType}>
              <button
                type="button"
                className={`${styles.typeButton} ${formData.addressType === 'text' ? styles.active : ''}`}
                onClick={() => handleAddressTypeChange('text')}
              >
                <FiEdit3 /> Text Address
              </button>
              
              <button
                type="button"
                className={`${styles.typeButton} ${formData.addressType === 'location' ? styles.active : ''}`}
                onClick={() => handleAddressTypeChange('location')}
              >
                <FiMapPin /> Location
              </button>
            </div>

            {formData.addressType === 'text' ? (
              <div className={styles.field}>
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full address..."
                  rows="3"
                  required
                />
              </div>
            ) : (
              <div className={styles.locationSection}>
                <button
                  type="button"
                  className={styles.locationButton}
                  onClick={getCurrentLocation}
                >
                  <FiMapPin /> Get Current Location
                </button>
                
                {formData.location.address && (
                  <div className={styles.locationDisplay}>
                    <p><strong>Selected Location:</strong></p>
                    <p>{formData.location.address}</p>
                    <small>Coordinates: {formData.location.lat}, {formData.location.lng}</small>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className={styles.section}>
            <h3>Order Summary</h3>
            
            <div className={styles.orderItems}>
              {items.map((item) => (
                <div key={item._id} className={styles.orderItem}>
                  <span className={styles.itemName}>
                    {item.name} × {item.quantity}
                  </span>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className={styles.orderTotal}>
              <strong>Total: {formatPrice(total)}</strong>
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiLoader className={styles.spinner} />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
 