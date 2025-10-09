from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db

addresses_bp = Blueprint('addresses', __name__, url_prefix='/api/addresses')


@addresses_bp.route('/', methods=['POST'])
@jwt_required()
def create_address():
    from models import Address

    try:
        user_id = int(get_jwt_identity())
        data = request.get_json() or {}

        required = ['address_line1', 'city', 'state', 'postal_code']
        if any(not data.get(field) for field in required):
            return jsonify({'error': 'Required address fields are missing'}), 400

        address = Address(
            user_id=user_id,
            address_line1=data['address_line1'],
            address_line2=data.get('address_line2'),
            city=data['city'],
            state=data['state'],
            postal_code=data['postal_code'],
            country=data.get('country', 'India'),
            is_default=bool(data.get('is_default', False))
        )

        if address.is_default:
            # unset previous defaults
            Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})

        db.session.add(address)
        db.session.commit()

        return jsonify({'message': 'Address added successfully', 'address_id': address.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to save address: {str(e)}'}), 500


@addresses_bp.route('/', methods=['GET'])
@jwt_required()
def list_addresses():
    from models import Address

    user_id = int(get_jwt_identity())
    addresses = Address.query.filter_by(user_id=user_id).all()

    return jsonify({
        'addresses': [{
            'id': a.id,
            'address_line1': a.address_line1,
            'address_line2': a.address_line2,
            'city': a.city,
            'state': a.state,
            'postal_code': a.postal_code,
            'country': a.country,
            'is_default': a.is_default
        } for a in addresses]
    }), 200


@addresses_bp.route('/<int:address_id>', methods=['PUT'])
@jwt_required()
def update_address(address_id: int):
    from models import Address

    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({'error': 'Address not found'}), 404

    required = ['address_line1', 'city', 'state', 'postal_code']
    if any(not data.get(field) for field in required):
        return jsonify({'error': 'Required address fields are missing'}), 400

    address.address_line1 = data['address_line1']
    address.address_line2 = data.get('address_line2')
    address.city = data['city']
    address.state = data['state']
    address.postal_code = data['postal_code']
    address.country = data.get('country', 'India')

    db.session.commit()

    return jsonify({'message': 'Address updated successfully', 'address_id': address.id}), 200


@addresses_bp.route('/<int:address_id>', methods=['DELETE'])
@jwt_required()
def delete_address(address_id: int):
    from models import Address

    user_id = int(get_jwt_identity())
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({'error': 'Address not found'}), 404

    db.session.delete(address)
    db.session.commit()

    return jsonify({'message': 'Address deleted successfully'}), 200


@addresses_bp.route('/<int:address_id>/default', methods=['PATCH'])
@jwt_required()
def set_default_address(address_id: int):
    from models import Address

    user_id = int(get_jwt_identity())
    address = Address.query.filter_by(id=address_id, user_id=user_id).first()
    if not address:
        return jsonify({'error': 'Address not found'}), 404

    Address.query.filter_by(user_id=user_id, is_default=True).update({'is_default': False})
    address.is_default = True
    db.session.commit()

    return jsonify({'message': 'Default address updated successfully'}), 200


