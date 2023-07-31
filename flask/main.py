from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS



app = Flask(__name__)
app.config['SECRET_KEY'] = 'abc123.'
CORS(app, origins='http://localhost:4200')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost:3386/ornatum'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# jwt = JWTManager(app)

db = SQLAlchemy(app)

from routes import *

if __name__ == "__main__":
    app.run(port=8000, debug=True)
