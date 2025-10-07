from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User
from services.email_service import send_otp_email, send_password_reset_email

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password are required'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(
        email=data['email'],
        full_name=data.get('full_name'),
        phone=data.get('phone')
    )
    user.set_password(data['password'])
    otp_code = user.generate_otp()
    
    db.session.add(user)
    db.session.commit()
    
    send_otp_email(current_app.extensions['mail'], current_app._get_current_object(), user.email, otp_code)
    
    return jsonify({
        'message': 'Registration successful. Please check your email for OTP verification.',
        'user_id': user.id
    }), 201


@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('otp'):
        return jsonify({'error': 'Email and OTP are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.verify_otp(data['otp']):
        db.session.commit()
        return jsonify({'message': 'Email verified successfully'}), 200
    else:
        return jsonify({'error': 'Invalid or expired OTP'}), 400


@auth_bp.route('/resend-otp', methods=['POST'])
def resend_otp():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    otp_code = user.generate_otp()
    db.session.commit()
    
    send_otp_email(current_app.extensions['mail'], current_app._get_current_object(), user.email, otp_code)
    
    return jsonify({'message': 'OTP resent successfully'}), 200


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        if not user.is_verified:
            return jsonify({'error': 'Please verify your email first'}), 403
        
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'is_admin': user.is_admin
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': f'Login failed: {str(e)}'}), 500


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'message': 'If email exists, password reset OTP has been sent'}), 200
    
    otp_code = user.generate_otp()
    db.session.commit()
    
    send_password_reset_email(current_app.extensions['mail'], current_app._get_current_object(), user.email, otp_code)
    
    return jsonify({'message': 'If email exists, password reset OTP has been sent'}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('otp') or not data.get('new_password'):
        return jsonify({'error': 'Email, OTP, and new password are required'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if user.verify_otp(data['otp']):
        user.set_password(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password reset successfully'}), 200
    else:
        return jsonify({'error': 'Invalid or expired OTP'}), 400


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'email': user.email,
        'full_name': user.full_name,
        'phone': user.phone,
        'is_admin': user.is_admin,
        'is_verified': user.is_verified,
        'created_at': user.created_at.isoformat()
    }), 200


@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    if data.get('full_name'):
        user.full_name = data['full_name']
    if data.get('phone'):
        user.phone = data['phone']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'phone': user.phone
        }
    }), 200


@auth_bp.route('/test-token', methods=['GET'])
@jwt_required()
def test_token():
    user_id = get_jwt_identity()
    return jsonify({
        'message': 'Token is valid',
        'user_id': user_id
    }), 200


@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
def delete_account():
    """Delete the authenticated user's account and all related data."""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'Account deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete account: {str(e)}'}), 500


## Address routes moved to routes/addresses_routes.py
