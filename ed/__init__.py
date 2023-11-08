import os
from flask import Flask
from flask_socketio import SocketIO
from ed.utils import db, auth


def create_app(test_config=None):
    # Create the Flask instance
    _app = Flask(__name__, instance_relative_config=True)
    _socketio = SocketIO(_app)

    # Default configuration the app will use
    _app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(_app.instance_path, 'ed.sqlite'),
    )

    if test_config is not None:
        # Load the test config if passed in
        _app.config.update(test_config)

    # Ensure the instance folder exists
    try:
        os.makedirs(_app.instance_path)
    except OSError:
        pass

    # Initialize database
    db.init_app(_app)

    # Register blueprints
    _app.register_blueprint(auth.bp)

    # SocketIO event handlers
    @_socketio.on('connect', namespace='/datastream')
    def handle_connect():
        from ed.utils.dash import send_accel
        # from ed.utils.dash import generate_random_values

        if not hasattr(_app, 'dash_thread'):
            try:
                _app.dash_thread = _socketio.start_background_task(send_accel)
            except Exception as e:
                _app.logger.error(f"Exception while starting thread: {e}")

    # Return the Flask application instance
    return _app, _socketio


app, socketio = create_app()
