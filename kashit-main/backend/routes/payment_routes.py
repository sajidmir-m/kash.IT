import os
from flask import Blueprint, current_app, jsonify, request
import razorpay


payment_bp = Blueprint('payment_bp', __name__)


def _get_razorpay_client() -> razorpay.Client:
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    key_secret = os.environ.get('RAZORPAY_KEY_SECRET')
    if not key_id or not key_secret:
        raise RuntimeError('Razorpay keys are not configured')
    return razorpay.Client(auth=(key_id, key_secret))


@payment_bp.route('/api/payments/key', methods=['GET'])
def get_public_key():
    key_id = os.environ.get('RAZORPAY_KEY_ID')
    if not key_id:
        return jsonify({"error": "Razorpay key not configured"}), 500
    return jsonify({"key": key_id}), 200


@payment_bp.route('/api/payments/create-order', methods=['POST'])
def create_order():
    try:
        body = request.get_json(silent=True) or {}
        amount_in_rupees = body.get('amount')  # expected rupees integer
        currency = (body.get('currency') or 'INR').upper()
        receipt = body.get('receipt') or 'order_rcpt_1'

        if not isinstance(amount_in_rupees, (int, float)) or amount_in_rupees <= 0:
            return jsonify({"error": "Invalid amount"}), 400

        amount_in_paise = int(round(float(amount_in_rupees) * 100))

        client = _get_razorpay_client()
        order = client.order.create({
            'amount': amount_in_paise,
            'currency': currency,
            'receipt': receipt,
            'payment_capture': 1
        })

        return jsonify({
            'order': order,
            'key': os.environ.get('RAZORPAY_KEY_ID')
        }), 200
    except Exception as exc:  # pylint: disable=broad-except
        current_app.logger.exception('Failed to create Razorpay order: %s', exc)
        return jsonify({"error": "Failed to create payment order"}), 500


