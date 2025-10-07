import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "../hooks/useCart";

export default function HomeEssentials() {
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
    { id: 1, name: "Garbage Bags (10 pcs)", price: 79, originalPrice: 99, image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Garbage+Bags", rating: 4.1, reviews: 64, inStock: true },
    { id: 2, name: "Aluminum Foil (18 micron)", price: 129, originalPrice: 149, image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Foil", rating: 4.3, reviews: 71, inStock: true },
    { id: 3, name: "Dish Scrub (Pack of 3)", price: 59, originalPrice: 79, image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Scrub", rating: 4.2, reviews: 38, inStock: true },
    { id: 4, name: "Kitchen Towel Roll", price: 99, originalPrice: 119, image: "https://via.placeholder.com/200x200/f3f4f6/6b7280?text=Towel+Roll", rating: 4.0, reviews: 25, inStock: true },
  ], []);

  useEffect(() => { setFilteredProducts([...products]); }, [products]);

  useEffect(() => {
    let result = [...products];
    switch(activeFilter) {
      case "low-to-high": result.sort((a, b) => a.price - b.price); break;
      case "high-to-low": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "in-stock": result = result.filter(product => product.inStock); break;
      default: break;
    }
    setFilteredProducts(result);
  }, [activeFilter, products]);

  const toggleWishlist = (productId) => {
    setWishlist(prev => { const s = new Set(prev); s.has(productId) ? s.delete(productId) : s.add(productId); return s; });
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    let result = [...products];
    switch(filter) {
      case "low-to-high": result.sort((a, b) => a.price - b.price); break;
      case "high-to-low": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "in-stock": result = result.filter(product => product.inStock); break;
      default: break;
    }
    setFilteredProducts(result);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-600 shadow-sm">
        <div className="w-full py-4">
          <div className="flex items-center justify-between px-4">
            <button onClick={() => navigate(-1)} className="flex items-center text-white hover:text-green-100 transition-colors"><ArrowLeft className="w-5 h-5 mr-2" />Back</button>
            <h1 className="text-2xl font-bold text-white">Home Essentials</h1>
            <Link to="/cart" className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-green-700 text-sm font-semibold hover:bg-green-50"><ShoppingCart className="h-4 w-4" /><span>Cart</span>{getCartCount() > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{getCartCount()}</span>)}</Link>
          </div>
        </div>
      </div>
      <div className="w-full py-8">
        <div className="mb-8"><p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">Daily home-use essentials for kitchen and cleaning.</p></div>
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          {["all","low-to-high","high-to-low","rating","in-stock"].map(key => (
            <button key={key} onClick={() => handleFilterChange(key)} className={`px-4 py-2 rounded-full text-sm font-medium ${activeFilter === key ? "bg-green-600 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}>
              {key === "all" ? "All Products" : key === "low-to-high" ? "Price: Low to High" : key === "high-to-low" ? "Price: High to Low" : key === "rating" ? "Rating" : "In Stock"}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
              <div className="relative aspect-square overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover scale-[0.85] group-hover:scale-100 transition-transform duration-300" />
                {!product.inStock && (<div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span className="text-white font-semibold">Out of Stock</span></div>)}
                <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Heart className={`w-4 h-4 ${wishlist.has(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (<span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>)}
                  </div>
                  {product.originalPrice > product.price && (<span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF</span>)}
                </div>
                {getQty(product.id) > 0 && (<div className="mb-2 text-sm text-green-700">In cart: {getQty(product.id)}</div>)}
                <button disabled={!product.inStock} className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center ${product.inStock ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`} onClick={() => { if (product.inStock) { addToCart(product); alert("Added to cart"); } }}>
                  <ShoppingCart className="w-4 h-4 mr-2" />{product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


