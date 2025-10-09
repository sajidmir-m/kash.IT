import { useState } from 'react';
import { CartContext } from './CartContext';

// Cart provider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Add item to cart
  const addToCart = (product) => {
    setCartItems(prevItems => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1
        };
        return updatedItems;
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };
  
  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Get cart count
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    clearCart
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};





