from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models import db, Product, Category
from services.auth_decorator import admin_required

product_bp = Blueprint('products', __name__, url_prefix='/api/products')
category_bp = Blueprint('categories', __name__, url_prefix='/api/categories')


@category_bp.route('/', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(is_active=True).all()
    
    return jsonify({
        'categories': [{
            'id': cat.id,
            'name': cat.name,
            'description': cat.description,
            'image_url': cat.image_url
        } for cat in categories]
    }), 200


@category_bp.route('/', methods=['POST'])
@admin_required
def create_category():
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    if Category.query.filter_by(name=data['name']).first():
        return jsonify({'error': 'Category already exists'}), 400
    
    category = Category(
        name=data['name'],
        description=data.get('description'),
        image_url=data.get('image_url')
    )
    
    db.session.add(category)
    db.session.commit()
    
    return jsonify({
        'message': 'Category created successfully',
        'category_id': category.id
    }), 201


@category_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    data = request.get_json()
    
    if data.get('name'):
        category.name = data['name']
    if data.get('description'):
        category.description = data['description']
    if data.get('image_url'):
        category.image_url = data['image_url']
    if 'is_active' in data:
        category.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Category updated successfully'}), 200


@category_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    category.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Category deleted successfully'}), 200


@product_bp.route('/', methods=['GET'])
def get_products():
    category_id = request.args.get('category_id', type=int)
    search = request.args.get('search', '')
    sort_by = request.args.get('sort_by', 'name')
    order = request.args.get('order', 'asc')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    # Include both admin products and approved vendor products
    query = Product.query.filter(
        Product.is_active == True,
        Product.is_approved == True
    )
    
    if category_id:
        query = query.filter_by(category_id=category_id)
    
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    if sort_by == 'price':
        if order == 'desc':
            query = query.order_by(Product.price.desc())
        else:
            query = query.order_by(Product.price.asc())
    else:
        if order == 'desc':
            query = query.order_by(Product.name.desc())
        else:
            query = query.order_by(Product.name.asc())
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    return jsonify({
        'products': [{
            'id': prod.id,
            'name': prod.name,
            'description': prod.description,
            'price': prod.price,
            'stock': prod.stock,
            'unit': prod.unit,
            'image_url': prod.image_url,
            'category_id': prod.category_id,
            'category_name': prod.category.name
        } for prod in pagination.items],
        'total': pagination.total,
        'page': page,
        'per_page': per_page,
        'pages': pagination.pages
    }), 200


@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    
    if not product or not product.is_active:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify({
        'id': product.id,
        'name': product.name,
        'description': product.description,
        'price': product.price,
        'stock': product.stock,
        'unit': product.unit,
        'image_url': product.image_url,
        'category_id': product.category_id,
        'category_name': product.category.name
    }), 200


@product_bp.route('/', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('price') or not data.get('category_id'):
        return jsonify({'error': 'Name, price, and category are required'}), 400
    
    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    product = Product(
        category_id=data['category_id'],
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        stock=data.get('stock', 0),
        unit=data.get('unit'),
        image_url=data.get('image_url')
    )
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product created successfully',
        'product_id': product.id
    }), 201


@product_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    data = request.get_json()
    
    if data.get('name'):
        product.name = data['name']
    if data.get('description'):
        product.description = data['description']
    if data.get('price'):
        product.price = data['price']
    if 'stock' in data:
        product.stock = data['stock']
    if data.get('unit'):
        product.unit = data['unit']
    if data.get('image_url'):
        product.image_url = data['image_url']
    if data.get('category_id'):
        category = Category.query.get(data['category_id'])
        if category:
            product.category_id = data['category_id']
    if 'is_active' in data:
        product.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({'message': 'Product updated successfully'}), 200


@product_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'error': 'Product not found'}), 404
    
    product.is_active = False
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200
