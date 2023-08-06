from MySQLdb import IntegrityError
import bcrypt
from flask import jsonify, request
from werkzeug import Response
from main import app, db
import base64
from models import User, Posting, Piece, Category, PostPiece
from datetime import date as dt
import jwt


# Users table CRUD
@app.route('/api/users/list', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = []

    for user in users:
        user_data = {
            'id': user.id,
            'name': user.name,
            'surname': user.surname,
            'username': user.username,
            'email': user.email,
            'password': user.password
        }
        user_list.append(user_data)

    return jsonify(user_list)

@app.route('/api/users/add', methods=['POST'])
def add_user():
    user_data = request.json

    name = user_data['name']
    surname = user_data['surname']
    username = user_data['username']
    email = user_data['email']
    password = user_data['password']

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'User with this username already exists'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    new_user = User(name=name, username=username, surname=surname, email=email, password=hashed_password)

    try:
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'user added'}), 200
    except Exception as e:
        return jsonify({'message': 'failed'}), 500

@app.route('/api/users/update/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user_data = request.json

    try:
        user = User.query.get(user_id)

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        if 'password' in user_data:
            hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt())
            user.password = hashed_password

        user.name = user_data.get('name', user.name)
        user.username = user_data.get('username', user.username)
        user.surname = user_data.get('surname', user.surname)
        user.email = user_data.get('email', user.email)

        db.session.commit()

        return jsonify({'message': 'User updated successfully'}), 200

    except Exception as e:
        return jsonify({'message': 'Error'})

@app.route('/api/users/delete/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):

    try:
        user = User.query.get(user_id)

        if user is None:
            return jsonify({'message': 'User not found'}), 404

        db.session.delete(user)
        db.session.commit()

        return jsonify({'message': 'user deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'error'}, 500)

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'message': 'Invalid username or password.'}), 401

    payload = {'id': user.id, 'username': user.username, 'name': user.name, 'surname': user.surname, 'email': user.email}
    token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'token': token})





# Posting table CRUD
@app.route('/api/posts', methods=['GET'])
def get_posts():
    posts = Posting.query.all()
    post_list = []

    for post in posts:
        post_data = {
            'id': post.id,
            'user_id': post.user_id,
            'date': post.date,
            'image_data': base64.b64encode(post.image_data).decode('utf-8')
        }
        post_list.append(post_data)

    return jsonify(post_list)


@app.route('/postings/<posting_id>/image', methods=['GET'])
def get_posting_image(posting_id):
    posting = Posting.query.get(posting_id)
    if posting is None:
        return jsonify({'message': 'Posting not found'}), 404

    # Return the image_data as a response with the appropriate content type
    return Response(posting.image_data, mimetype='image/jpeg')

@app.route('/users/<user_id>/postings', methods=['GET'])
def get_user_posting_images(user_id):
    # Assuming you have a User model with a user_id attribute and a Posting model with a user_id attribute

    # Check if the user exists
    user = User.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    # Retrieve all postings of the specific user
    postings = Posting.query.filter_by(user_id=user_id).all()

    # Check if the user has any postings
    if not postings:
        return jsonify({'message': 'No postings found for this user'}), 404

    # Return a list of posting data (you can modify this based on your requirements)

    images = []
    for posting in postings:
        image_data = base64.b64encode(posting.image_data).decode('utf-8')
        # If you stored image URLs instead of binary data, you can construct the URL here instead

        images.append(image_data)

    return jsonify({'images': images})




@app.route('/postings/images', methods=['GET'])
def get_all_posting_images():
    postings = Posting.query.all()

    images = []
    for posting in postings:
        image_data = base64.b64encode(posting.image_data).decode('utf-8')
        # If you stored image URLs instead of binary data, you can construct the URL here instead

        images.append(image_data)

    return jsonify({'images': images})



@app.route('/api/posts', methods=['POST'])
def upload_post():
    user_id = request.form.get('user_id')
    date = dt.today()
    image_data = request.files['image_data'].read()
    new_post = Posting(user_id=user_id, date=date, image_data=image_data)

    try:
        db.session.add(new_post)
        db.session.commit()

        # Get the post_id from the newly created post
        post_id = new_post.id

        return jsonify({'message': 'post uploaded', 'post_id': post_id}), 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({'message': 'failed'}), 500

