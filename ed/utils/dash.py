import math
import random


def generate_random_values(socketio):
    while True:
        ax = random.uniform(-1.0, 1)
        ay = random.uniform(-1.0, 1)
        az = random.uniform(-1.0, 1)
        magnitude = math.sqrt(math.pow(ax, 2) + math.pow(ay, 2) + math.pow(az, 2))
        socketio.emit('data', {'magnitude': magnitude, 'ax': ax, 'ay': ay, 'az': az}, namespace='/datastream')
        socketio.sleep(2)  # Emit every 1 second
