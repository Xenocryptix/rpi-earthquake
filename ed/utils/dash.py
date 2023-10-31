import math
import random


def generate_random_values(socketio):
    update_rate_ms = 400
    sleep_time = update_rate_ms * 0.001
    while True:
        ax = random.uniform(-1.0, 1)
        ay = random.uniform(-1.0, 1)
        az = random.uniform(-1.0, 1)

        magnitude = math.sqrt(math.pow(ax, 2) + math.pow(ay, 2) + math.pow(az, 2))

        socketio.emit('data', {
            'magnitude': magnitude,
            'ax': ax,
            'ay': ay,
            'az': az,
            'rate': update_rate_ms},
                      namespace='/datastream')

        socketio.sleep(sleep_time)
