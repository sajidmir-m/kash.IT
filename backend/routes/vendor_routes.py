from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User, Vendor, Product, Category, VendorCategory
from services.auth_decorator import admin_required
from services.email_service import send_otp_email
from datetime import datetime, timedelta
import secrets
import os
from werkzeug.utils import secure_filename

vendor_bp = Blueprint('vendor', __name__, url_prefix='/api/vendor')

# ==================== VENDOR AUTHENTICATION ====================

@vendor_bp.route('/register', methods=['POST'])
def register_vendor():
    """Register a new vendor (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create user account
        user = User(
            email=data['email'],
            full_name=data.get('full_name', ''),
            phone=data.get('phone', ''),
            is_vendor=True,
            is_verified=True  # Admin creates vendor, so auto-verify
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.flush()  # Get user ID
        
        # Create vendor profile
        vendor = Vendor(
            user_id=user.id,
            business_name=data.get('business_name', ''),
            business_type=data.get('business_type', 'Individual'),
            gst_number=data.get('gst_number'),
            pan_number=data.get('pan_number'),
            business_address=data.get('business_address', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            pincode=data.get('pincode', ''),
            phone=data.get('phone', ''),
            website=data.get('website'),
            description=data.get('description', ''),
            is_approved=data.get('is_approved', False)
        )
        
        db.session.add(vendor)
        db.session.commit()
        
        return jsonify({
            'message': 'Vendor registered successfully',
            'vendor_id': vendor.id,
            'user_id': user.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500


@vendor_bp.route('/login', methods=['POST'])
def login_vendor():
    """Vendor login"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_vendor:
            return jsonify({'error': 'Access denied. Vendor account required.'}), 403
        
        if not user.is_verified:
            return jsonify({'error': 'Please verify your email first'}), 403
        
        # Check if vendor profile exists and is approved
        vendor = Vendor.query.filter_by(user_id=user.id).first()
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        if not vendor.is_approved:
            return jsonify({'error': 'Vendor account pending approval'}), 403
        
        if not vendor.is_active:
            return jsonify({'error': 'Vendor account is deactivated'}), 403
        
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'vendor': {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'user_id': user.id,
                'email': user.email,
                'full_name': user.full_name
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Login failed: {str(e)}'}), 500


@vendor_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_vendor_profile():
    """Get vendor profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_vendor:
            return jsonify({'error': 'Vendor account not found'}), 404
        
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        # Get all active categories (vendors can see all categories when adding products)
        all_categories = Category.query.filter_by(is_active=True).all()
        
        return jsonify({
            'vendor': {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'business_type': vendor.business_type,
                'gst_number': vendor.gst_number,
                'pan_number': vendor.pan_number,
                'business_address': vendor.business_address,
                'city': vendor.city,
                'state': vendor.state,
                'pincode': vendor.pincode,
                'phone': vendor.phone,
                'website': vendor.website,
                'description': vendor.description,
                'is_approved': vendor.is_approved,
                'is_active': vendor.is_active,
                'created_at': vendor.created_at.isoformat(),
                'assigned_categories': [{
                    'id': cat.id,
                    'name': cat.name,
                    'description': cat.description
                } for cat in all_categories]
            },
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'phone': user.phone
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch profile: {str(e)}'}), 500


@vendor_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_vendor_profile():
    """Update vendor profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        
        if not user or not user.is_vendor:
            return jsonify({'error': 'Vendor account not found'}), 404
        
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor profile not found'}), 404
        
        data = request.get_json()
        
        # Update user info
        if data.get('full_name'):
            user.full_name = data['full_name']
        if data.get('phone'):
            user.phone = data['phone']
        
        # Update vendor info
        if data.get('business_name'):
            vendor.business_name = data['business_name']
        if data.get('business_type'):
            vendor.business_type = data['business_type']
        if data.get('gst_number'):
            vendor.gst_number = data['gst_number']
        if data.get('pan_number'):
            vendor.pan_number = data['pan_number']
        if data.get('business_address'):
            vendor.business_address = data['business_address']
        if data.get('city'):
            vendor.city = data['city']
        if data.get('state'):
            vendor.state = data['state']
        if data.get('pincode'):
            vendor.pincode = data['pincode']
        if data.get('phone'):
            vendor.phone = data['phone']
        if data.get('website'):
            vendor.website = data['website']
        if data.get('description'):
            vendor.description = data['description']
        
        db.session.commit()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500


# ==================== VENDOR PRODUCT MANAGEMENT ====================

@vendor_bp.route('/products', methods=['GET'])
@jwt_required()
def get_vendor_products():
    """Get vendor's products"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        category_id = request.args.get('category_id', type=int)
        
        query = Product.query.filter_by(vendor_id=vendor.id)
        
        if search:
            query = query.filter(Product.name.ilike(f'%{search}%'))
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        pagination = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        products = [{
            'id': prod.id,
            'name': prod.name,
            'description': prod.description,
            'price': prod.price,
            'stock': prod.stock,
            'unit': prod.unit,
            'image_url': prod.image_url,
            'is_active': prod.is_active,
            'is_approved': prod.is_approved,
            'category_id': prod.category_id,
            'category_name': prod.category.name,
            'created_at': prod.created_at.isoformat(),
            'updated_at': prod.updated_at.isoformat()
        } for prod in pagination.items]
        
        return jsonify({
            'products': products,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch products: {str(e)}'}), 500


@vendor_bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    """Create a new product"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Handle both JSON and form data
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
            name = data.get('name')
            description = data.get('description', '')
            price = data.get('price')
            stock = data.get('stock', 0)
            unit = data.get('unit', '')
            category_id = data.get('category_id')
            image_url = data.get('image_url', '')
            image_file = None
        else:
            # Handle form data with file upload
            name = request.form.get('name')
            description = request.form.get('description', '')
            price = request.form.get('price')
            stock = request.form.get('stock', 0)
            unit = request.form.get('unit', '')
            category_id = request.form.get('category_id')
            image_file = request.files.get('image')
            image_url = ''
        
        if not name or not price or not category_id:
            return jsonify({'error': 'Name, price, and category are required'}), 400
        
        # Allow vendors to add products to any active category
        # (removed vendor category restriction for better flexibility)
        
        # Check if category exists
        category = Category.query.get(int(category_id))
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        
        # Handle image upload
        if image_file and image_file.filename:
            # Create upload directory if it doesn't exist
            upload_dir = 'uploads/products'
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            
            # Generate secure filename
            filename = secure_filename(image_file.filename)
            # Add timestamp to avoid filename conflicts
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            name_part, ext = os.path.splitext(filename)
            filename = f"{name_part}_{timestamp}{ext}"
            
            # Save file
            file_path = os.path.join(upload_dir, filename)
            image_file.save(file_path)
            
            # Generate URL for the saved image
            image_url = f"/uploads/products/{filename}"
        
        product = Product(
            category_id=int(category_id),
            vendor_id=vendor.id,
            name=name,
            description=description,
            price=float(price),
            stock=int(stock),
            unit=unit,
            image_url=image_url,
            is_approved=False  # Vendor products need approval
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'message': 'Product created successfully. Pending admin approval.',
            'product_id': product.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create product: {str(e)}'}), 500


@vendor_bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update a product"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        product = Product.query.filter_by(id=product_id, vendor_id=vendor.id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        
        if data.get('name'):
            product.name = data['name']
        if data.get('description'):
            product.description = data['description']
        if data.get('price'):
            product.price = data['price']
        if 'stock' in data:
            product.stock = data['stock']
        if data.get('unit'):
            product.unit = data['unit']
        if data.get('image_url'):
            product.image_url = data['image_url']
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        # If changing category, allow any active category
        if data.get('category_id') and data['category_id'] != product.category_id:
            # Check if new category exists and is active
            new_category = Category.query.get(data['category_id'])
            if not new_category or not new_category.is_active:
                return jsonify({'error': 'Category not found or inactive'}), 404
            
            product.category_id = data['category_id']
            product.is_approved = False  # Re-approval needed for category change
        
        db.session.commit()
        
        return jsonify({'message': 'Product updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update product: {str(e)}'}), 500


@vendor_bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete a product"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        product = Product.query.filter_by(id=product_id, vendor_id=vendor.id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete product: {str(e)}'}), 500


# ==================== VENDOR DASHBOARD ====================

@vendor_bp.route('/dashboard/stats', methods=['GET'])
@jwt_required()
def get_vendor_dashboard_stats():
    """Get vendor dashboard statistics"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Product statistics
        total_products = Product.query.filter_by(vendor_id=vendor.id).count()
        active_products = Product.query.filter_by(vendor_id=vendor.id, is_active=True).count()
        pending_products = Product.query.filter_by(vendor_id=vendor.id, is_approved=False).count()
        approved_products = Product.query.filter_by(vendor_id=vendor.id, is_approved=True).count()
        
        # Get all active categories (vendors can see all categories)
        all_categories = Category.query.filter_by(is_active=True).all()
        
        return jsonify({
            'vendor': {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'is_approved': vendor.is_approved,
                'is_active': vendor.is_active
            },
            'products': {
                'total': total_products,
                'active': active_products,
                'pending': pending_products,
                'approved': approved_products
            },
            'categories': [{
                'id': cat.id,
                'name': cat.name,
                'description': cat.description
            } for cat in all_categories]
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch dashboard stats: {str(e)}'}), 500


# ==================== VENDOR ORDER MANAGEMENT ====================

@vendor_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_vendor_orders():
    """Get orders for vendor's products"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Get orders that contain vendor's products
        from models import Order, OrderItem
        
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')
        
        # Query orders that have items from this vendor
        query = db.session.query(Order).join(OrderItem).join(Product).filter(
            Product.vendor_id == vendor.id
        ).distinct()
        
        if status:
            query = query.filter(Order.status == status)
        
        pagination = query.order_by(Order.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        orders = []
        for order in pagination.items:
            # Derive vendor-specific items from this order's items to avoid join-related gaps
            vendor_items = []
            for item in order.items:
                prod = item.product
                if prod and prod.vendor_id == vendor.id:
                    vendor_items.append(item)

            if vendor_items:
                vendor_total = sum((item.price or 0) * (item.quantity or 0) for item in vendor_items)
                order_data = {
                    'id': order.id,
                    'user_name': order.user.full_name,
                    'user_email': order.user.email,
                    'status': (order.status or '').lower(),
                    'payment_status': (order.payment_status or '').lower(),
                    'total_amount': round(vendor_total, 2),
                    'created_at': order.created_at.isoformat(),
                    'final_amount': order.final_amount,
                    'coupon_code': order.coupon_code,
                    'address': {
                        'address_line1': order.address.address_line1 if order.address else None,
                        'address_line2': order.address.address_line2 if order.address else None,
                        'city': order.address.city if order.address else None,
                        'state': order.address.state if order.address else None,
                        'postal_code': order.address.postal_code if order.address else None,
                        'country': order.address.country if order.address else None
                    } if order.address else None,
                    'items': [{
                        'id': item.id,
                        'product_name': (item.product.name if item.product else 'Product'),
                        'quantity': item.quantity,
                        'price': item.price,
                        'total': round((item.price or 0) * (item.quantity or 0), 2)
                    } for item in vendor_items]
                }
                orders.append(order_data)
        
        return jsonify({
            'orders': orders,
            'total': len(orders),
            'page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch orders: {str(e)}'}), 500


@vendor_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    """Update order status (vendor can only update their own orders)"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Check if order has vendor's products
        from models import Order, OrderItem
        
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Check if order contains vendor's products
        vendor_items = OrderItem.query.join(Product).filter(
            OrderItem.order_id == order_id,
            Product.vendor_id == vendor.id
        ).first()
        
        if not vendor_items:
            return jsonify({'error': 'You can only update orders containing your products'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        # Define allowed status transitions for vendors
        allowed_statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
        if new_status not in allowed_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        # Map vendor status to capitalized form for DB/admin consistency
        status_map = {
            'pending': 'Pending',
            'confirmed': 'Confirmed',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        }
        order.status = status_map.get(new_status.lower(), order.status)
        db.session.commit()
        

        return jsonify({'message': 'Order status updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update order status: {str(e)}'}), 500


# ==================== VENDOR ORDER DETAILS ====================

@vendor_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_vendor_order_detail(order_id):
    """Get detailed order info for this vendor's portion of the order"""
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404

        from models import Order, OrderItem, Product
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Restrict to vendor's items
        vendor_items = OrderItem.query.join(Product).filter(
            OrderItem.order_id == order.id,
            Product.vendor_id == vendor.id
        ).all()

        if not vendor_items:
            return jsonify({'error': 'No items for this vendor in the order'}), 403

        response = {
            'id': order.id,
            'user_name': order.user.full_name,
            'user_email': order.user.email,
            'status': (order.status or '').lower(),
            'payment_status': (order.payment_status or '').lower(),
            'created_at': order.created_at.isoformat(),
            'final_amount': order.final_amount,
            'coupon_code': order.coupon_code,
            'address': {
                'address_line1': order.address.address_line1 if order.address else None,
                'address_line2': order.address.address_line2 if order.address else None,
                'city': order.address.city if order.address else None,
                'state': order.address.state if order.address else None,
                'postal_code': order.address.postal_code if order.address else None,
                'country': order.address.country if order.address else None
            } if order.address else None,
            'items': [{
                'id': item.id,
                'product_name': item.product.name,
                'quantity': item.quantity,
                'price': item.price,
                'total': item.price * item.quantity
            } for item in vendor_items],
            'vendor_subtotal': sum(item.price * item.quantity for item in vendor_items)
        }

        return jsonify({'order': response}), 200

    except Exception as e:
        return jsonify({'error': f'Failed to fetch order details: {str(e)}'}), 500


@vendor_bp.route('/orders/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_vendor_order(order_id):
    """Allow vendor to delete an order record only if it contains their products and is terminal (delivered/cancelled).
    This deletes the whole order – use with caution; typically admins should manage deletions. """
    try:
        user_id = int(get_jwt_identity())
        vendor = Vendor.query.filter_by(user_id=user_id).first()
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404

        from models import Order, OrderItem, Product
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        if order.status not in ['Delivered', 'Cancelled']:
            return jsonify({'error': 'Only delivered or cancelled orders can be deleted'}), 400

        # Ensure this order includes this vendor's products
        has_vendor_items = db.session.query(OrderItem).join(Product).filter(
            OrderItem.order_id == order.id,
            Product.vendor_id == vendor.id
        ).first()
        if not has_vendor_items:
            return jsonify({'error': 'No items for this vendor in the order'}), 403

        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete order: {str(e)}'}), 500
