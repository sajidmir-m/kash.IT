import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_migrate import Migrate
from config import Config
from models import db  # your models file

def create_app():
    app = Flask(__name__)
    app.config['DEBUG'] = True
    app.config.from_object(Config)

    # --------- CORS ---------
    CORS(
        app,
        resources={r"/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://192.168.68.113:5173",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
                "https://kashit.vercel.app",
                "https://kashit-frontend.vercel.app"
            ]
        }},
        supports_credentials=True
    )

    # --------- Extensions ---------
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    Mail(app)

    # --------- Error handlers ---------
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    # --------- Blueprints ---------
    from routes.auth_routes import auth_bp
    from routes.addresses_routes import addresses_bp
    from routes.product_routes import product_bp, category_bp
    from routes.cart_routes import cart_bp
    from routes.order_routes import order_bp
    from routes.coupon_routes import coupon_bp
    from routes.iot_routes import iot_bp
    from routes.payment_routes import payment_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(addresses_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(category_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(order_bp)
    app.register_blueprint(coupon_bp)
    app.register_blueprint(iot_bp)
    app.register_blueprint(payment_bp)

    # --------- Basic routes ---------
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to Kash.it API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'products': '/api/products',
                'categories': '/api/categories',
                'cart': '/api/cart',
                'orders': '/api/orders',
                'coupons': '/api/coupons',
                'iot': '/api/iot'
            }
        }), 200

    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'}), 200

    # --------- Auto-create SQLite DB if missing ---------
    with app.app_context():
        uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
        if uri.startswith('sqlite:///'):
            rel_path = uri.replace('sqlite:///', '')
            basedir = os.path.abspath(os.path.dirname(__file__))
            abs_path = rel_path if os.path.isabs(rel_path) else os.path.join(basedir, rel_path)
            os.makedirs(os.path.dirname(abs_path), exist_ok=True)
            if not os.path.exists(abs_path):
                db.create_all()

    return app

# --------- Run server ---------
if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
