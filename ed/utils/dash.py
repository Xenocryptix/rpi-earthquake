import math
import json
import requests

magnitude_threshold = 20 #changable via API

def change_mode(x):
    global magnitude_threshold
    magnitude_threshold = x

def send_accel():
    from ed import app, socketio
    from ed.utils.modules.MPU6050 import read_accel, read
    from ed.utils.modules.buzzer import activate_buzz, buzz_init, deactivate_buzz
    from ed.utils.modules.location import get_coords
    from ed.utils.modules.switch import switch_init, read_switch

    buzz_init()
    switch_init()
    url = "http://127.0.0.1:5000/alerts"

    if not hasattr(app, "read_acc_thread"):
        try:
            app.read_acc_thread = socketio.start_background_task(read)
        except Exception as e:
            print(f"Exception while starting thread: {e}")

    update_rate_ms = 400
    sleep_time = update_rate_ms * 0.001

    while True:
        readings = read_accel()
        magnitude = readings["mag"]

        # In the case of alerts
        if magnitude > magnitude_threshold and read_switch():
            print("ALERT")
            socketio.emit("alert", {"magnitude": magnitude}, namespace="/datastream")
            lat, lng = get_coords()
            alert_data = {"avg": magnitude, "max": magnitude, "lat": lat, "lng": lng}
            requests.post(url, json=alert_data)
            activate_buzz()
        else:
            deactivate_buzz()

        # Send to backend
        socketio.emit(
            "data",
            {
                "magnitude": magnitude,
                "ax": readings["ax"],
                "ay": readings["ay"],
                "az": readings["az"],
                "status": read_switch(),
                "rate": update_rate_ms,
            },
            namespace="/datastream",
        )

        socketio.sleep(sleep_time)


def get_vector_acc(x, y, z):
    return math.sqrt(x * x + y * y + z * z)


# This connection does not work for smore reason, todo: fix
def alert(magnitude):
    from ed import app, socketio

    print("ALERT")
    socketio.emit("alert", {"magnitude": magnitude}, namespace="/datastream")
