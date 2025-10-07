import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../hooks/useCart";

// Import product images
import kidsCareImg from "../assets/kidscare.jpeg";

export default function KidsCare() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart, cartItems, getCartCount } = useCart();

  const getQty = (productId) => {
    const item = cartItems?.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const products = useMemo(() => [
    {
      id: 1,
      name: "Baby Diapers",
      price: 450,
      originalPrice: 500,
      image: kidsCareImg,
      rating: 4.6,
      reviews: 234,
      inStock: true
    },
    {
      id: 2,
      name: "Baby Wipes",
      price: 120,
      originalPrice: 150,
      image: kidsCareImg,
      rating: 4.5,
      reviews: 189,
      inStock: true
    },
    {
      id: 3,
      name: "Baby Powder",
      price: 80,
      originalPrice: 100,
      image: kidsCareImg,
      rating: 4.4,
      reviews: 156,
      inStock: true
    },
    {
      id: 4,
      name: "Baby Shampoo",
      price: 150,
      originalPrice: 180,
      image: kidsCareImg,
      rating: 4.7,
      reviews: 167,
      inStock: true
    },
    {
      id: 5,
      name: "Baby Lotion",
      price: 200,
      originalPrice: 250,
      image: kidsCareImg,
      rating: 4.5,
      reviews: 134,
      inStock: true
    },
    {
      id: 6,
      name: "Baby Oil",
      price: 100,
      originalPrice: 120,
      image: kidsCareImg,
      rating: 4.3,
      reviews: 98,
      inStock: true
    },
    {
      id: 7,
      name: "Baby Food",
      price: 180,
      originalPrice: 220,
      image: kidsCareImg,
      rating: 4.6,
      reviews: 145,
      inStock: true
    },
    {
      id: 8,
      name: "Baby Bottle",
      price: 250,
      originalPrice: 300,
      image: kidsCareImg,
      rating: 4.4,
      reviews: 112,
      inStock: true
    }
  ], []);

  // Initialize filtered products with all products
  useEffect(() => {
    setFilteredProducts([...products]);
  }, [products]);

  // Apply filters based on the active filter
  useEffect(() => {
    let result = [...products];
    
    switch(activeFilter) {
      case "low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "in-stock":
        result = result.filter(product => product.inStock);
        break;
      default:
        // "all" - no sorting needed
        break;
    }
    
    setFilteredProducts(result);
  }, [activeFilter, products]);

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
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    // Apply filter immediately
    let result = [...products];
    
    switch(filter) {
      case "low-to-high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "in-stock":
        result = result.filter(product => product.inStock);
        break;
      default:
        // "all" - no sorting needed
        break;
    }
    
    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 shadow-sm">
        <div className="w-full py-4">
          <div className="flex items-center justify-between px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-green-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-white">Kids Care</h1>
            <Link to="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-green-700 text-sm font-semibold hover:bg-green-50">
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full py-6 max-w-7xl mx-auto">
        {/* Category Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Gentle care products for your little ones. 
            Safe and trusted baby care items delivered to your doorstep in Srinagar.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3 justify-center px-4">
          <button 
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "all" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All Products
          </button>
          <button 
            onClick={() => handleFilterChange("low-to-high")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "low-to-high" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Price: Low to High
          </button>
          <button 
            onClick={() => handleFilterChange("high-to-low")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "high-to-low" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Price: High to Low
          </button>
          <button 
            onClick={() => handleFilterChange("rating")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "rating" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Rating
          </button>
          <button 
            onClick={() => handleFilterChange("in-stock")}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeFilter === "in-stock" 
                ? "bg-green-600 text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            In Stock
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 px-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group border border-gray-100">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Image";
                  }}
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">Out of Stock</span>
                  </div>
                )}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Heart 
                    className={`w-3.5 h-3.5 ${
                      wishlist.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`} 
                  />
                </button>
                {product.originalPrice > product.price && (
                  <div className="absolute top-2 left-2">
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-md font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 leading-tight">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <span className="text-base font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {getQty(product.id) > 0 && (
                  <div className="mb-2 text-xs text-green-700 font-medium">In cart: {getQty(product.id)}</div>
                )}

                {/* Add to Cart Button */}
                <button
                  disabled={!product.inStock}
                  onClick={() => {
                    if (product.inStock) {
                      addToCart(product);
                      alert("Added to cart");
                    }
                  }}
                  className={`w-full py-2 px-3 rounded-md font-medium transition-colors duration-300 flex items-center justify-center text-sm ${
                    product.inStock
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

