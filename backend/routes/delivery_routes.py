from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Order, OrderItem, DeliveryPartner
from flask import current_app
from flask_mail import Mail
from services.email_service import send_delivery_partner_review_email
from datetime import datetime

delivery_bp = Blueprint('delivery', __name__, url_prefix='/api/delivery')


@delivery_bp.route('/register', methods=['POST'])
def register_delivery_partner():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name', '')
    phone = data.get('phone', '')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(email=email, full_name=full_name, phone=phone, is_verified=True)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    partner = DeliveryPartner(user_id=user.id, full_name=full_name, phone=phone, is_verified=False)
    db.session.add(partner)
    db.session.commit()

    # notify admin for verification (configure real admin email in env/config)
    try:
        admin_email = current_app.config.get('ADMIN_EMAIL') or 'admin@kashit.com'
        mail = current_app.extensions.get('mail') or Mail(current_app)
        send_delivery_partner_review_email(mail, current_app._get_current_object(), admin_email, email, full_name, phone)
    except Exception as _:
        pass

    return jsonify({'message': 'Registered successfully. Awaiting verification by admin.'}), 201


@delivery_bp.route('/login', methods=['POST'])
def login_delivery_partner():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'error': 'Invalid credentials'}), 401
    partner = DeliveryPartner.query.filter_by(user_id=user.id).first()
    if not partner:
        return jsonify({'error': 'Delivery partner account not found'}), 404
    if not partner.is_verified or not partner.is_active:
        return jsonify({'error': 'Account not verified or inactive'}), 403
    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token, 'partner': {'id': partner.id, 'full_name': partner.full_name, 'phone': partner.phone}}), 200


@delivery_bp.route('/profile', methods=['GET'])
@jwt_required()
def delivery_profile():
    user_id = int(get_jwt_identity())
    partner = DeliveryPartner.query.filter_by(user_id=user_id).first()
    if not partner:
        return jsonify({'error': 'Delivery partner not found'}), 404
    return jsonify({
        'partner': {
            'id': partner.id,
            'full_name': partner.full_name,
            'phone': partner.phone,
            'is_verified': partner.is_verified,
            'is_active': partner.is_active
        }
    }), 200


@delivery_bp.route('/orders', methods=['GET'])
@jwt_required()
def list_assignments():
    user_id = int(get_jwt_identity())
    partner = DeliveryPartner.query.filter_by(user_id=user_id).first()
    if not partner:
        return jsonify({'error': 'Delivery partner not found'}), 404

    status = request.args.get('status', '')
    query = Order.query
    # Available orders: not assigned and status Shipped (ready to go)
    if status == 'available':
        query = query.filter(Order.delivery_partner_id.is_(None), Order.status.in_(['Shipped', 'Confirmed']))
    else:
        # Assigned to this partner
        query = query.filter(Order.delivery_partner_id == partner.id)

    orders = query.order_by(Order.created_at.desc()).limit(100).all()
    result = []
    for o in orders:
        result.append({
            'id': o.id,
            'customer_name': o.user.full_name,
            'customer_phone': o.user.phone,
            'address': {
                'line1': o.address.address_line1 if o.address else None,
                'line2': o.address.address_line2 if o.address else None,
                'city': o.address.city if o.address else None,
                'state': o.address.state if o.address else None,
                'postal_code': o.address.postal_code if o.address else None
            },
            'status': o.status,
            'delivery_status': o.delivery_status,
            'created_at': o.created_at.isoformat(),
            'items': [{
                'name': it.product.name if it.product else 'Product',
                'qty': it.quantity
            } for it in o.items]
        })
    return jsonify({'orders': result}), 200


@delivery_bp.route('/orders/<int:order_id>/accept', methods=['PUT'])
@jwt_required()
def accept_assignment(order_id):
    user_id = int(get_jwt_identity())
    partner = DeliveryPartner.query.filter_by(user_id=user_id).first()
    if not partner:
        return jsonify({'error': 'Delivery partner not found'}), 404
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    if order.delivery_partner_id and order.delivery_partner_id != partner.id:
        return jsonify({'error': 'Order already assigned'}), 400

    order.delivery_partner_id = partner.id
    order.delivery_status = 'Out for Delivery'
    order.status = 'Shipped'  # reflect movement
    db.session.commit()
    return jsonify({'message': 'Order accepted', 'delivery_status': order.delivery_status}), 200


@delivery_bp.route('/orders/<int:order_id>/complete', methods=['PUT'])
@jwt_required()
def complete_delivery(order_id):
    user_id = int(get_jwt_identity())
    partner = DeliveryPartner.query.filter_by(user_id=user_id).first()
    if not partner:
        return jsonify({'error': 'Delivery partner not found'}), 404
    order = Order.query.get(order_id)
    if not order or order.delivery_partner_id != partner.id:
        return jsonify({'error': 'Order not found or not assigned to you'}), 404

    order.delivery_status = 'Delivered'
    order.status = 'Delivered'
    db.session.commit()
    return jsonify({'message': 'Delivery completed'}), 200


