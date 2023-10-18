import os

from flask import Flask

# Creates and initializes the app
def create_app():
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'ed.sqlite'),
    )

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Import and initialize the database utility from the 'utils' module
    from .utils import db
    db.init_app(app)

    # Import and register the 'auth' blueprint from the 'utils' module
    from .utils import auth
    app.register_blueprint(auth.bp)

    return app

