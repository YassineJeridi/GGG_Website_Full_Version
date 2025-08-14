import React, { useState } from 'react';
import { FiSend, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';
import styles from './ContactForm.module.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendToTelegram = async (contactData) => {
    const telegramToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    
    if (!telegramToken || !chatId) {
      throw new Error('Telegram configuration is missing');
    }

    const message = `
🎮 **NEW CONTACT MESSAGE - GGG STORE** 🎮

👤 **Customer Information:**
• **Name:** ${contactData.name}
• **Email:** ${contactData.email}
• **Phone:** ${contactData.phone || 'Not provided'}

📋 **Subject:** ${contactData.subject || 'General Inquiry'}

💬 **Message:**
${contactData.message}

📅 **Received:** ${new Date().toLocaleString('en-US', { 
  timeZone: 'Africa/Tunis',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})} (Tunisia Time)

🏪 **Store:** Good Game Guys (GGG)
📧 **Reply to:** ${contactData.email}
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
      const errorData = await response.json();
      throw new Error(`Failed to send message: ${errorData.description || 'Unknown error'}`);
    }

    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields (Name, Email, Message)');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('Please provide a more detailed message (at least 10 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      await sendToTelegram(formData);
      
      toast.success('✅ Message sent successfully! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      if (error.message.includes('Telegram configuration')) {
        toast.error('Contact form is temporarily unavailable. Please call us directly at +216 25 910 385');
      } else {
        toast.error('Failed to send message. Please try again or contact us directly.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const subjectOptions = [
    { value: '', label: 'Select a subject...' },
    { value: 'Product Inquiry', label: '🎮 Product Inquiry' },
    { value: 'Technical Support', label: '🔧 Technical Support' },
    { value: 'Order Status', label: '📦 Order Status' },
    { value: 'Custom PC Build', label: '🖥️ Custom PC Build' },
    { value: 'Price Quote', label: '💰 Price Quote' },
    { value: 'Return/Exchange', label: '🔄 Return/Exchange' },
    { value: 'Partnership', label: '🤝 Partnership' },
    { value: 'General Question', label: '❓ General Question' }
  ];

  return (
    <div className={styles.contactForm} id="contact-form">
      <div className={styles.formHeader}>
        <h2>Send Us a Message</h2>
        <p>Fill out the form below and we'll respond within 24 hours</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name & Email Row */}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="name">
              Full Name *
            </label>
            <div className={styles.inputWrapper}>
              <FiUser className={styles.inputIcon} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          
          <div className={styles.formField}>
            <label htmlFor="email">
              Email Address *
            </label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Phone & Subject Row */}
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="phone">
              Phone Number
            </label>
            <div className={styles.inputWrapper}>
              <FiPhone className={styles.inputIcon} />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+216 25 910 385"
              />
            </div>
          </div>
          
          <div className={styles.formField}>
            <label htmlFor="subject">
              Subject
            </label>
            <div className={styles.inputWrapper}>
              <FiMessageSquare className={styles.inputIcon} />
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={styles.selectInput}
              >
                {subjectOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Message Field */}
        <div className={styles.formField}>
          <label htmlFor="message">
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Tell us how we can help you with your gaming needs..."
            rows="6"
            required
            className={styles.textareaInput}
          />
          <small className={styles.charCount}>
            {formData.message.length}/500 characters
          </small>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className={styles.spinner}></div>
              <span>Sending to our team...</span>
            </>
          ) : (
            <>
              <FiSend className={styles.buttonIcon} />
              <span>Send Message</span>
            </>
          )}
        </button>
        
        {/* Form Footer */}
        <div className={styles.formFooter}>
          <p>
            <FiCheck className={styles.checkIcon} />
            We respect your privacy and will never share your information
          </p>
          <p>
            <FiCheck className={styles.checkIcon} />
            Expect a response within 24 hours during business days
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
