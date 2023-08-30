import bcrypt
from main import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    surname = db.Column(db.String(60))
    username = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(80), unique=True)
    password = db.Column(db.LargeBinary)  # Change column type to LargeBinary

    def __init__(self, id, name, surname, username, email, password):
        self.name = name
        self.surname = surname
        self.username = username
        self.email = email
        self.password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password)


class Posting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer)
    date = db.Column(db.Date)
    image_data = db.Column(db.LargeBinary)

    def __init__(self, user_id, date, image_data):
        self.user_id = user_id
        self.date = date
        self.image_data = image_data

class Piece(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100))
    model = db.Column(db.String(100))

    def __init__(self, brand, model):
        self.brand = brand
        self.model = model

class PostPiece(db.Model):
    post_id = db.Column(db.Integer, db.ForeignKey('posting.id'), primary_key=True)
    piece_id = db.Column(db.Integer, db.ForeignKey('piece.id'), primary_key=True)

    def __init__(self, post_id, piece_id):
        self.post_id = post_id
        self.piece_id = piece_id