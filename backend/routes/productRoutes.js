const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  // ✅ NEW: Import new functions
  getFlashSaleProducts,
  getSuggestedProducts,
  getFeaturedProducts,
  getProductsByCategory
} = require('../controllers/productController');

const router = express.Router();

// ✅ NEW: Special routes (must come before /:id route)
router.get('/flash-sale', getFlashSaleProducts);
router.get('/suggested', getSuggestedProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);

// Main routes
router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct);

router.route('/:id/reviews')
  .post(createProductReview);

module.exports = router;
