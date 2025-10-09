# Assets Structure - Kashit Grocery App

## 📁 Current File Structure:

```
src/assets/
├── products/                    # Product images by category
│   ├── fruits/                  # Fresh fruits
│   ├── vegetables/              # Fresh vegetables
│   ├── chips/                   # Chips and snacks
│   ├── dairy/                   # Dairy products
│   ├── bread-eggs/              # Bread and eggs
│   ├── atta/                    # Wheat flour
│   ├── rice/                    # Rice varieties
│   ├── oil/                     # Cooking oils
│   ├── dals/                    # Lentils and pulses
│   ├── juice/                   # Fresh juices
│   ├── cold-drink/              # Soft drinks
│   ├── biscuits/                # Biscuits and cookies
│   ├── tea-coffee/              # Tea and coffee
│   ├── ice-cream/               # Ice cream and frozen treats
│   ├── smart-home/              # Smart home products
│   ├── tools/                   # Kitchen tools
│   ├── masala/                  # Spices and masalas
│   ├── dry-fruits/              # Dry fruits and nuts
│   └── README.md                # Product images guidelines
│
├── Category Images (Used):      # Category display images
│   ├── fruits-and-veg.jpg       # ✅ Used in Hero & Category
│   ├── dairy.jpg                # ✅ Used in Hero & Category
│   ├── dal-aata.jpg             # ✅ Used in Hero & Category
│   ├── smalltools.jpg           # ✅ Used in Hero & Category
│   ├── masala.jpg               # ✅ Used in Hero & Category
│   ├── tea-coffee.jpg           # ✅ Used in Hero & Category
│   ├── buscuits.jpg             # ✅ Used in Hero & Category
│   ├── chips.jpg                # ✅ Used in Hero & Category
│   ├── juicesandcolddrins.jpg   # ✅ Used in Hero & Category
│   ├── ice-cream.jpg            # ✅ Used in Hero & Category
│   └── smart-home.jpg           # ✅ Used in Hero & Category
│
├── Background Images:           # Background images
│   └── background.jpg           # ✅ Used in Promise component
│
├── Kashmiri Specialties:        # Special products
│   ├── saffron.jpg              # ✅ Used in KashmiriSpecialties
│   ├── walnuts.jpg              # ✅ Used in KashmiriSpecialties
│   ├── almonds.jpg              # ✅ Used in KashmiriSpecialties
│   ├── khewa.jpg                # ✅ Used in KashmiriSpecialties
│   ├── noonchai.jpg             # ✅ Used in KashmiriSpecialties
│   └── honey.jpg                # ✅ Used in KashmiriSpecialties
│
├── Featured Products:           # Featured products showcase
│   ├── grocery.jpg              # ✅ Used in FeaturedProducts
│   ├── iot.jpg                  # ✅ Used in FeaturedProducts
│   └── webbg.jpg                # ✅ Used in FeaturedProducts
│
└── Brand Assets:
    └── logo.png                 # ✅ App logo
```

## 🗑️ Removed Files:
- `bgweb.jpg` - Unused background
- `breakfast.jpg` - Removed from categories
- `frozen-food.jpg` - Unused
- `meat.jpg` - Unused
- `noonchai.webp` - Duplicate
- `packaged-food.jpg` - Removed from categories
- `react.svg` - Default React logo
- `webbg.jpg` - Unused (kept webbg.jpg for FeaturedProducts)

## 📝 Usage Guidelines:

### For Category Images:
- Keep current category images in root assets folder
- These are used for the hero component category display
- Size: 200x200px recommended

### For Product Images:
- Add product images in the appropriate category folder under `products/`
- Use descriptive filenames
- Size: 400x400px minimum
- Format: JPEG/PNG optimized for web

### Example Product Image Usage:
```javascript
import appleImage from "../assets/products/fruits/apple.jpg";

const products = [
  {
    id: 1,
    name: "Fresh Apples",
    image: appleImage,
    price: 299,
    // ... other properties
  }
];
```











