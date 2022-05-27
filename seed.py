from models import Favorite, User, Query
from app import db

db.drop_all()
db.create_all()

mom = User.register(username='WorriedMom223', password='password', first_name='Karen')
son = User.register(username='ChillSon334', password='password', first_name='Scott')
dad = User.register(username='RetroCopDad', password='password', first_name='James')
hack = User.register(username='HackerNerdGuy', password='password', first_name='Zane')
guy = User.register(username='CuriosityKilledtheCat', password='password', first_name='Gabriel')

db.session.add_all([mom, son, dad, hack, guy])
db.session.commit()