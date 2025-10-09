import { ArrowRight, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { api, apiBaseUrl } from "../api/client";
import webbg from "../assets/webbg.jpg";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart, getCartCount } = useCart();

  // Fetch real products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/api/products', {
          params: { 
            per_page: 8, // Show 8 featured products
            _t: Date.now() // Cache busting
          }
        });
        
        const transformedProducts = response.data.products.map(product => {
          const rawImage = product.image_url;
          const normalizedImage = rawImage
            ? (rawImage.startsWith('http') ? rawImage : `${apiBaseUrl}${rawImage}`)
            : "https://via.placeholder.com/400";
          return {
          id: product.id,
          name: product.name,
          price: product.price,
          image: normalizedImage,
          category: product.category_name,
          category_id: product.category_id,
          stock: product.stock,
          inStock: product.stock > 0
        };});
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  return (
    <section
      className="py-12 px-6 lg:px-12 bg-cover bg-center"
      style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${webbg})` }}
    > {/* padding applied at section level */}
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <a
          href="/products"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          View All
          <ArrowRight className="ml-2 h-5 w-5" />
        </a>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center text-gray-600 py-8">Loading featured products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-600 py-8">No products available yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      wishlist.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{product.category}</p>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{product.inStock ? `${product.stock} in stock` : 'Out of stock'}</span>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center text-sm ${
                    product.inStock
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={() => {
                    if (product.inStock) {
                      addToCart(product);
                    }
                  }}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
