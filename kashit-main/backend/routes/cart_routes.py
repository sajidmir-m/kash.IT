from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CartItem, Product
from services.auth_decorator import verified_user_required

cart_bp = Blueprint('cart', __name__, url_prefix='/api/cart')


@cart_bp.route('/', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = int(get_jwt_identity())
    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    
    total = 0
    items = []
    
    for item in cart_items:
        if item.product and item.product.is_active:
            item_total = item.product.price * item.quantity
            total += item_total
            items.append({
                'id': item.id,
                'product_id': item.product_id,
                'product_name': item.product.name,
                'price': item.product.price,
                'quantity': item.quantity,
                'unit': item.product.unit,
                'image_url': item.product.image_url,
                'stock': item.product.stock,
                'item_total': item_total
            })
    
    return jsonify({
        'cart_items': items,
        'total': total
    }), 200


@cart_bp.route('/add', methods=['POST'])
@verified_user_required
def add_to_cart():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('product_id'):
        return jsonify({'error': 'Product ID is required'}), 400
    
    product = Product.query.get(data['product_id'])
    
    if not product or not product.is_active:
        return jsonify({'error': 'Product not found'}), 404
    
    quantity = data.get('quantity', 1)
    
    if quantity > product.stock:
        return jsonify({'error': 'Insufficient stock'}), 400
    
    cart_item = CartItem.query.filter_by(user_id=user_id, product_id=product.id).first()
    
    if cart_item:
        cart_item.quantity += quantity
        if cart_item.quantity > product.stock:
            return jsonify({'error': 'Insufficient stock'}), 400
    else:
        cart_item = CartItem(
            user_id=user_id,
            product_id=product.id,
            quantity=quantity
        )
        db.session.add(cart_item)
    
    db.session.commit()
    
    return jsonify({'message': 'Product added to cart successfully'}), 201


@cart_bp.route('/<int:cart_item_id>', methods=['PUT'])
@verified_user_required
def update_cart_item(cart_item_id):
    user_id = int(get_jwt_identity())
    cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    data = request.get_json()
    
    if not data or 'quantity' not in data:
        return jsonify({'error': 'Quantity is required'}), 400
    
    if data['quantity'] <= 0:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart'}), 200
    
    if data['quantity'] > cart_item.product.stock:
        return jsonify({'error': 'Insufficient stock'}), 400
    
    cart_item.quantity = data['quantity']
    db.session.commit()
    
    return jsonify({'message': 'Cart updated successfully'}), 200


@cart_bp.route('/<int:cart_item_id>', methods=['DELETE'])
@verified_user_required
def remove_from_cart(cart_item_id):
    user_id = int(get_jwt_identity())
    cart_item = CartItem.query.filter_by(id=cart_item_id, user_id=user_id).first()
    
    if not cart_item:
        return jsonify({'error': 'Cart item not found'}), 404
    
    db.session.delete(cart_item)
    db.session.commit()
    
    return jsonify({'message': 'Item removed from cart'}), 200


@cart_bp.route('/clear', methods=['DELETE'])
@verified_user_required
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    
    return jsonify({'message': 'Cart cleared successfully'}), 200
