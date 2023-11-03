import math
import json

magnitude_threshold = 0.5

def send_accel():
    from ed import app, socketio
    from ed.utils.modules.MPU6050 import read_accel, read
    from ed.utils.modules.buzzer import activate_buzz, buzz_init, deactivate_buzz

    buzz_init()

    if not hasattr(app, 'read_acc_thread'):
        try:
            app.read_acc_thread = socketio.start_background_task(read)
        except Exception as e:
            print(f"Exception while starting thread: {e}")

    update_rate_ms = 400
    sleep_time = update_rate_ms * 0.001


    while True:
        readings = read_accel()

        magnitude = readings['mag']
        # check_alert(magnitude)

        #In the case of alerts
        if magnitude > magnitude_threshold:
            print("ALERT")
            socketio.emit('alert', {'magnitude': magnitude}, namespace='/datastream')
            activate_buzz()
        else:
            deactivate_buzz()

        #Send to backend
        socketio.emit('data', {
            'magnitude': magnitude,
            'ax': readings['ax'],
            'ay': readings['ay'],
            'az': readings['az'],
            'rate': update_rate_ms
        }, namespace='/datastream')

        socketio.sleep(sleep_time)

def get_vector_acc(x, y, z):
    return math.sqrt(x*x + y*y + z*z)


# This connection does not work for smore reason, todo: fix
def check_alert(magnitude):
    if magnitude > magnitude_threshold:
        print("ALERT")
        from ed import socketio
        socketio.emit('alert', {'magnitude': magnitude}, namespace='/datastream')