@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post_data = request.json

    try:
        post = Posting.query.get(post_id)

        if post is None:
            return jsonify({'message': 'Post not found'}), 404
        
        post.user_id = post_data.get('user_id', post.user_id)
        post.date = post_data.get('date', post.date)

        db.session.commit()
        
        return jsonify({'message': 'Post updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error'})

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    try:
        post = Posting.query.get(post_id)

        if post is None:
            return jsonify({'message': 'Post not found'}), 404
        
        db.session.delete(post)
        db.session.commit()

        return jsonify({'message': 'post deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'error'}, 500)

# Piece table CRUD
@app.route('/api/pieces', methods=['GET'])
def get_all_pieces():
    pieces = Piece.query.all()
    post_list = []

    for piece in pieces:
        post_data = {
            'id': piece.id,
            'brand': piece.brand,
            'model': piece.model,
            'category_id': piece.category_id
        }
        post_list.append(post_data)

    return jsonify(post_list)

@app.route('/api/pieces', methods=['POST'])
@app.route('/api/pieces', methods=['POST'])
def add_piece():
    pieces_data = request.json  # Assuming the request contains a list of pieces

    try:
        piece_ids = []
        for piece_data in pieces_data:
            brand = piece_data['brand']
            model = piece_data['model']
            category_id = piece_data['category_id']

            new_piece = Piece(brand=brand, model=model, category_id=category_id)
            db.session.add(new_piece)
            db.session.commit()

            piece_ids.append(new_piece.id)  # Store the piece ID for later use

        return jsonify({'piece_ids': piece_ids}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to add pieces'}), 500


@app.route('/api/pieces/<int:id>', methods=['PUT'])
def update_piece(id):
    piece_data = request.json

    try:
        piece = Piece.query.get(id)
        if piece is None:
            return jsonify({'message': 'Piece not found'}), 404
        
        piece.id = piece_data.get('id', piece.id)
        piece.brand = piece_data.get('brand', piece.brand)
        piece.model = piece_data.get('model', piece.model)
        piece.category_id = piece_data.get('category_id', piece.category_id)

        db.session.commit()
        return jsonify({'message': 'Piece update successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error'})

@app.route('/api/pieces/<int:piece_id>', methods=['DELETE'])
def delete_piece(piece_id):
    try:
        piece = Posting.query.get(piece_id)

        if piece is None:
            return jsonify({'message': 'Piece not found'}), 404
        
        db.session.delete(piece)
        db.session.commit()

        return jsonify({'message': 'piece deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'error'}, 500)

# Category table CRUD
@app.route('/api/categories', methods=['GET'])
def get_all_categories():
    categories = Category.query.all()
    category_list = []

    for category in categories:
        category_data = {
            'id': category.id,
            'name': category.name
        }
        category_list.append(category_data)
        return jsonify(category_list)

@app.route('/api/categories', methods=['POST'])
def add_category():
    category_data = request.json

    name = category_data['name']
    new_category = Category(name)
    
    try:
        db.session.add(new_category)
        db.session.commit()

        return jsonify({'message': 'category added'}), 200
    except Exception as e:
        return jsonify({'message': 'failed'}), 500

@app.route('/api/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    category_data = request.json

    try:
        category = Category.query.get(category_id)
        
        if category is None:
            return jsonify({'message': 'Category not found'}), 404
        
        category.name = category_data.get('name', category.name)

        db.session.commit()
        return jsonify({'message': 'Category update succesfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error'})

@app.route('/api/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    try:
        category = Category.query.get(category_id)

        if category is None:
            return jsonify({'message': 'Category not found'}), 404

        db.session.delete(category)
        db.session.commit()

        return jsonify({'message': 'Category deleted'}), 200
    except IntegrityError:
        db.session.rollback()  # Rollback the session to cancel the deletion operation
        return jsonify({'message': 'Cannot delete the category due to existing references'}), 500
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# post_piece table CRUD
@app.route('/api/post_pieces', methods=['GET'])
def get_all_post_pieces():
    post_pieces = PostPiece.query.all()
    post_piece_list = []

    for post_piece in post_pieces:
        post_piece_data = {
            'post_id': post_piece.post_id,
            'piece_id': post_piece.piece_id
        }
        post_piece_list.append(post_piece_data)

    return jsonify(post_piece_list)

from flask import request, jsonify
from datetime import datetime as dt

@app.route('/api/post_pieces', methods=['POST'])
def add_post_piece():
    try:
        post_piece_data = request.json

        # Make sure the request data is a list of dictionaries
        if not isinstance(post_piece_data, list):
            return jsonify({'message': 'Invalid data format. Expected a list of dictionaries.'}), 400

        # Collect all the post_id and piece_id pairs
        post_pieces = []
        for item in post_piece_data:
            post_id = item.get('post_id')
            piece_id = item.get('piece_id')

            if post_id is not None and piece_id is not None:
                new_post_piece = PostPiece(post_id=post_id, piece_id=piece_id)
                db.session.add(new_post_piece)
                post_pieces.append({'post_id': post_id, 'piece_id': piece_id})

        db.session.commit()  # Try committing here, outside of the loop
        print("post_pieces:", post_pieces)  # Add this logging statement

        return jsonify({'message': 'Post Pieces added successfully'}), 200
    except Exception as e:
        db.session.rollback()
        print("Error:", str(e))  # Add this logging statement
        return jsonify({'message': 'Failed to add Post Pieces'}), 500












@app.route('/api/post_pieces/<int:id>', methods=['PUT'])
def update_post_piece(id):
    post_piece_data = request.json

    try:
        post_piece = PostPiece.query.get(id)
        if post_piece is None:
            return jsonify({'message': 'Post Piece not found'}), 404
        
        post_piece.post_id = post_piece_data.get('post_id', post_piece.post_id)
        post_piece.piece_id = post_piece_data.get('piece_id', post_piece.piece_id)

        db.session.commit()
        return jsonify({'message': 'Post Piece updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error'}), 500

@app.route('/api/post_pieces/<int:id>', methods=['DELETE'])
def delete_post_piece(id):
    try:
        post_piece = PostPiece.query.get(id)
        if post_piece is None:
            return jsonify({'message': 'Post Piece not found'}), 404

        db.session.delete(post_piece)
        db.session.commit()

        return jsonify({'message': 'Post Piece deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': 'Error'}), 500

# post_piece table
@app.route('/api/posts/<int:post_id>/pieces', methods=['GET'])
def get_pieces_by_post_id(post_id):
    print(f'Received post_id: {post_id}')
    pieces = Piece.query.join(PostPiece).filter(PostPiece.post_id == post_id).all()
    pieces_list = [{
        'id': piece.id,
        'brand': piece.brand,
        'model': piece.model,
        'category_id': piece.category_id
    } for piece in pieces]

    print(f'Pieces found: {pieces_list}')

    return jsonify(pieces_list)
