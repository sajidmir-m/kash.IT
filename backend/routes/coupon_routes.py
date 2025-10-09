from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Coupon
from services.auth_decorator import admin_required
from datetime import datetime

coupon_bp = Blueprint('coupons', __name__, url_prefix='/api/coupons')


@coupon_bp.route('/validate', methods=['POST'])
@jwt_required()
def validate_coupon():
    data = request.get_json()
    
    if not data or not data.get('code'):
        return jsonify({'error': 'Coupon code is required'}), 400
    
    coupon = Coupon.query.filter_by(code=data['code'], is_active=True).first()
    
    if not coupon:
        return jsonify({'error': 'Invalid coupon code'}), 404
    
    if coupon.valid_until and coupon.valid_until < datetime.utcnow():
        return jsonify({'error': 'Coupon has expired'}), 400
    
    if coupon.usage_limit and coupon.usage_count >= coupon.usage_limit:
        return jsonify({'error': 'Coupon usage limit reached'}), 400
    
    cart_total = data.get('cart_total', 0)
    
    if cart_total < coupon.min_purchase_amount:
        return jsonify({
            'error': f'Minimum purchase amount of {coupon.min_purchase_amount} required'
        }), 400
    
    discount_amount = 0
    
    if coupon.discount_type == 'percentage':
        discount_amount = (cart_total * coupon.discount_value) / 100
        if coupon.max_discount_amount:
            discount_amount = min(discount_amount, coupon.max_discount_amount)
    else:
        discount_amount = coupon.discount_value
    
    return jsonify({
        'valid': True,
        'code': coupon.code,
        'description': coupon.description,
        'discount_type': coupon.discount_type,
        'discount_value': coupon.discount_value,
        'discount_amount': discount_amount,
        'final_amount': cart_total - discount_amount
    }), 200


@coupon_bp.route('/', methods=['GET'])
@admin_required
def get_coupons():
    coupons = Coupon.query.order_by(Coupon.created_at.desc()).all()
    
    return jsonify({
        'coupons': [{
            'id': coupon.id,
            'code': coupon.code,
            'description': coupon.description,
            'discount_type': coupon.discount_type,
            'discount_value': coupon.discount_value,
            'min_purchase_amount': coupon.min_purchase_amount,
            'max_discount_amount': coupon.max_discount_amount,
            'usage_limit': coupon.usage_limit,
            'usage_count': coupon.usage_count,
            'is_active': coupon.is_active,
            'valid_from': coupon.valid_from.isoformat(),
            'valid_until': coupon.valid_until.isoformat() if coupon.valid_until else None
        } for coupon in coupons]
    }), 200


@coupon_bp.route('/', methods=['POST'])
@admin_required
def create_coupon():
    data = request.get_json()
    
    if not data or not data.get('code') or not data.get('discount_value'):
        return jsonify({'error': 'Code and discount value are required'}), 400
    
    if Coupon.query.filter_by(code=data['code']).first():
        return jsonify({'error': 'Coupon code already exists'}), 400
    
    valid_until = None
    if data.get('valid_until'):
        try:
            valid_until = datetime.fromisoformat(data['valid_until'])
        except ValueError:
            return jsonify({'error': 'Invalid date format for valid_until'}), 400
    
    coupon = Coupon(
        code=data['code'],
        description=data.get('description'),
        discount_type=data.get('discount_type', 'percentage'),
        discount_value=data['discount_value'],
        min_purchase_amount=data.get('min_purchase_amount', 0),
        max_discount_amount=data.get('max_discount_amount'),
        usage_limit=data.get('usage_limit'),
        valid_until=valid_until
    )
    
    db.session.add(coupon)
    db.session.commit()
    
    return jsonify({
        'message': 'Coupon created successfully',
        'coupon_id': coupon.id
    }), 201


@coupon_bp.route('/<int:coupon_id>', methods=['PUT'])
@admin_required
def update_coupon(coupon_id):
    coupon = Coupon.query.get(coupon_id)
    
    if not coupon:
        return jsonify({'error': 'Coupon not found'}), 404
    
    data = request.get_json()
    
    if data.get('description'):
        coupon.description = data['description']
    if 'discount_value' in data:
        coupon.discount_value = data['discount_value']
    if 'min_purchase_amount' in data:
        coupon.min_purchase_amount = data['min_purchase_amount']
    if 'max_discount_amount' in data:
        coupon.max_discount_amount = data['max_discount_amount']
    if 'usage_limit' in data:
        coupon.usage_limit = data['usage_limit']
    if 'is_active' in data:
        coupon.is_active = data['is_active']
    if data.get('valid_until'):
        try:
            coupon.valid_until = datetime.fromisoformat(data['valid_until'])
        except ValueError:
            return jsonify({'error': 'Invalid date format for valid_until'}), 400
    
    db.session.commit()
    
    return jsonify({'message': 'Coupon updated successfully'}), 200


@coupon_bp.route('/<int:coupon_id>', methods=['DELETE'])
@admin_required
def delete_coupon(coupon_id):
    coupon = Coupon.query.get(coupon_id)
    
    if not coupon:
        return jsonify({'error': 'Coupon not found'}), 404
    
    coupon.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Coupon deactivated successfully'}), 200
