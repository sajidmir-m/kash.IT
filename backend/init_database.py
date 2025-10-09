#!/usr/bin/env python3
"""
Database Initialization Script for Kash.it E-commerce Platform
This script helps you set up the database and create initial data.
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from main import create_app
from models import db, User, Category, Product, Vendor, VendorCategory
from werkzeug.security import generate_password_hash

def create_sample_categories():
    """Create sample product categories - All hero-section categories"""
    categories = [
        {
            'name': 'Fruits & Vegetables',
            'description': 'Fresh fruits and vegetables',
            'image_url': '/images/categories/fruits-vegetables.jpg'
        },
        {
            'name': 'Chips',
            'description': 'Chips, crisps and crunchy snacks',
            'image_url': '/images/categories/chips.jpg'
        },
        {
            'name': 'Dairy, Bread & Eggs',
            'description': 'Milk, cheese, eggs, bread and dairy products',
            'image_url': '/images/categories/dairy-bread-eggs.jpg'
        },
        {
            'name': 'Atta, Rice, Sugar, Oil & Dals',
            'description': 'Flour, rice, sugar, cooking oils and lentils',
            'image_url': '/images/categories/atta-rice-oil-dals.jpg'
        },
        {
            'name': 'Masala & Dry Fruits',
            'description': 'Spices, masalas and dried fruits',
            'image_url': '/images/categories/masala-dry-fruits.jpg'
        },
        {
            'name': 'Juice & Cold Drink',
            'description': 'Fresh juices and cold beverages',
            'image_url': '/images/categories/juice-cold-drink.jpg'
        },
        {
            'name': 'Biscuits',
            'description': 'Cookies, biscuits and sweet snacks',
            'image_url': '/images/categories/biscuits.jpg'
        },
        {
            'name': 'Stationery',
            'description': 'Office supplies, books and stationery items',
            'image_url': '/images/categories/stationery.jpg'
        },
        {
            'name': 'Soap, Detergents & Shampoo',
            'description': 'Personal care and cleaning products',
            'image_url': '/images/categories/soap-detergent-shampoo.jpg'
        },
        {
            'name': 'Home Essentials',
            'description': 'Home improvement and household essentials',
            'image_url': '/images/categories/home-essentials.jpg'
        },
        {
            'name': 'Tea, Coffee & More',
            'description': 'Tea, coffee and hot beverages',
            'image_url': '/images/categories/tea-coffee.jpg'
        },
        {
            'name': 'Ice Creams & More',
            'description': 'Ice creams, frozen desserts and treats',
            'image_url': '/images/categories/ice-cream.jpg'
        },
        {
            'name': 'Smart Home',
            'description': 'Smart home devices and automation products',
            'image_url': '/images/categories/smart-home.jpg'
        },
        {
            'name': 'Tools',
            'description': 'Hand tools, power tools and equipment',
            'image_url': '/images/categories/tools.jpg'
        },
        {
            'name': 'Chocolates, Chew Gums & Candy',
            'description': 'Chocolates, gums, candies and sweets',
            'image_url': '/images/categories/chocolate-candy.jpg'
        },
        {
            'name': 'Kids Care',
            'description': 'Baby care and children products',
            'image_url': '/images/categories/kids-care.jpg'
        },
        {
            'name': 'Feminine Hygiene',
            'description': 'Women hygiene and personal care products',
            'image_url': '/images/categories/feminine-hygiene.jpg'
        },
        {
            'name': 'IoT Tools',
            'description': 'Internet of Things devices and smart tools',
            'image_url': '/images/categories/iot-tools.jpg'
        }
    ]
    
    created_categories = []
    for cat_data in categories:
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            category = Category(**cat_data)
            db.session.add(category)
            created_categories.append(category)
            print(f"Created category: {cat_data['name']}")
        else:
            created_categories.append(existing)
            print(f"Category already exists: {cat_data['name']}")
    
    return created_categories

def create_sample_products(categories):
    """Create sample products"""
    products = [
        # Fruits & Vegetables
        {
            'name': 'Fresh Apples (1kg)',
            'description': 'Crisp and sweet red apples',
            'price': 120.00,
            'stock': 50,
            'unit': '1kg',
            'image_url': '/images/products/apples.jpg',
            'category_name': 'Fruits & Vegetables'
        },
        {
            'name': 'Bananas (1 dozen)',
            'description': 'Fresh yellow bananas',
            'price': 60.00,
            'stock': 30,
            'unit': '1 dozen',
            'image_url': '/images/products/bananas.jpg',
            'category_name': 'Fruits & Vegetables'
        },
        {
            'name': 'Fresh Tomatoes (1kg)',
            'description': 'Ripe red tomatoes',
            'price': 40.00,
            'stock': 25,
            'unit': '1kg',
            'image_url': '/images/products/tomatoes.jpg',
            'category_name': 'Fruits & Vegetables'
        },
        
        # Dairy, Bread & Eggs
        {
            'name': 'Fresh Milk (1L)',
            'description': 'Pure cow milk',
            'price': 60.00,
            'stock': 40,
            'unit': '1L',
            'image_url': '/images/products/milk.jpg',
            'category_name': 'Dairy, Bread & Eggs'
        },
        {
            'name': 'Free Range Eggs (12 pieces)',
            'description': 'Fresh free range eggs',
            'price': 80.00,
            'stock': 20,
            'unit': '12 pieces',
            'image_url': '/images/products/eggs.jpg',
            'category_name': 'Dairy, Bread & Eggs'
        },
        
        # Pantry Staples
        {
            'name': 'Basmati Rice (1kg)',
            'description': 'Premium basmati rice',
            'price': 150.00,
            'stock': 35,
            'unit': '1kg',
            'image_url': '/images/products/rice.jpg',
            'category_name': 'Atta, Rice, Sugar, Oil & Dals'
        },
        {
            'name': 'Sunflower Oil (1L)',
            'description': 'Pure sunflower cooking oil',
            'price': 120.00,
            'stock': 30,
            'unit': '1L',
            'image_url': '/images/products/oil.jpg',
            'category_name': 'Atta, Rice, Sugar, Oil & Dals'
        }
    ]
    
    created_products = []
    for prod_data in products:
        # Find the category
        category = next((cat for cat in categories if cat.name == prod_data['category_name']), None)
        if not category:
            print(f"Category not found: {prod_data['category_name']}")
            continue
            
        # Check if product already exists
        existing = Product.query.filter_by(name=prod_data['name']).first()
        if not existing:
            product = Product(
                category_id=category.id,
                name=prod_data['name'],
                description=prod_data['description'],
                price=prod_data['price'],
                stock=prod_data['stock'],
                unit=prod_data['unit'],
                image_url=prod_data['image_url']
            )
            db.session.add(product)
            created_products.append(product)
            print(f"Created product: {prod_data['name']}")
        else:
            created_products.append(existing)
            print(f"Product already exists: {prod_data['name']}")
    
    return created_products

def create_sample_vendors():
    """Create sample vendors"""
    vendors_data = [
        {
            'email': 'vendor1@kashit.com',
            'password': 'Vendor@123',
            'full_name': 'Rajesh Kumar',
            'phone': '+91-9876543210',
            'business_name': 'Fresh Farm Products',
            'business_type': 'Individual',
            'gst_number': '29ABCDE1234F1Z5',
            'pan_number': 'ABCDE1234F',
            'business_address': '123 Market Street, Srinagar',
            'city': 'Srinagar',
            'state': 'Jammu & Kashmir',
            'pincode': '190001',
            'description': 'Fresh fruits and vegetables from local farms',
            'is_approved': True
        },
        {
            'email': 'vendor2@kashit.com',
            'password': 'Vendor@123',
            'full_name': 'Priya Sharma',
            'phone': '+91-9876543211',
            'business_name': 'ElectroTech Solutions',
            'business_type': 'Company',
            'gst_number': '29FGHIJ5678K2L6',
            'pan_number': 'FGHIJ5678K',
            'business_address': '456 Tech Park, Jammu',
            'city': 'Jammu',
            'state': 'Jammu & Kashmir',
            'pincode': '180001',
            'description': 'Electronics and IoT devices for smart homes',
            'is_approved': True
        }
    ]
    
    created_vendors = []
    for vendor_data in vendors_data:
        # Check if user already exists
        existing_user = User.query.filter_by(email=vendor_data['email']).first()
        if existing_user:
            print(f"User already exists: {vendor_data['email']}")
            continue
        
        # Create user account
        user = User(
            email=vendor_data['email'],
            full_name=vendor_data['full_name'],
            phone=vendor_data['phone'],
            is_vendor=True,
            is_verified=True
        )
        user.set_password(vendor_data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get user ID
        
        # Create vendor profile
        vendor = Vendor(
            user_id=user.id,
            business_name=vendor_data['business_name'],
            business_type=vendor_data['business_type'],
            gst_number=vendor_data['gst_number'],
            pan_number=vendor_data['pan_number'],
            business_address=vendor_data['business_address'],
            city=vendor_data['city'],
            state=vendor_data['state'],
            pincode=vendor_data['pincode'],
            description=vendor_data['description'],
            is_approved=vendor_data['is_approved']
        )
        
        db.session.add(vendor)
        db.session.flush()  # Get vendor ID
        created_vendors.append(vendor)
        print(f"Created vendor: {vendor_data['business_name']}")
    
    return created_vendors

def assign_categories_to_vendors(vendors, categories):
    """Assign categories to vendors"""
    # Assign Fruits & Vegetables to vendor 1
    if len(vendors) > 0 and len(categories) > 0:
        vendor_category1 = VendorCategory(
            vendor_id=vendors[0].id,
            category_id=categories[0].id,  # Fruits & Vegetables
            is_active=True
        )
        db.session.add(vendor_category1)
        print(f"Assigned {categories[0].name} to {vendors[0].business_name}")
    
    # Assign Electronics/IoT to vendor 2 (if we have more categories)
    if len(vendors) > 1 and len(categories) > 4:
        # Assuming we have an Electronics category
        electronics_category = next((cat for cat in categories if 'Electronics' in cat.name or 'IoT' in cat.name), None)
        if electronics_category:
            vendor_category2 = VendorCategory(
                vendor_id=vendors[1].id,
                category_id=electronics_category.id,
                is_active=True
            )
            db.session.add(vendor_category2)
            print(f"Assigned {electronics_category.name} to {vendors[1].business_name}")

def create_admin_user():
    """Create admin user if it doesn't exist"""
    admin_email = "admin@kashit.com"
    admin_password = "Admin@123"
    
    existing_admin = User.query.filter_by(email=admin_email).first()
    if not existing_admin:
        admin_user = User(
            email=admin_email,
            full_name="Admin User",
            phone="+91-9876543210"
        )
        admin_user.set_password(admin_password)
        admin_user.is_verified = True
        admin_user.is_admin = True
        
        db.session.add(admin_user)
        print(f"Created admin user: {admin_email}")
        print(f"   Password: {admin_password}")
        return admin_user
    else:
        print(f"Admin user already exists: {admin_email}")
        return existing_admin

