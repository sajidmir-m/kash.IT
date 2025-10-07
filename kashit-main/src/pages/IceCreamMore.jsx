import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../hooks/useCart";

export default function IceCreamMore() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(new Set());
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { addToCart, getCartCount, cartItems } = useCart();

  const getQty = (productId) => {
    const item = cartItems?.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };

  const products = useMemo(() => [
    {
      id: 1,
      name: "Purity and Trust Soya Chunks",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Soya+Chunks",
      rating: 4.2,
      reviews: 45,
      inStock: true
    },
    {
      id: 2,
      name: "Polo Gold Insulation Tape Box (30 pieces)",
      price: 300,
      originalPrice: 350,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Insulation+Tape",
      rating: 4.0,
      reviews: 23,
      inStock: true
    },
    {
      id: 3,
      name: "Wafer Crunchy Vanilla",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Wafer+Vanilla",
      rating: 4.5,
      reviews: 67,
      inStock: true
    },
    {
      id: 4,
      name: "Wafer Crunchy Pista",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Wafer+Pista",
      rating: 4.4,
      reviews: 52,
      inStock: true
    },
    {
      id: 5,
      name: "Wafer Crunchy Orange",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Wafer+Orange",
      rating: 4.3,
      reviews: 41,
      inStock: true
    },
    {
      id: 6,
      name: "Wafer Crunchy Dark Chocolate",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Wafer+Chocolate",
      rating: 4.6,
      reviews: 78,
      inStock: true
    },
    {
      id: 7,
      name: "Wafer Rolls Chocolaty Fills",
      price: 30,
      originalPrice: 35,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Wafer+Rolls",
      rating: 4.1,
      reviews: 34,
      inStock: true
    },
    {
      id: 8,
      name: "Tiffany Crunch n Cream Orange",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Orange",
      rating: 4.4,
      reviews: 56,
      inStock: true
    },
    {
      id: 9,
      name: "Tiffany Crunch n Cream Hazelnut",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Hazelnut",
      rating: 4.5,
      reviews: 63,
      inStock: true
    },
    {
      id: 10,
      name: "Tiffany Crunch n Cream Chocolate",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Chocolate",
      rating: 4.6,
      reviews: 89,
      inStock: true
    },
    {
      id: 11,
      name: "Tiffany Crunch n Cream Strawberry",
      price: 100,
      originalPrice: 120,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Strawberry",
      rating: 4.3,
      reviews: 47,
      inStock: true
    },
    {
      id: 12,
      name: "Tiffany Crunch n Cream Orange (60rs)",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Orange+60",
      rating: 4.2,
      reviews: 38,
      inStock: true
    },
    {
      id: 13,
      name: "Tiffany Crunch n Cream Strawberry (60rs)",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Strawberry+60",
      rating: 4.1,
      reviews: 29,
      inStock: true
    },
    {
      id: 14,
      name: "Tiffany Crunch n Cream Chocolate (60rs)",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Chocolate+60",
      rating: 4.3,
      reviews: 42,
      inStock: true
    },
    {
      id: 15,
      name: "Tiffany Crunch n Cream Hazelnut (60rs)",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tiffany+Hazelnut+60",
      rating: 4.2,
      reviews: 35,
      inStock: true
    },
    {
      id: 16,
      name: "Givmor Orange Delight",
      price: 50,
      originalPrice: 60,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Givmor+Orange",
      rating: 4.0,
      reviews: 26,
      inStock: true
    },
    {
      id: 17,
      name: "Givmor Pineapple Delight",
      price: 50,
      originalPrice: 60,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Givmor+Pineapple",
      rating: 4.1,
      reviews: 31,
      inStock: true
    },
    {
      id: 18,
      name: "Americano Wafer Crunchy Orange",
      price: 50,
      originalPrice: 60,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Americano+Orange",
      rating: 4.2,
      reviews: 33,
      inStock: true
    },
    {
      id: 19,
      name: "Americano Wafer Crunchy Pista",
      price: 50,
      originalPrice: 60,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Americano+Pista",
      rating: 4.1,
      reviews: 28,
      inStock: true
    },
    {
      id: 20,
      name: "Britannia Treat Croissant Vanilla Cream",
      price: 20,
      originalPrice: 25,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Britannia+Croissant",
      rating: 4.3,
      reviews: 45,
      inStock: true
    },
    {
      id: 21,
      name: "Ziggy Choco Star",
      price: 20,
      originalPrice: 25,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Ziggy+Choco+Star",
      rating: 4.0,
      reviews: 22,
      inStock: true
    },
    {
      id: 22,
      name: "Orion Choco Pie Orange",
      price: 10,
      originalPrice: 12,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Orion+Orange",
      rating: 4.2,
      reviews: 67,
      inStock: true
    },
    {
      id: 23,
      name: "Orion Choco Pie Mango",
      price: 10,
      originalPrice: 12,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Orion+Mango",
      rating: 4.1,
      reviews: 54,
      inStock: true
    },
    {
      id: 24,
      name: "Doowee Donut Strawberry",
      price: 20,
      originalPrice: 25,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Doowee+Strawberry",
      rating: 4.0,
      reviews: 38,
      inStock: true
    },
    {
      id: 25,
      name: "Winkies Love Bite Choco Blast",
      price: 20,
      originalPrice: 25,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Winkies+Choco",
      rating: 4.1,
      reviews: 41,
      inStock: true
    },
    {
      id: 26,
      name: "Britannia Cake Roll Yo Choco Vanilla Flavoured Swiss Roll",
      price: 10,
      originalPrice: 12,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Britannia+Swiss+Roll",
      rating: 4.2,
      reviews: 49,
      inStock: true
    },
    {
      id: 27,
      name: "Matrix Malted Wafer Roll with Milk Cream",
      price: 30,
      originalPrice: 35,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Matrix+Wafer",
      rating: 4.3,
      reviews: 36,
      inStock: true
    },
    {
      id: 28,
      name: "Pringles Original",
      price: 60,
      originalPrice: 70,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Pringles+Original",
      rating: 4.7,
      reviews: 156,
      inStock: true
    },
    {
      id: 29,
      name: "Pringles Desi Masala Tadka",
      price: 125,
      originalPrice: 150,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Pringles+Masala",
      rating: 4.5,
      reviews: 89,
      inStock: true
    },
    {
      id: 30,
      name: "Pringles Tangy Tomato Twist",
      price: 125,
      originalPrice: 150,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Pringles+Tomato",
      rating: 4.4,
      reviews: 72,
      inStock: true
    },
    {
      id: 31,
      name: "Tang Lemon",
      price: 250,
      originalPrice: 300,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tang+Lemon",
      rating: 4.6,
      reviews: 134,
      inStock: true
    },
    {
      id: 32,
      name: "Tang Pineapple",
      price: 250,
      originalPrice: 300,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tang+Pineapple",
      rating: 4.5,
      reviews: 98,
      inStock: true
    },
    {
      id: 33,
      name: "Tang Mixed",
      price: 250,
      originalPrice: 300,
      image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Tang+Mixed",
      rating: 4.4,
      reviews: 87,
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
            <h1 className="text-2xl font-bold text-white">Ice Cream & More</h1>
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
      <div className="w-full py-8">
        {/* Category Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Discover the finest selection of ice creams, wafers, snacks, and beverages. 
            Delicious treats delivered right to your doorstep in Srinagar.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
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
                    <span className="text-white font-semibold">Out of Stock</span>
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
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
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
                  <span className="text-sm text-gray-500 ml-1">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  {product.originalPrice > product.price && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
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
                  onClick={() => {
                    if (product.inStock) {
                      addToCart(product);
                      alert("Added to cart");
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

      </div>
    </div>
  );
}





