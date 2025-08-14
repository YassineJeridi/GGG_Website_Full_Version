const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    console.log('=== Starting getProducts function ===');
    console.log('Request query:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    console.log('Pagination:', { page, limit, skip });

    // Build filter object
    let filter = { isActive: true };
    
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }
    
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // ✅ NEW: Filter for flash sale products
    if (req.query.flashSale === 'true') {
      filter['venteFlash.active'] = true;
      filter['venteFlash.endDate'] = { $gt: new Date() };
    }

    // ✅ NEW: Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = parseFloat(req.query.maxPrice);
      }
    }

    // ✅ NEW: Filter for featured products
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }

    console.log('MongoDB filter:', filter);

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { price: 1 };
          break;
        case 'price-high':
          sort = { price: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'popular':
          sort = { numReviews: -1 };
          break;
        case 'discount':
          sort = { 'venteFlash.discount': -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    console.log('MongoDB sort:', sort);

    console.log('Attempting to query database...');
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    console.log('Database query successful, found products:', products.length);

    const total = await Product.countDocuments(filter);
    console.log('Total count:', total);

    res.json({
      success: true,
      data: {
        products: products,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

    console.log('Response sent successfully');

  } catch (error) {
    console.error('=== ERROR in getProducts ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
};

// ✅ NEW: Get flash sale products specifically
// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = async (req, res) => {
  try {
    console.log('Fetching flash sale products...');
    
    const limit = parseInt(req.query.limit) || 12;
    const currentDate = new Date();
    
    const flashSaleProducts = await Product.find({
      'venteFlash.active': true,
      'venteFlash.endDate': { $gt: currentDate },
      isActive: true
    })
    .sort({ 'venteFlash.discount': -1 }) // Sort by highest discount first
    .limit(limit);

    console.log(`Found ${flashSaleProducts.length} active flash sale products`);

    res.json({
      success: true,
      data: {
        products: flashSaleProducts,
        count: flashSaleProducts.length
      }
    });

  } catch (error) {
    console.error('Flash sale products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching flash sale products'
    });
  }
};

// ✅ NEW: Get random/suggested products
// @desc    Get suggested products (random selection)
// @route   GET /api/products/suggested
// @access  Public
const getSuggestedProducts = async (req, res) => {
  try {
    console.log('Fetching suggested products...');
    
    const limit = parseInt(req.query.limit) || 8;
    
    // Use MongoDB aggregation to get random products
    const suggestedProducts = await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit * 2 } }, // Get more than needed for better randomization
      { $limit: limit }
    ]);

    console.log(`Found ${suggestedProducts.length} suggested products`);

    res.json({
      success: true,
      data: {
        products: suggestedProducts,
        count: suggestedProducts.length
      }
    });

  } catch (error) {
    console.error('Suggested products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching suggested products'
    });
  }
};

// ✅ NEW: Get featured products
// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    console.log('Fetching featured products...');
    
    const limit = parseInt(req.query.limit) || 8;
    
    const featuredProducts = await Product.find({
      isFeatured: true,
      isActive: true
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);

    console.log(`Found ${featuredProducts.length} featured products`);

    res.json({
      success: true,
      data: {
        products: featuredProducts,
        count: featuredProducts.length
      }
    });

  } catch (error) {
    console.error('Featured products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products'
    });
  }
};

