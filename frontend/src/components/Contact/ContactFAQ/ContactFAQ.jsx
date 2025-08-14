import React, { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import styles from './ContactFAQ.module.css';

const ContactFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: 'Do you have a physical store I can visit?',
      answer: 'No, we operate 100% online to offer better prices and convenience. We don\'t have a physical showroom, but we provide detailed product information, images, and expert consultation via phone and email.'
    },
    {
      question: 'How can I get product recommendations?',
      answer: 'Contact us via phone (+216 25 910 385), email (info@ggguys.store), or the contact form above. Our experts will help you choose the perfect gaming setup based on your budget and requirements.'
    },
    {
      question: 'What are your delivery options in Tunisia?',
      answer: 'We deliver nationwide across Tunisia. Standard delivery takes 2-5 business days, with express options available for Tunis and major cities. Delivery costs vary by location and order value.'
    },
    {
      question: 'Do you offer warranty on products?',
      answer: 'Yes! All products come with manufacturer warranty. Gaming PCs include 1-year comprehensive warranty, and individual components have varying warranty periods as specified by manufacturers.'
    },
    {
      question: 'Can you build custom gaming PCs?',
      answer: 'Absolutely! We specialize in custom gaming PC builds tailored to your budget and performance needs. Contact us with your requirements for a personalized quote and build consultation.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cash on delivery, bank transfers, and popular mobile payment methods in Tunisia. Payment options are confirmed during the order process.'
    },
    {
      question: 'How quickly do you respond to inquiries?',
      answer: 'We respond to emails and contact form messages within 24 hours during business days. For immediate assistance, call us during business hours (09:00-23:00 daily).'
    },
    {
      question: 'Do you offer technical support after purchase?',
      answer: 'Yes! We provide ongoing technical support for all products. Our team can help with installation guidance, troubleshooting, and optimization to ensure your gaming setup performs perfectly.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <div className={styles.faqHeader}>
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our online gaming store</p>
        </div>
        
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <button
                className={`${styles.faqQuestion} ${openFAQ === index ? styles.active : ''}`}
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <div className={styles.faqIcon}>
                  {openFAQ === index ? <FiMinus /> : <FiPlus />}
                </div>
              </button>
              
              <div className={`${styles.faqAnswer} ${openFAQ === index ? styles.open : ''}`}>
                <div className={styles.faqContent}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.faqFooter}>
          <h3>Still have questions?</h3>
          <p>Don't hesitate to reach out - we're here to help!</p>
          <div className={styles.contactOptions}>
            <a href="tel:+21625910385" className={styles.contactOption}>
              📞 Call Us: +216 25 910 385
            </a>
            <a href="mailto:info@ggguys.store" className={styles.contactOption}>
              ✉️ Email: info@ggguys.store
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
