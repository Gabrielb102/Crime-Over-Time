from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

def connect_db(app):
    """Connect to database."""

    db.app = app
    db.init_app(app)

class Favorite(db.Model) :
    """A favorite marking made by a user to a certain query."""

    __tablename__="favorites"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String, db.ForeignKey('users.username'))
    query_id = db.Column(db.Integer, db.ForeignKey('queries.id'))

    def __repr__(self) :
        f = self
        return f"Favorite {f.id}: {f.username} : {f.query_id}"


class User(db.Model) :
    """User account"""

    __tablename__="users"

    username = db.Column(db.String, primary_key=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=False)
    last_query = db.Column(db.Integer, db.ForeignKey('queries.id'), nullable=True)
    
    favorite_queries = db.relationship("Query",
        secondary="favorites",
        backref="users"
    )


    def __repr__(self) :
        c = self
        return f"User '{u.username}, Name: {u.first_name}"

    def register(self, username, password, first_name):
        encrypted = bcrypt.hashpw(password, bcrypt.gensalt())
        new_user = User(
            username = username,
            password = encrypted,
            first_name = first_name)

        db.session.add(new_user)
        db.session.commit()
        
        return new_user

class Query(db.Model) :
    """Query made by users in the past"""

    __tablename__="queries"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    lat = db.Column(db.String, nullable=False)
    lon = db.Column(db.String, nullable=False)
    distance = db.Column(db.String, nullable=False)
    datetime_ini = db.Column(db.DateTime, nullable=False)
    datetime_end = db.Column(db.DateTime, nullable=False)
    page = db.Column(db.Integer, default=1)

    def __repr__(self) :
        q = self
        return f"Query {q.id}, {distance} around {lon}, {lat}, from {datetime_ini} to {datetime_end}"

