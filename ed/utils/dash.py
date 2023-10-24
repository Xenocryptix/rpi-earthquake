import random


def generate_random_values(socketio):
    while True:
        ax = round(random.uniform(-1.0, 1), 2)
        ay = round(random.uniform(-1.0, 1), 2)
        az = round(random.uniform(-1.0, 1), 2)
        socketio.emit('data', {'ax': ax, 'ay': ay, 'az': az}, namespace='/datastream')
        socketio.sleep(1)  # Emit every 1 second
