from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Order, OrderItem, CartItem, Product, Coupon, Address, User, Vendor
from services.auth_decorator import verified_user_required, admin_required
from services.email_service import send_order_notification_email
from datetime import datetime

order_bp = Blueprint('orders', __name__, url_prefix='/api/orders')


@order_bp.route('/', methods=['POST'])
@verified_user_required
def create_order():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    payment_method = (data or {}).get('payment_method', 'ONLINE')
    
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400
    
    total_amount = 0
    order_items_data = []
    
    for item in cart_items:
        if not item.product.is_active:
            return jsonify({'error': f'Product {item.product.name} is no longer available'}), 400
        
        if item.quantity > item.product.stock:
            return jsonify({'error': f'Insufficient stock for {item.product.name}'}), 400
        
        item_total = item.product.price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            'product_id': item.product_id,
            'quantity': item.quantity,
            'price': item.product.price
        })
    
    discount_amount = 0
    coupon_code = None
    
    if data and data.get('coupon_code'):
        coupon = Coupon.query.filter_by(code=data['coupon_code'], is_active=True).first()
        
        if coupon:
            if coupon.valid_until and coupon.valid_until < datetime.utcnow():
                return jsonify({'error': 'Coupon has expired'}), 400
            
            if coupon.usage_limit and coupon.usage_count >= coupon.usage_limit:
                return jsonify({'error': 'Coupon usage limit reached'}), 400
            
            if total_amount < coupon.min_purchase_amount:
                return jsonify({'error': f'Minimum purchase amount of {coupon.min_purchase_amount} required'}), 400
            
            if coupon.discount_type == 'percentage':
                discount_amount = (total_amount * coupon.discount_value) / 100
                if coupon.max_discount_amount:
                    discount_amount = min(discount_amount, coupon.max_discount_amount)
            else:
                discount_amount = coupon.discount_value
            
            coupon_code = coupon.code
            coupon.usage_count += 1
    
    final_amount = total_amount - discount_amount
    
    address_id = data.get('address_id') if data else None
    if address_id:
        address = Address.query.filter_by(id=address_id, user_id=user_id).first()
        if not address:
            return jsonify({'error': 'Invalid address'}), 400
    
    order = Order(
        user_id=user_id,
        address_id=address_id,
        total_amount=total_amount,
        discount_amount=discount_amount,
        final_amount=final_amount,
        coupon_code=coupon_code,
        status='Pending',
        payment_status='Pending'
    )
    
    db.session.add(order)
    db.session.flush()
    
    for item_data in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            price=item_data['price']
        )
        db.session.add(order_item)
        
        product = Product.query.get(item_data['product_id'])
        product.stock -= item_data['quantity']
    
    CartItem.query.filter_by(user_id=user_id).delete()
    
    db.session.commit()
    
    # Send order notifications
    try:
        # Get order details for notifications
        order_details = {
            'order_id': order.id,
            'total_amount': total_amount,
            'final_amount': final_amount,
            'customer_email': User.query.get(user_id).email,
            'items': []
        }
        
        # Get order items with product details
        for item in order.items:
            product = Product.query.get(item.product_id)
            vendor_email = None
            if product.vendor_id:
                vendor = Vendor.query.filter_by(user_id=product.vendor_id).first()
                if vendor:
                    vendor_email = User.query.get(product.vendor_id).email
            
            order_details['items'].append({
                'product_name': product.name,
                'quantity': item.quantity,
                'price': item.price,
                'vendor_email': vendor_email
            })
        
        # Send notifications to vendors and admin
        send_order_notification_email(
            current_app.extensions['mail'],
            current_app._get_current_object(),
            order_details
        )
    except Exception as e:
        print(f"Failed to send order notifications: {str(e)}")
        # Don't fail the order if notifications fail
    
    return jsonify({
        'message': 'Order placed successfully',
        'order_id': order.id,
        'total_amount': total_amount,
        'discount_amount': discount_amount,
        'final_amount': final_amount,
        'payment_method': 'COD' if str(payment_method).upper() == 'COD' else 'ONLINE'
    }), 201


@order_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    user_id = int(get_jwt_identity())
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    
    return jsonify({
        'orders': [{
            'id': order.id,
            'total_amount': order.total_amount,
            'discount_amount': order.discount_amount,
            'final_amount': order.final_amount,
            'status': order.status,
            'payment_status': order.payment_status,
            'created_at': order.created_at.isoformat(),
            'items_count': len(order.items)
        } for order in orders]
    }), 200


@order_bp.route('/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    return jsonify({
        'id': order.id,
        'total_amount': order.total_amount,
        'discount_amount': order.discount_amount,
        'final_amount': order.final_amount,
        'coupon_code': order.coupon_code,
        'status': order.status,
        'payment_status': order.payment_status,
        'created_at': order.created_at.isoformat(),
        'items': [{
            'product_id': item.product_id,
            'product_name': item.product.name if item.product else 'Product not available',
            'quantity': item.quantity,
            'price': item.price,
            'total': item.quantity * item.price
        } for item in order.items],
        'address': {
            'address_line1': order.address.address_line1,
            'address_line2': order.address.address_line2,
            'city': order.address.city,
            'state': order.address.state,
            'postal_code': order.address.postal_code,
            'country': order.address.country
        } if order.address else None
    }), 200


@order_bp.route('/<int:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    user_id = int(get_jwt_identity())
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    # Only allow delete if terminal state
    if order.status not in ['Delivered', 'Cancelled']:
        return jsonify({'error': 'Only delivered or cancelled orders can be deleted'}), 400

    db.session.delete(order)
    db.session.commit()
    return jsonify({'message': 'Order deleted successfully'}), 200


@order_bp.route('/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    
    data = request.get_json()
    
    if not data or 'status' not in data:
        return jsonify({'error': 'Status is required'}), 400
    
    valid_statuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    
    if data['status'] not in valid_statuses:
        return jsonify({'error': 'Invalid status'}), 400
    
    order.status = data['status']
    
    if 'payment_status' in data:
        valid_payment_statuses = ['Pending', 'Success', 'Failed']
        if data['payment_status'] in valid_payment_statuses:
            order.payment_status = data['payment_status']
    
    db.session.commit()
    
    return jsonify({'message': 'Order status updated successfully'}), 200


@order_bp.route('/all', methods=['GET'])
@admin_required
def get_all_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    status = request.args.get('status')
    
    query = Order.query
    
    if status:
        query = query.filter_by(status=status)
    
    pagination = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'orders': [{
            'id': order.id,
            'user_id': order.user_id,
            'user_email': order.user.email,
            'total_amount': order.total_amount,
            'final_amount': order.final_amount,
            'status': order.status,
            'payment_status': order.payment_status,
            'created_at': order.created_at.isoformat()
        } for order in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    }), 200
