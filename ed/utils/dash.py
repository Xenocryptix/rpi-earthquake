import math


magnitude_threshold = 0.3

def send_accel():
    from ed import app, socketio
    from ed.utils.modules.MPU6050 import read_accel, read
    from ed.utils.modules.LCD import write_str

    if not hasattr(app, 'read_acc_thread'):
        try:
            app.read_acc_thread = socketio.start_background_task(read)
        except Exception as e:
            print(f"Exception while starting thread: {e}")

    update_rate_ms = 400
    sleep_time = update_rate_ms * 0.001

    while True:
        readings = read_accel()

        magnitude = get_vector_acc(readings['ax'], readings['ay'], readings['az'] - 0.98)
        # check_alert(magnitude)

        write_str(0, 0, f"ax:{readings['ax']:.2f}")
        write_str(1, 0, f"ay:{readings['ay']:.2f}")
        write_str(2, 0, f"az:{readings['az']:.2f}")
        write_str(3, 0, f"mag:{magnitude:.2f}")

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


