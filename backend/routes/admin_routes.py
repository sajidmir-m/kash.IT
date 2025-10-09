from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Product, Category, Order, OrderItem, Address, Coupon, IoTDevice, SensorData, Vendor, VendorCategory, DeliveryPartner
from services.auth_decorator import admin_required
from services.email_service import send_vendor_credentials_email
from datetime import datetime, timedelta
from sqlalchemy import func, desc
import secrets

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ==================== DASHBOARD STATS ====================

@admin_bp.route('/dashboard/stats', methods=['GET'])
@admin_required
def get_dashboard_stats():
    """Get comprehensive dashboard statistics"""
    try:
        # User statistics
        total_users = User.query.count()
        verified_users = User.query.filter_by(is_verified=True).count()
        admin_users = User.query.filter_by(is_admin=True).count()
        
        # Product statistics
        total_products = Product.query.count()
        active_products = Product.query.filter_by(is_active=True).count()
        total_categories = Category.query.count()
        active_categories = Category.query.filter_by(is_active=True).count()
        
        # Order statistics
        total_orders = Order.query.count()
        pending_orders = Order.query.filter_by(status='Pending').count()
        completed_orders = Order.query.filter_by(status='Completed').count()
        
        # Revenue statistics
        total_revenue = db.session.query(func.sum(Order.final_amount)).filter_by(status='Completed').scalar() or 0
        monthly_revenue = db.session.query(func.sum(Order.final_amount)).filter(
            Order.status == 'Completed',
            Order.created_at >= datetime.utcnow().replace(day=1)
        ).scalar() or 0
        
        # Recent orders (last 10)
        recent_orders = Order.query.order_by(desc(Order.created_at)).limit(10).all()
        recent_orders_data = [{
            'id': order.id,
            'user_email': order.user.email,
            'total_amount': order.final_amount,
            'status': order.status,
            'created_at': order.created_at.isoformat()
        } for order in recent_orders]
        
        # Top selling products
        top_products = db.session.query(
            Product.name,
            func.sum(OrderItem.quantity).label('total_sold')
        ).join(OrderItem).join(Order).filter(
            Order.status == 'Completed'
        ).group_by(Product.id).order_by(desc('total_sold')).limit(5).all()
        
        top_products_data = [{
            'name': product.name,
            'total_sold': int(total_sold)
        } for product, total_sold in top_products]
        
        return jsonify({
            'users': {
                'total': total_users,
                'verified': verified_users,
                'admins': admin_users
            },
            'products': {
                'total': total_products,
                'active': active_products,
                'categories': total_categories,
                'active_categories': active_categories
            },
            'orders': {
                'total': total_orders,
                'pending': pending_orders,
                'completed': completed_orders
            },
            'revenue': {
                'total': float(total_revenue),
                'monthly': float(monthly_revenue)
            },
            'recent_orders': recent_orders_data,
            'top_products': top_products_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch dashboard stats: {str(e)}'}), 500

# ==================== USER MANAGEMENT ====================

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    """Get all users with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        role = request.args.get('role', '')  # 'admin', 'user', or ''
        verified = request.args.get('verified', '')  # 'true', 'false', or ''
        
        # By default, exclude vendors from the Users list
        query = User.query.filter(User.is_vendor == False)
        
        if search:
            query = query.filter(
                (User.email.ilike(f'%{search}%')) |
                (User.full_name.ilike(f'%{search}%'))
            )
        
        if role == 'admin':
            query = User.query.filter(User.is_admin == True)
        elif role == 'user':
            query = query.filter(User.is_admin == False, User.is_vendor == False)
            
        if verified == 'true':
            query = query.filter_by(is_verified=True)
        elif verified == 'false':
            query = query.filter_by(is_verified=False)
        
        pagination = query.order_by(desc(User.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        users = [{
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone,
            'is_verified': user.is_verified,
            'is_admin': user.is_admin,
            'created_at': user.created_at.isoformat(),
            'orders_count': Order.query.filter_by(user_id=user.id).count()
        } for user in pagination.items]
        
        return jsonify({
            'users': users,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch users: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required
def get_user(user_id):
    """Get detailed user information"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's orders
        orders = Order.query.filter_by(user_id=user_id).order_by(desc(Order.created_at)).limit(10).all()
        orders_data = [{
            'id': order.id,
            'total_amount': order.final_amount,
            'status': order.status,
            'created_at': order.created_at.isoformat()
        } for order in orders]
        
        # Get user's addresses
        addresses = Address.query.filter_by(user_id=user_id).all()
        addresses_data = [{
            'id': addr.id,
            'address_line1': addr.address_line1,
            'city': addr.city,
            'state': addr.state,
            'is_default': addr.is_default
        } for addr in addresses]
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'phone': user.phone,
                'is_verified': user.is_verified,
                'is_admin': user.is_admin,
                'created_at': user.created_at.isoformat(),
                'orders': orders_data,
                'addresses': addresses_data
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@admin_required
def update_user(user_id):
    """Update user information"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if data.get('full_name'):
            user.full_name = data['full_name']
        if data.get('phone'):
            user.phone = data['phone']
        if 'is_verified' in data:
            user.is_verified = data['is_verified']
        if 'is_admin' in data:
            user.is_admin = data['is_admin']
        
        db.session.commit()
        
        return jsonify({'message': 'User updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update user: {str(e)}'}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """Delete user and all related data"""
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if trying to delete self
        current_user_id = int(get_jwt_identity())
        if user_id == current_user_id:
            return jsonify({'error': 'Cannot delete your own account'}), 400
        
        db.session.delete(user)
        db.session.commit()
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete user: {str(e)}'}), 500

# ==================== ORDER MANAGEMENT ====================

@admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_orders():
    """Get all orders with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')
        search = request.args.get('search', '')
        
        query = Order.query
        
        if status:
            query = query.filter_by(status=status)
        
        if search:
            query = query.join(User).filter(User.email.ilike(f'%{search}%'))
        
        pagination = query.order_by(desc(Order.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        orders = []
        for order in pagination.items:
            order_data = {
                'id': order.id,
                'user_email': order.user.email,
                'total_amount': order.total_amount,
                'discount_amount': order.discount_amount,
                'final_amount': order.final_amount,
                'status': order.status,
                'payment_status': order.payment_status,
                'coupon_code': order.coupon_code,
                'created_at': order.created_at.isoformat(),
                'items_count': len(order.items)
            }
            if order.address:
                order_data['address'] = {
                    'city': order.address.city,
                    'state': order.address.state
                }
            orders.append(order_data)
        
        return jsonify({
            'orders': orders,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch orders: {str(e)}'}), 500

@admin_bp.route('/orders/<int:order_id>', methods=['GET'])
@admin_required
def get_order(order_id):
    """Get detailed order information"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        items = [{
            'id': item.id,
            'product_name': item.product.name,
            'quantity': item.quantity,
            'price': item.price,
            'total': item.quantity * item.price
        } for item in order.items]
        
        order_data = {
            'id': order.id,
            'user': {
                'id': order.user.id,
                'email': order.user.email,
                'full_name': order.user.full_name,
                'phone': order.user.phone
            },
            'address': {
                'address_line1': order.address.address_line1,
                'address_line2': order.address.address_line2,
                'city': order.address.city,
                'state': order.address.state,
                'postal_code': order.address.postal_code,
                'country': order.address.country
            } if order.address else None,
            'total_amount': order.total_amount,
            'discount_amount': order.discount_amount,
            'final_amount': order.final_amount,
            'status': order.status,
            'payment_status': order.payment_status,
            'coupon_code': order.coupon_code,
            'created_at': order.created_at.isoformat(),
            'items': items
        }
        
        return jsonify({'order': order_data}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch order: {str(e)}'}), 500

@admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    """Update order status"""
    try:
        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Completed']
        if new_status not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        order.status = new_status
        db.session.commit()
        
        return jsonify({'message': 'Order status updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update order status: {str(e)}'}), 500

# ==================== SYSTEM SETTINGS ====================

@admin_bp.route('/settings', methods=['GET'])
@admin_required
def get_settings():
    """Get system settings"""
    try:
        # This would typically come from a settings table
        # For now, return some basic system info
        settings = {
            'site_name': 'Kash.it',
            'maintenance_mode': False,
            'registration_enabled': True,
            'max_file_size': '10MB',
            'supported_image_formats': ['jpg', 'jpeg', 'png', 'webp']
        }
        
        return jsonify({'settings': settings}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch settings: {str(e)}'}), 500

@admin_bp.route('/settings', methods=['PUT'])
@admin_required
def update_settings():
    """Update system settings"""
    try:
        data = request.get_json()
        
        # This would typically update a settings table
        # For now, just return success
        
        return jsonify({'message': 'Settings updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to update settings: {str(e)}'}), 500

# ==================== VENDOR MANAGEMENT ====================

@admin_bp.route('/vendors', methods=['GET'])
@admin_required
def get_vendors():
    """Get all vendors with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')  # 'approved', 'pending', 'inactive'
        
        query = db.session.query(Vendor).join(User)
        
        if search:
            query = query.filter(
                (Vendor.business_name.ilike(f'%{search}%')) |
                (User.email.ilike(f'%{search}%')) |
                (User.full_name.ilike(f'%{search}%'))
            )
        
        if status == 'approved':
            query = query.filter(Vendor.is_approved == True, Vendor.is_active == True)
        elif status == 'pending':
            query = query.filter(Vendor.is_approved == False)
        elif status == 'inactive':
            query = query.filter(Vendor.is_active == False)
        
        pagination = query.order_by(desc(Vendor.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        vendors = []
        for vendor in pagination.items:
            user = vendor.user
            vendor_data = {
                'id': vendor.id,
                'business_name': vendor.business_name,
                'business_type': vendor.business_type,
                'email': user.email,
                'full_name': user.full_name,
                'phone': vendor.phone,
                'city': vendor.city,
                'state': vendor.state,
                'is_approved': vendor.is_approved,
                'is_active': vendor.is_active,
                'created_at': vendor.created_at.isoformat(),
                'products_count': Product.query.filter_by(vendor_id=vendor.id).count()
            }
            vendors.append(vendor_data)
        
        return jsonify({
            'vendors': vendors,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch vendors: {str(e)}'}), 500


@admin_bp.route('/vendors/<int:vendor_id>', methods=['GET'])
@admin_required
def get_vendor(vendor_id):
    """Get detailed vendor information"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        user = vendor.user
        
        # Get assigned categories
        assigned_categories = db.session.query(Category).join(VendorCategory).filter(
            VendorCategory.vendor_id == vendor.id,
            VendorCategory.is_active == True
        ).all()
        
        # Get vendor's products
        products = Product.query.filter_by(vendor_id=vendor_id).order_by(desc(Product.created_at)).limit(10).all()
        
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
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': user.full_name,
                    'phone': user.phone
                },
                'assigned_categories': [{
                    'id': cat.id,
                    'name': cat.name,
                    'description': cat.description
                } for cat in assigned_categories],
                'products': [{
                    'id': prod.id,
                    'name': prod.name,
                    'price': prod.price,
                    'is_approved': prod.is_approved,
                    'is_active': prod.is_active,
                    'created_at': prod.created_at.isoformat()
                } for prod in products]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch vendor: {str(e)}'}), 500


@admin_bp.route('/vendors/<int:vendor_id>', methods=['PUT'])
@admin_required
def update_vendor(vendor_id):
    """Update vendor information and status"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        data = request.get_json()
        
        # Update vendor status
        if 'is_approved' in data:
            vendor.is_approved = data['is_approved']
        if 'is_active' in data:
            vendor.is_active = data['is_active']
        
        # Update vendor details
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
        
        return jsonify({'message': 'Vendor updated successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update vendor: {str(e)}'}), 500


@admin_bp.route('/vendors/<int:vendor_id>/categories', methods=['POST'])
@admin_required
def assign_categories_to_vendor(vendor_id):
    """Assign categories to a vendor"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        data = request.get_json()
        category_ids = data.get('category_ids', [])
        
        if not category_ids:
            return jsonify({'error': 'Category IDs are required'}), 400
        
        # Remove existing assignments
        VendorCategory.query.filter_by(vendor_id=vendor_id).delete()
        
        # Add new assignments
        for category_id in category_ids:
            category = Category.query.get(category_id)
            if category:
                vendor_category = VendorCategory(
                    vendor_id=vendor_id,
                    category_id=category_id,
                    is_active=True
                )
                db.session.add(vendor_category)
        
        db.session.commit()
        
        return jsonify({'message': 'Categories assigned successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to assign categories: {str(e)}'}), 500


@admin_bp.route('/vendors/<int:vendor_id>', methods=['DELETE'])
@admin_required
def delete_vendor(vendor_id):
    """Delete vendor and all related data"""
    try:
        vendor = Vendor.query.get(vendor_id)
        if not vendor:
            return jsonify({'error': 'Vendor not found'}), 404
        
        # Delete vendor and related data
        db.session.delete(vendor)
        db.session.commit()
        
        return jsonify({'message': 'Vendor deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete vendor: {str(e)}'}), 500


# ==================== VENDOR PRODUCT APPROVAL ====================

@admin_bp.route('/products/pending', methods=['GET'])
@admin_required
def get_pending_products():
    """Get products pending approval"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        vendor_id = request.args.get('vendor_id', type=int)
        
        query = Product.query.filter_by(is_approved=False).join(Vendor)
        
        if vendor_id:
            query = query.filter(Product.vendor_id == vendor_id)
        
        pagination = query.order_by(desc(Product.created_at)).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        products = []
        for product in pagination.items:
            product_data = {
                'id': product.id,
                'name': product.name,
                'description': product.description,
                'price': product.price,
                'stock': product.stock,
                'unit': product.unit,
                'image_url': product.image_url,
                'category_id': product.category_id,
                'category_name': product.category.name,
                'vendor_id': product.vendor_id,
                'vendor_name': product.vendor.business_name if product.vendor else 'Admin',
                'created_at': product.created_at.isoformat()
            }
            products.append(product_data)
        
        return jsonify({
            'products': products,
            'total': pagination.total,
            'page': page,
            'per_page': per_page,
            'pages': pagination.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch pending products: {str(e)}'}), 500


@admin_bp.route('/products/<int:product_id>/approve', methods=['PUT'])
@admin_required
def approve_product(product_id):
    """Approve or reject a product"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        data = request.get_json()
        is_approved = data.get('is_approved', False)
        
        product.is_approved = is_approved
        if not is_approved:
            product.is_active = False  # Rejected products are deactivated
        
        db.session.commit()
        
        status = 'approved' if is_approved else 'rejected'
        return jsonify({'message': f'Product {status} successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update product approval: {str(e)}'}), 500


# ==================== VENDOR CREATION ====================

@admin_bp.route('/vendors/create', methods=['POST'])
@admin_required
def create_vendor():
    """Create a new vendor with credentials"""
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('business_name'):
            return jsonify({'error': 'Email and business name are required'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Generate temporary password
        temp_password = ''.join([str(secrets.randbelow(10)) for _ in range(8)])
        
        # Create vendor user
        vendor_user = User(
            email=data['email'],
            full_name=data.get('full_name', data['business_name']),
            phone=data.get('phone'),
            is_vendor=True,
            is_verified=True  # Admin creates verified vendors
        )
        vendor_user.set_password(temp_password)
        
        db.session.add(vendor_user)
        db.session.flush()  # Get the vendor user ID
        
        # Create vendor profile
        vendor_profile = Vendor(
            user_id=vendor_user.id,
            business_name=data['business_name'],
            business_type=data.get('business_type', ''),
            phone=data.get('phone'),
            business_address=data.get('address', ''),
            city=data.get('city', ''),
            state=data.get('state', ''),
            pincode=data.get('pincode', ''),
            gst_number=data.get('gst_number', ''),
            is_active=True
        )
        
        db.session.add(vendor_profile)
        db.session.commit()
        
        # Send credentials email
        send_vendor_credentials_email(
            current_app.extensions['mail'], 
            current_app._get_current_object(), 
            vendor_user.email, 
            temp_password,
            data['business_name']
        )
        
        return jsonify({
            'message': 'Vendor created successfully',
            'vendor': {
                'id': vendor_user.id,
                'email': vendor_user.email,
                'business_name': vendor_profile.business_name,
                'temp_password': temp_password
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create vendor: {str(e)}'}), 500


# ==================== DELIVERY PARTNER MANAGEMENT ====================

@admin_bp.route('/delivery-partners', methods=['GET'])
@admin_required
def list_delivery_partners():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')  # verified, pending, inactive

        query = DeliveryPartner.query
        if status == 'verified':
            query = query.filter(DeliveryPartner.is_verified == True, DeliveryPartner.is_active == True)
        elif status == 'pending':
            query = query.filter(DeliveryPartner.is_verified == False)
        elif status == 'inactive':
            query = query.filter(DeliveryPartner.is_active == False)

        pagination = query.order_by(desc(DeliveryPartner.created_at)).paginate(page=page, per_page=per_page, error_out=False)

        items = []
        for p in pagination.items:
            u = p.user
            items.append({
                'id': p.id,
                'user_id': p.user_id,
                'email': u.email if u else '',
                'full_name': p.full_name,
                'phone': p.phone,
                'is_verified': p.is_verified,
                'is_active': p.is_active,
                'created_at': p.created_at.isoformat()
            })

        return jsonify({'partners': items, 'total': pagination.total, 'page': page, 'per_page': per_page, 'pages': pagination.pages}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch delivery partners: {str(e)}'}), 500


@admin_bp.route('/delivery-partners/<int:partner_id>', methods=['PUT'])
@admin_required
def update_delivery_partner(partner_id):
    try:
        partner = DeliveryPartner.query.get(partner_id)
        if not partner:
            return jsonify({'error': 'Delivery partner not found'}), 404
        data = request.get_json() or {}
        if 'is_verified' in data:
            partner.is_verified = data['is_verified']
        if 'is_active' in data:
            partner.is_active = data['is_active']
        if data.get('full_name'):
            partner.full_name = data['full_name']
        if data.get('phone'):
            partner.phone = data['phone']
        db.session.commit()
        return jsonify({'message': 'Delivery partner updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update delivery partner: {str(e)}'}), 500


@admin_bp.route('/delivery-partners/<int:partner_id>', methods=['DELETE'])
@admin_required
def delete_delivery_partner(partner_id):
    try:
        partner = DeliveryPartner.query.get(partner_id)
        if not partner:
            return jsonify({'error': 'Delivery partner not found'}), 404
        db.session.delete(partner)
        db.session.commit()
        return jsonify({'message': 'Delivery partner deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete delivery partner: {str(e)}'}), 500


@admin_bp.route('/delivery-partners/<int:partner_id>', methods=['GET'])
@admin_required
def get_delivery_partner(partner_id):
    try:
        partner = DeliveryPartner.query.get(partner_id)
        if not partner:
            return jsonify({'error': 'Delivery partner not found'}), 404

        # Recent deliveries assigned to this partner
        recent_orders = Order.query.filter_by(delivery_partner_id=partner.id).order_by(desc(Order.created_at)).limit(20).all()
        deliveries = [{
            'id': o.id,
            'status': o.status,
            'delivery_status': getattr(o, 'delivery_status', None),
            'created_at': o.created_at.isoformat(),
            'customer': {
                'name': o.user.full_name if o.user else '',
                'email': o.user.email if o.user else ''
            },
            'address': {
                'city': o.address.city if o.address else None,
                'state': o.address.state if o.address else None,
                'postal_code': o.address.postal_code if o.address else None
            } if o.address else None
        } for o in recent_orders]

        data = {
            'id': partner.id,
            'user_id': partner.user_id,
            'full_name': partner.full_name,
            'email': partner.user.email if partner.user else '',
            'phone': partner.phone,
            'is_verified': partner.is_verified,
            'is_active': partner.is_active,
            'created_at': partner.created_at.isoformat(),
            'deliveries': deliveries
        }
        return jsonify({'partner': data}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch delivery partner: {str(e)}'}), 500
