// Import all category products
import { chipsProducts } from './chips';
import { teaCoffeeMoreProducts } from './teaCoffeeMore';
import { fruitsVegetablesProducts } from './fruitsVegetables';
import { dairyBreadEggsProducts } from './dairyBreadEggs';

// Combine all products into one master array
export const allProducts = [
  ...chipsProducts.map(product => ({ ...product, category: 'chips' })),
  ...teaCoffeeMoreProducts.map(product => ({ ...product, category: 'teaCoffeeMore' })),
  ...fruitsVegetablesProducts,
  ...dairyBreadEggsProducts
];

// Function to search products by query
export const searchProducts = (query) => {
  if (!query || query.trim() === '') return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm)
  );
};

// Function to get products by category
export const getProductsByCategory = (category) => {
  if (!category) return allProducts;
  return allProducts.filter(product => product.category === category);
};

// Function to get product by ID
export const getProductById = (id) => {
  return allProducts.find(product => product.id === parseInt(id));
};