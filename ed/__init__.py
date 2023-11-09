import os
from flask import Flask
from flask_socketio import SocketIO
from ed.utils import db, auth

app = Flask(__name__, instance_relative_config=True)
socketio = SocketIO(app)

app.config.from_mapping(
    SECRET_KEY="dev",
    DATABASE=os.path.join(app.instance_path, "ed.sqlite"),
)

try:
    os.makedirs(app.instance_path)
except OSError:
    pass

db.init_app(app)
app.register_blueprint(auth.bp)


@socketio.on("connect", namespace="/datastream")
def handle_connect():
    from ed.utils.dash import send_accel

    # from ed.utils.dash import generate_random_values

    if not hasattr(app, "dash_thread"):
        print("Starting background task - read")
        try:
            app.dash_thread = socketio.start_background_task(send_accel)
            print("Background task - read - started")
        except Exception as e:
            print(f"Exception while starting thread: {e}")

    # if not hasattr(app, 'bg_thread'):
    #     print("Starting send_accel")
    #     app.bg_thread = socketio.start_background_task(send_accel)
    #     print("send_accel started")
