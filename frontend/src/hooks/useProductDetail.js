import { useState, useEffect } from 'react';

const useProductDetail = (productId) => {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        console.log('Fetching product with ID:', productId); // Debug log
        
        const response = await fetch(`http://localhost:5000/api/products/${productId}`);
        const data = await response.json();
        
        console.log('Product fetch response:', data); // Debug log
        
        if (data.success) {
          setProduct(data.data);
          
          // Fetch related products
          if (data.data.category) {
            const relatedResponse = await fetch(`http://localhost:5000/api/products?category=${data.data.category}&limit=6`);
            const relatedData = await relatedResponse.json();
            if (relatedData.success) {
              setRelatedProducts(relatedData.data.products.filter(p => p._id !== productId));
            }
          }
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error('Error in useProductDetail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return {
    product,
    relatedProducts,
    loading,
    error,
    reviews: product?.reviews || [], // ✅ Add this
    refetch: () => fetchProduct(),   // ✅ Add this
    addReview: async () => {},       // ✅ Add this placeholder
    reviewsLoading: false            // ✅ Add this
  };
};

export default useProductDetail;