def main():
    """Main initialization function"""
    print("Initializing Kash.it Database...")
    print("=" * 50)
    
    # Create Flask app
    app = create_app()
    
    with app.app_context():
        try:
            # Create all tables
            print("Creating database tables...")
            db.create_all()
            print("Database tables created successfully!")
            
            # Create admin user
            print("\nCreating admin user...")
            admin_user = create_admin_user()
            
            # Create sample categories
            print("\nCreating sample categories...")
            categories = create_sample_categories()
            
            # Create sample products
            print("\nCreating sample products...")
            products = create_sample_products(categories)
            
            # Create sample vendors
            print("\nCreating sample vendors...")
            vendors = create_sample_vendors()
            
            # Assign categories to vendors
            print("\nAssigning categories to vendors...")
            assign_categories_to_vendors(vendors, categories)
            
            # Commit all changes
            db.session.commit()
            
            print("\n" + "=" * 50)
            print("Database initialization completed successfully!")
            print("\nSummary:")
            print(f"   - Admin user created: {admin_user.email}")
            print(f"   - Categories created: {len(categories)}")
            print(f"   - Products created: {len(products)}")
            print(f"   - Vendors created: {len(vendors)}")
            print("\nAccess URLs:")
            print("   - Main site: http://localhost:5173")
            print("   - Admin panel: http://localhost:5173/admin-login")
            print("   - Vendor portal: http://localhost:5173/vendor-login")
            print("   - API health: http://localhost:8000/health")
            print("\nAdmin Credentials:")
            print(f"   - Email: {admin_user.email}")
            print("   - Password: Admin@123")
            print("\nVendor Credentials:")
            for i, vendor in enumerate(vendors, 1):
                print(f"   - Vendor {i}: {vendor.user.email} / Vendor@123")
            print("\nRemember to change passwords after first login!")
            
        except Exception as e:
            print(f"Error during database initialization: {e}")
            db.session.rollback()
            return False
    
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print("\nDatabase setup completed! You can now start the application.")
    else:
        print("\nDatabase setup failed. Please check the error messages above.")
        sys.exit(1)
