from ed import create_app, socketio

app, _ = create_app()

if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)