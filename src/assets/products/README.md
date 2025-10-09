# Product Images Structure

This folder contains product images organized by category.

## Folder Structure:
```
products/
├── fruits/              # Fresh fruits
├── vegetables/          # Fresh vegetables  
├── chips/              # Chips and snacks
├── dairy/              # Dairy products
├── bread-eggs/         # Bread and eggs
├── atta/               # Wheat flour
├── rice/               # Rice varieties
├── oil/                # Cooking oils
├── dals/               # Lentils and pulses
├── juice/              # Fresh juices
├── cold-drink/         # Soft drinks
├── biscuits/           # Biscuits and cookies
├── tea-coffee/         # Tea and coffee
├── ice-cream/          # Ice cream and frozen treats
├── smart-home/         # Smart home products
├── tools/              # Kitchen tools
├── masala/             # Spices and masalas
└── dry-fruits/         # Dry fruits and nuts
```

## Image Guidelines:
- Use high-quality images (minimum 400x400px)
- Use consistent aspect ratios (1:1 recommended)
- Optimize images for web (JPEG/PNG)
- Use descriptive filenames (e.g., `fresh-apples.jpg`)
- Keep file sizes under 500KB for better performance

## Usage in Components:
```javascript
import productImage from "../assets/products/fruits/apple.jpg";

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    image: productImage,
    // ... other properties
  }
];
```











