import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  MapPin,
  User,
  Apple,
  Cookie,
  Milk,
  Box,
  Coffee,
  IceCream,
  Home,
  CupSoda,
  Grid2x2,
  Wrench,
  Candy,
  UserRound,
  Droplet,
  Cpu
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";

export default function Header() {
  const { getCartCount } = useCart();
  const [userAddress, setUserAddress] = useState(null);
  const [userName, setUserName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load user address from localStorage
    const savedAddress = localStorage.getItem('userAddress');
    if (savedAddress) {
      try {
        setUserAddress(JSON.parse(savedAddress));
      } catch (error) {
        console.error('Error parsing saved address:', error);
      }
    }
    // Load user profile from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserName(parsed?.full_name || parsed?.email || "");
      } catch {}
    }
    
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Sample products for local search
  const sampleProducts = [
    { id: 1, name: "Lays Classic", price: 20, image: "/public/images/lays.jpg" },
    { id: 2, name: "Lays Magic Masala", price: 20, image: "/public/images/lays-magic.jpg" },
    { id: 3, name: "Lentils", price: 90, image: "https://via.placeholder.com/40" },
    { id: 4, name: "Apples", price: 150, image: "https://via.placeholder.com/40" },
    { id: 5, name: "Bananas", price: 60, image: "https://via.placeholder.com/40" },
    { id: 6, name: "Carrots", price: 40, image: "https://via.placeholder.com/40" },
    { id: 7, name: "Milk", price: 55, image: "https://via.placeholder.com/40" },
    { id: 8, name: "Bread", price: 30, image: "https://via.placeholder.com/40" },
    { id: 9, name: "Rice", price: 70, image: "https://via.placeholder.com/40" },
    { id: 10, name: "Tomatoes", price: 35, image: "https://via.placeholder.com/40" },
  ];

  // Search products as user types
  useEffect(() => {
    if (searchText.length >= 1) {
      // Filter products that START with the typed letter(s)
      const filteredProducts = sampleProducts
        .filter(p => p.name.toLowerCase().startsWith(searchText.toLowerCase()))
        .slice(0, 5); // Limit to 5 results for better UX
        
      setSearchResults(filteredProducts);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchText]);

  // Listen for address updates
  useEffect(() => {
    const handleStorageChange = () => {
      const savedAddress = localStorage.getItem('userAddress');
      if (savedAddress) {
        try {
          setUserAddress(JSON.parse(savedAddress));
        } catch (error) {
          console.error('Error parsing saved address:', error);
        }
      } else {
        setUserAddress(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const categories = [
    { name: "All Categories", icon: Grid2x2, slug: "all-categories" }, // Added "All Categories"
    { name: "Fruits & Vegetables", icon: Apple, slug: "fruits-vegetables" },
    { name: "Chips", icon: Cookie, slug: "chips" },
    { name: "Dairy, Bread & Eggs", icon: Milk, slug: "dairy-bread-eggs" },
    { name: "Atta, Rice, Oil & Dals", icon: Box, slug: "atta-rice-oil-dals" },
    { name: "Masala & Dry Fruits", icon: Box, slug: "masala-dry-fruits" },
    { name: "Juice & Cold Drink", icon: CupSoda, slug: "juice-cold-drink" },
    { name: "Biscuits", icon: Cookie, slug: "biscuits" },
    { name: "Tea, Coffee & More", icon: Coffee, slug: "tea-coffee-more" },
    { name: "Ice Creams & More", icon: IceCream, slug: "ice-creams-more" },
    { name: "Smart Home", icon: Home, slug: "smart-home" },
    // Newly added categories
    { name: "Stationery", icon: Box, slug: "stationery" },
    { name: "Soap, Detergents & Shampoo", icon: Droplet, slug: "soap-detergents-shampoo" },
    { name: "Home Essentials", icon: Home, slug: "home-essentials" },
    { name: "Tools", icon: Wrench, slug: "tools" },
    { name: "Chocolates", icon: Candy, slug: "chocolates-chew-gums-candy" },
    { name: "Chew Gums & Candy", icon: Candy, slug: "chocolates-chew-gums-candy" },
    { name: "Kids Care", icon: UserRound, slug: "kids-care" },
    { name: "Feminine Hygiene", icon: Droplet, slug: "feminine-hygiene" },
    { name: "IoT Tools", icon: Cpu, slug: "iot-tools" },
  ];

  return (
    <header className="shadow-md sticky top-0 z-50 backdrop-blur-md bg-white">
      {/* Top Bar (KASHIT at top) */}
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{
          background:
            "linear-gradient(90deg, rgba(209,250,229,0.95) 0%, rgba(252,231,243,0.95) 100%)",
        }}
      >
        {/* Left: Logo + Delivery Info */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-green-700 tracking-wide">Kashit</h1>
          <p className="text-sm text-gray-600 -mt-1 opacity-80">10 Minutes Delivery</p>
          <div className="flex items-center gap-1 text-gray-700 text-sm">
            <MapPin size={16} />
            <span>
              {userAddress 
                ? `${userAddress.street}, ${userAddress.city}` 
                : 'Bangalore, Whitefield'
              }
            </span>
          </div>
          {userName && (
            <span className="text-sm text-gray-700 mt-1">Hello, <span className="font-medium">{userName}</span></span>
          )}
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center px-8">
          <div
            ref={searchRef}
            className="relative w-full max-w-md"
          >
            <form
              className="flex items-center w-full bg-white rounded-full shadow-md px-3 py-2"
              onSubmit={(e)=>{
                e.preventDefault();
                const q = searchText.trim().toLowerCase();
                if (!q) { navigate('/products'); return; }
                // Try to match a category first
                const match = categories.find(c => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q));
                if (match) {
                  navigate(`/category/${match.slug}`);
                } else {
                  navigate(`/products?search=${encodeURIComponent(q)}`);
                }
                setShowResults(false);
              }}
            >
              <Search size={18} className="text-gray-500" />
              <input
                type="text"
                value={searchText}
                onChange={(e)=> setSearchText(e.target.value)}
                placeholder="Search for fruits, snacks and more..."
                className="flex-1 px-2 outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                className="ml-2 px-3 py-1.5 text-sm rounded-full bg-green-600 text-white hover:bg-green-700"
              >
                Search
              </button>
            </form>
            
            {/* Autocomplete Results */}
            {searchText.length >= 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                <ul className="py-2">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <li key={product.id} className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                        <div 
                          className="flex items-center gap-3"
                          onClick={() => {
                            // Navigate directly to product page with product ID
                            navigate(`/products/${product.id}`);
                            setShowResults(false);
                            setSearchText(product.name);
                          }}
                        >
                          <img 
                            src={product.image || "https://via.placeholder.com/40"} 
                            alt={product.name} 
                            className="w-10 h-10 object-cover rounded"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500">₹{product.price}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-3 text-center text-gray-500">
                      No products found starting with "{searchText}"
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: Login + Cart */}
        <div className="flex items-center gap-4">
          {location.pathname !== '/' && (
            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-2 bg-white rounded-full shadow hover:bg-green-50 transition"
            >
              <Home size={20} className="text-green-700" />
              <span className="text-sm font-medium text-gray-700">Home</span>
            </Link>
          )}
          <Link
            to={localStorage.getItem('accessToken') ? "/user" : "/login"}
            className="flex items-center gap-1 px-3 py-2 bg-white rounded-full shadow hover:bg-green-50 transition"
          >
            <User size={20} className="text-green-700" />
            <span className="text-sm font-medium text-gray-700">{localStorage.getItem('accessToken') ? (userName || 'Account') : 'Login'}</span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center px-3 py-2 bg-white rounded-full shadow hover:bg-green-50 transition"
          >
            <ShoppingCart size={20} className="text-green-700" />
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full px-1.5">
              {getCartCount ? getCartCount() : 0}
            </span>
          </Link>
        </div>
      </div>

      {/* Categories Bar (Below KASHIT) */}
      <div className="flex overflow-x-auto gap-6 px-6 py-3 shadow-inner scrollbar-hide">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/category/${cat.slug}`}
            className="flex flex-col items-center min-w-[70px] cursor-pointer hover:scale-105 transition"
          >
            <div className="bg-green-50 p-3 rounded-full shadow-sm">
              <cat.icon size={24} className="text-green-700" />
            </div>
            <span className="text-xs font-medium mt-1 text-gray-700 text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </header>
  );
}