// ✅ NEW: Get products by category with subcategory support
// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    console.log('Fetching products by category:', req.params.category);
    
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let filter = {
      isActive: true,
      $or: [
        { category: { $regex: req.params.category, $options: 'i' } },
        { tags: { $in: [new RegExp(req.params.category, 'i')] } }
      ]
    };

    // Add subcategory filter if provided
    if (req.query.subcategory) {
      filter.$or.push({ 
        category: { $regex: req.query.subcategory, $options: 'i' } 
      });
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    console.log(`Found ${products.length} products in category: ${req.params.category}`);

    res.json({
      success: true,
      data: {
        products: products,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total
        },
        category: req.params.category,
        subcategory: req.query.subcategory
      }
    });

  } catch (error) {
    console.error('Category products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      const serializedProduct = {
        _id: product._id.toString(),
        id: product._id.toString(),
        name: product.name,
        description: product.description,
        brand: product.brand,
        category: product.category,
        price: product.price,
        originalPrice: product.originalPrice,
        stock: product.stock,
        images: product.images,
        specifications: product.specifications,
        features: product.features,
        tags: product.tags,
        rating: product.rating,
        numReviews: product.numReviews,
        reviews: product.reviews,
        isFeatured: product.isFeatured,
        isActive: product.isActive,
        venteFlash: product.venteFlash, // ✅ Added venteFlash field
        warranty: product.warranty,
        dimensions: product.dimensions,
        weight: product.weight,
        badge: product.badge,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      };

      res.json({
        success: true,
        data: serializedProduct
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      images: req.files ? req.files.map(file => ({
        url: file.path,
        alt: req.body.name
      })) : []
    });

    const createdProduct = await product.save();

    const serializedProduct = {
      _id: createdProduct._id.toString(),
      id: createdProduct._id.toString(),
      name: createdProduct.name,
      description: createdProduct.description,
      brand: createdProduct.brand,
      category: createdProduct.category,
      price: createdProduct.price,
      originalPrice: createdProduct.originalPrice,
      stock: createdProduct.stock,
      images: createdProduct.images,
      specifications: createdProduct.specifications,
      features: createdProduct.features,
      tags: createdProduct.tags,
      rating: createdProduct.rating,
      numReviews: createdProduct.numReviews,
      reviews: createdProduct.reviews,
      isFeatured: createdProduct.isFeatured,
      isActive: createdProduct.isActive,
      venteFlash: createdProduct.venteFlash, // ✅ Added venteFlash field
      warranty: createdProduct.warranty,
      createdAt: createdProduct.createdAt,
      updatedAt: createdProduct.updatedAt
    };

    res.status(201).json({
      success: true,
      data: serializedProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      Object.assign(product, req.body);

      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => ({
          url: file.path,
          alt: req.body.name || product.name
        }));
        product.images = [...product.images, ...newImages];
      }

      const updatedProduct = await product.save();

      const serializedProduct = {
        _id: updatedProduct._id.toString(),
        id: updatedProduct._id.toString(),
        name: updatedProduct.name,
        description: updatedProduct.description,
        brand: updatedProduct.brand,
        category: updatedProduct.category,
        price: updatedProduct.price,
        originalPrice: updatedProduct.originalPrice,
        stock: updatedProduct.stock,
        images: updatedProduct.images,
        specifications: updatedProduct.specifications,
        features: updatedProduct.features,
        tags: updatedProduct.tags,
        rating: updatedProduct.rating,
        numReviews: updatedProduct.numReviews,
        reviews: updatedProduct.reviews,
        isFeatured: updatedProduct.isFeatured,
        isActive: updatedProduct.isActive,
        venteFlash: updatedProduct.venteFlash, // ✅ Added venteFlash field
        warranty: updatedProduct.warranty,
        createdAt: updatedProduct.createdAt,
        updatedAt: updatedProduct.updatedAt
      };

      res.json({
        success: true,
        data: serializedProduct
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const review = {
        name: name || 'Anonymous',
        rating: Number(rating),
        comment,
        createdAt: new Date()
      };

      product.reviews.push(review);
      
      // Calculate new average rating
      const totalRating = product.reviews.reduce((acc, review) => acc + review.rating, 0);
      product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;
      product.numReviews = product.reviews.length;

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Review added successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  createProductReview,
  // ✅ NEW: Export new functions
  getFlashSaleProducts,
  getSuggestedProducts,
  getFeaturedProducts,
  getProductsByCategory
};
