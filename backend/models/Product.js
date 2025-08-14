const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  specifications: {
    type: Map,
    of: String
  },
  features: [String],
  tags: [String],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  reviews: [{
    name: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },

venteFlash: {
  active: { 
    type: Boolean, 
    default: true
  }, 
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true // Optional: but usually makes sense for flash sales
  },
  discount: {
    type: Number,
    required: true,
    min: 0
  }
}

}, {
  timestamps: true
},

);

// Create text index for search
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  category: 'text'
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
