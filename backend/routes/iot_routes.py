from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, IoTDevice, SensorData
from services.auth_decorator import verified_user_required
from datetime import datetime

iot_bp = Blueprint('iot', __name__, url_prefix='/api/iot')


@iot_bp.route('/devices', methods=['GET'])
@jwt_required()
def get_devices():
    user_id = int(get_jwt_identity())
    devices = IoTDevice.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'devices': [{
            'id': device.id,
            'device_name': device.device_name,
            'device_type': device.device_type,
            'device_id': device.device_id,
            'is_active': device.is_active,
            'last_active': device.last_active.isoformat() if device.last_active else None,
            'created_at': device.created_at.isoformat()
        } for device in devices]
    }), 200


@iot_bp.route('/devices', methods=['POST'])
@verified_user_required
def register_device():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    
    if not data or not data.get('device_name') or not data.get('device_id'):
        return jsonify({'error': 'Device name and device ID are required'}), 400
    
    if IoTDevice.query.filter_by(device_id=data['device_id']).first():
        return jsonify({'error': 'Device ID already registered'}), 400
    
    device = IoTDevice(
        user_id=user_id,
        device_name=data['device_name'],
        device_type=data.get('device_type'),
        device_id=data['device_id'],
        last_active=datetime.utcnow()
    )
    
    db.session.add(device)
    db.session.commit()
    
    return jsonify({
        'message': 'Device registered successfully',
        'device_id': device.id
    }), 201


@iot_bp.route('/devices/<int:device_id>', methods=['PUT'])
@verified_user_required
def update_device(device_id):
    user_id = int(get_jwt_identity())
    device = IoTDevice.query.filter_by(id=device_id, user_id=user_id).first()
    
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    data = request.get_json()
    
    if data.get('device_name'):
        device.device_name = data['device_name']
    if data.get('device_type'):
        device.device_type = data['device_type']
    if 'is_active' in data:
        device.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Device updated successfully'}), 200


@iot_bp.route('/devices/<int:device_id>', methods=['DELETE'])
@verified_user_required
def delete_device(device_id):
    user_id = get_jwt_identity()
    device = IoTDevice.query.filter_by(id=device_id, user_id=user_id).first()
    
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    db.session.delete(device)
    db.session.commit()
    
    return jsonify({'message': 'Device deleted successfully'}), 200


@iot_bp.route('/sensor-data', methods=['POST'])
def receive_sensor_data():
    data = request.get_json()
    
    if not data or not data.get('device_id') or not data.get('sensor_type') or 'value' not in data:
        return jsonify({'error': 'Device ID, sensor type, and value are required'}), 400
    
    device = IoTDevice.query.filter_by(device_id=data['device_id'], is_active=True).first()
    
    if not device:
        return jsonify({'error': 'Device not found or inactive'}), 404
    
    sensor_data = SensorData(
        device_id=device.id,
        sensor_type=data['sensor_type'],
        value=float(data['value']),
        unit=data.get('unit')
    )
    
    device.last_active = datetime.utcnow()
    
    db.session.add(sensor_data)
    db.session.commit()
    
    return jsonify({
        'message': 'Sensor data received successfully',
        'data_id': sensor_data.id
    }), 201


@iot_bp.route('/sensor-data/<int:device_id>', methods=['GET'])
@jwt_required()
def get_sensor_data(device_id):
    user_id = get_jwt_identity()
    device = IoTDevice.query.filter_by(id=device_id, user_id=user_id).first()
    
    if not device:
        return jsonify({'error': 'Device not found'}), 404
    
    limit = request.args.get('limit', 100, type=int)
    sensor_type = request.args.get('sensor_type')
    
    query = SensorData.query.filter_by(device_id=device.id)
    
    if sensor_type:
        query = query.filter_by(sensor_type=sensor_type)
    
    data = query.order_by(SensorData.timestamp.desc()).limit(limit).all()
    
    return jsonify({
        'device_name': device.device_name,
        'sensor_data': [{
            'id': d.id,
            'sensor_type': d.sensor_type,
            'value': d.value,
            'unit': d.unit,
            'timestamp': d.timestamp.isoformat()
        } for d in data]
    }), 200
