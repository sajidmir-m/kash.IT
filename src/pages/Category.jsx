import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../hooks/useCart";
import { api, apiBaseUrl } from "../api/client";

// Import all category images
import fruitsVeg from "../assets/fruits-and-veg.jpeg";
import dairy from "../assets/dairy.jpeg";
import dalAata from "../assets/dal-aata.jpeg";
import tools from "../assets/smalltools.jpeg";
import masala from "../assets/masala.jpeg";
import teaCoffee from "../assets/tea-coffee.jpeg";
import biscuits from "../assets/buscuits.jpeg";
import chips from "../assets/chips.jpeg";
import juiceColdDrink from "../assets/juicesandcolddrins.jpeg";
import iceCream from "../assets/ice-cream.jpeg";
import smartHomeImg from "../assets/smart-home.jpeg";

export default function Category() {
  const { categoryName } = useParams();
  const [wishlist, setWishlist] = useState(new Set());
  const { addToCart, getCartCount, cartItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const getQty = (productId) => {
    const item = cartItems?.find(i => i.id === productId);
    return item ? item.quantity : 0;
  };


  // Convert URL parameter back to readable format
  const displayName = useMemo(() => (
    categoryName?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
  ), [categoryName]);

  // All categories with their images
  const allCategories = [
    { name: "Fruits & Vegetables", image: fruitsVeg, slug: "fruits-vegetables" },
    { name: "Chips", image: chips, slug: "chips" },
    { name: "Dairy, Bread & Eggs", image: dairy, slug: "dairy-bread-eggs" },
    { name: "Atta, Rice, Oil & Dals", image: dalAata, slug: "atta-rice-oil-dals" },
    { name: "Masala & Dry Fruits", image: masala, slug: "masala-dry-fruits" },
    { name: "Juice & Cold Drink", image: juiceColdDrink, slug: "juice-cold-drink" },
    { name: "Biscuits", image: biscuits, slug: "biscuits" },
    { name: "Tea, Coffee & More", image: teaCoffee, slug: "tea-coffee-more" },
    { name: "Ice Creams & More", image: iceCream, slug: "ice-creams-more" },
    { name: "Smart Home", image: smartHomeImg, slug: "smart-home" },
    { name: "Tools", image: tools, slug: "tools" },
  ];

  // Filter out current category for the sidebar
  const otherCategories = allCategories.filter(cat => cat.slug !== categoryName);

  // Fetch real products for this category from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // 1) fetch categories to resolve ID by name
        const cats = await api.get('/api/categories');
        const list = cats?.data?.categories || [];
        // Handle special cases for category name matching
        const normalizeCategoryName = (name) => {
          return name.toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^\w\s]/g, '')
            .trim();
        };
        
        const match = list.find(c => {
          const apiName = normalizeCategoryName(c.name || '');
          const displayNameNormalized = normalizeCategoryName(displayName || '');
          return apiName === displayNameNormalized;
        });
        
        if (!match) { 
          setProducts([]); 
          setLoading(false); 
          return; 
        }
        // 2) fetch products by category_id
        const res = await api.get('/api/products', { 
          params: { 
            category_id: match.id, 
            per_page: 100,
            _t: Date.now() // Cache busting
          } 
        });
        const items = (res?.data?.products || []).map(p => {
          const rawImage = p.image_url;
          const normalizedImage = rawImage
            ? (rawImage.startsWith('http') ? rawImage : `${apiBaseUrl}${rawImage}`)
            : "https://via.placeholder.com/400";
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: normalizedImage,
            rating: 4.5,
            reviews: 0,
            inStock: (p.stock ?? 0) > 0,
            stock: p.stock ?? 0
          };
        });
        if (isMounted) setProducts(items);
      } catch (e) {
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, [displayName]);

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
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Category Description */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
                Discover the finest selection of {displayName?.toLowerCase()} products. 
                Fresh, high-quality items delivered right to your doorstep in Srinagar.
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
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">No Products Available</h3>
                  <p className="text-gray-600 mb-6">
                    No products found for {displayName}. 
                    Please check back later or contact us for more information.
                  </p>
                  <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Categories
                  </Link>
                </div>
              </div>
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
                    <p className="text-xs text-gray-500 mb-2">{displayName}</p>

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

            {/* Load More Button */}
            {products.length > 0 && (
              <div className="text-center mt-12">
                <button className="px-8 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors duration-300">
                  Load More Products
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar - Other Categories */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Other Categories</h3>
              <div className="space-y-4">
                {otherCategories.map((category, idx) => (
                  <Link
                    key={idx}
                    to={`/category/${category.slug}`}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-gray-200 bg-white flex-shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors duration-200">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

