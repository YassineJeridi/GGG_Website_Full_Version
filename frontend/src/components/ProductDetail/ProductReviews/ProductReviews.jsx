import React, { useState } from 'react';
import { FiStar, FiUser, FiThumbsUp, FiFlag } from 'react-icons/fi';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import styles from './ProductReviews.module.css';

const ProductReviews = ({ 
  product, 
  reviews = [], 
  onAddReview, 
  loading = false 
}) => {
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    name: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating) => {
    setReviewForm(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (reviewForm.rating === 0 || !reviewForm.comment.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const success = await onAddReview({
        rating: reviewForm.rating,
        comment: reviewForm.comment.trim(),
        name: reviewForm.name.trim() || 'Anonymous'
      });

      if (success) {
        setReviewForm({ rating: 0, comment: '', name: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = (reviewId) => {
    setHelpfulReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating] = (distribution[review.rating] || 0) + 1;
    });
    return distribution;
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            className={`${styles.star} ${
              star <= rating ? styles.starFilled : styles.starEmpty
            } ${interactive ? styles.starInteractive : ''}`}
            onClick={interactive ? () => onStarClick(star) : undefined}
            disabled={!interactive}
          >
            <FiStar />
          </button>
        ))}
      </div>
    );
  };

  const renderRatingDistribution = () => {
    const distribution = getRatingDistribution();
    const totalReviews = reviews.length;

    return (
      <div className={styles.ratingDistribution}>
        {[5, 4, 3, 2, 1].map(rating => {
          const count = distribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className={styles.distributionRow}>
              <span className={styles.ratingLabel}>{rating} stars</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className={styles.countLabel}>({count})</span>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={styles.reviewsContainer}>
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.reviewsContainer}>
      <div className={styles.reviewsHeader}>
        <h2>Customer Reviews & Ratings</h2>
        
        {reviews.length > 0 && (
          <div className={styles.reviewsSummary}>
            <div className={styles.averageRating}>
              <span className={styles.averageScore}>
                {calculateAverageRating()}
              </span>
              {renderStars(Math.round(calculateAverageRating()))}
              <span className={styles.totalReviews}>
                Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className={styles.distributionContainer}>
              {renderRatingDistribution()}
            </div>
          </div>
        )}

        <button
          className={styles.writeReviewBtn}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className={styles.reviewForm}>
          <h3>Write Your Review</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Your Rating *</label>
              <div className={styles.ratingInput}>
                {renderStars(reviewForm.rating, true, handleRatingChange)}
                <span className={styles.ratingText}>
                  {reviewForm.rating > 0 && `${reviewForm.rating} star${reviewForm.rating !== 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reviewerName">Your Name</label>
              <input
                type="text"
                id="reviewerName"
                name="name"
                value={reviewForm.name}
                onChange={handleInputChange}
                placeholder="Enter your name (optional)"
                className={styles.nameInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reviewComment">Your Review *</label>
              <textarea
                id="reviewComment"
                name="comment"
                value={reviewForm.comment}
                onChange={handleInputChange}
                placeholder="Share your thoughts about this product..."
                rows="5"
                required
                className={styles.commentTextarea}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={submitting || reviewForm.rating === 0 || !reviewForm.comment.trim()}
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className={styles.reviewsList}>
        {reviews.length === 0 ? (
          <div className={styles.noReviews}>
            <FiUser className={styles.noReviewsIcon} />
            <h3>No Reviews Yet</h3>
            <p>Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <div className={styles.avatarPlaceholder}>
                    <FiUser />
                  </div>
                  <div>
                    <span className={styles.reviewerName}>
                      {review.name || 'Anonymous'}
                    </span>
                    <div className={styles.reviewMeta}>
                      {renderStars(review.rating)}
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewContent}>
                <p>{review.comment}</p>
              </div>

              <div className={styles.reviewActions}>
                <button
                  className={`${styles.helpfulBtn} ${
                    helpfulReviews.includes(index) ? styles.helpfulActive : ''
                  }`}
                  onClick={() => handleMarkHelpful(index)}
                >
                  <FiThumbsUp />
                  Helpful ({helpfulReviews.includes(index) ? '1' : '0'})
                </button>
                
                <button className={styles.reportBtn}>
                  <FiFlag />
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
