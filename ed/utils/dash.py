import random


def generate_random_values(socketio):
    while True:
        value = random.randint(1, 100)
        socketio.emit('new_value', {'value': value}, namespace='/random')
        socketio.sleep(1)  # Emit every 1 second
