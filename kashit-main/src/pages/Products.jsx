import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { allProducts as staticProducts, searchProducts } from "../data/allProducts";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart, getCartCount, cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Extract productId from URL if present
  const pathParts = location.pathname.split('/');
  const productId = pathParts.length > 2 && pathParts[1] === 'products' ? pathParts[2] : null;
  
  // Extract category from URL if present
  const category = pathParts.length > 2 && pathParts[1] === 'category' ? pathParts[2] : null;

  const getQty = (productId) => {
    const item = cartItems?.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    // If productId is present, find and set the selected product
    if (productId) {
      const product = staticProducts.find(p => p.id.toString() === productId);
      if (product) {
        setSelectedProduct(product);
      }
    } else {
      setSelectedProduct(null);
    }
  }, [productId]);

  // Get search query from URL or local state
  const searchQuery = new URLSearchParams(location.search).get('search')?.toLowerCase() || searchTerm;
  
  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    let products = staticProducts;
    
    // Filter by category if specified
    if (category) {
      products = products.filter(p => p.category === category);
    }
    
    // Filter by search query if specified
    if (searchQuery) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return products;
  }, [searchQuery, category]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchTerm}`);
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : "All Products"}
            </h1>
            <Link to="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProduct ? (
          /* Single Product Detail View */
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={selectedProduct.image || "https://via.placeholder.com/400"}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                />
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col">
                <div className="flex justify-between items-start">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h1>
                  <button
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        wishlist.has(selectedProduct.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mb-4">Category: {selectedProduct.category}</p>
                <div className="text-2xl font-bold text-green-600 mb-4">₹{selectedProduct.price}</div>
                
                <p className="text-gray-700 mb-6">{selectedProduct.description || "No description available for this product."}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="mt-auto">
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    disabled={!selectedProduct.inStock}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
                      selectedProduct.inStock ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {getQty(selectedProduct.id) > 0 ? `Add More (${getQty(selectedProduct.id)} in cart)` : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Description for All Products */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                Browse through our complete collection of fresh groceries and daily essentials. 
                Quality products delivered right to your doorstep in Srinagar.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-8 flex flex-wrap gap-4 justify-center">
              <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium">
                All Products
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
                Price: Low to High
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
                Price: High to Low
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
                Rating
              </button>
              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50">
                In Stock
              </button>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="text-center text-gray-600">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image || "https://via.placeholder.com/400"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400";
                    }}
                  />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
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
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
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

                {getQty(product.id) > 0 && (
                  <div className="mb-2 text-sm text-green-700">In cart: {getQty(product.id)}</div>
                )}

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center ${
                    product.inStock
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (product.inStock) {
                      addToCart(product);
                      // optional toast/feedback could be added here
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
            </>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors duration-300">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
}