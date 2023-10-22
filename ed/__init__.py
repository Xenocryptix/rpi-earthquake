import os
from flask import Flask
from flask_socketio import SocketIO
from .utils import db, auth
from .utils.dash import generate_random_values


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    socketio = SocketIO(app)

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py', silent=True)
    else:
        app.config.from_mapping(test_config)

    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    db.init_app(app)
    app.register_blueprint(auth.bp)

    @socketio.on('connect', namespace='/datastream')
    def handle_connect():
        print("Client connected")
        if not hasattr(app, 'bg_thread'):
            app.bg_thread = socketio.start_background_task(generate_random_values, socketio)

    return app, socketio


app, socketio = create_app()


if __name__ == '__main__':
    socketio.run(app, debug=True)