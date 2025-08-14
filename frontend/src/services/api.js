const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // ✅ EXISTING: Products API methods (unchanged)
  static async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  static async addToCart(productId, quantity = 1) {
    return this.request('/users/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  static async createProductReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  // ✅ NEW: Additional methods for home page components
  static async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products${queryString ? '?' + queryString : ''}`);
  }

  static async getFlashSaleProducts(limit = 8) {
    return this.request(`/products?flashSale=true&limit=${limit}`);
  }

  static async getSuggestedProducts(limit = 8) {
    return this.request(`/products?limit=20`); // Get more to randomize client-side
  }

  static async getRandomProducts(limit = 8) {
    return this.request(`/products?limit=${limit * 3}&sort=newest`); // Get more for randomization
  }

  static async getFlashSaleProducts(limit = 8) {
    try {
      return this.request(`/products/flash-sale?limit=${limit}`);
    } catch (error) {
      // Fallback to regular products endpoint
      console.warn('Flash sale endpoint not available, using fallback');
      return this.request(`/products?limit=${limit}`);
    }
  }

}



// ✅ UNCHANGED: Default export
export default ApiService;
