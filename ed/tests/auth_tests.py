import pytest
from ed import create_app


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app, socketio = create_app()
    app.config.update({
        "TESTING": True,
    })

    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_get_login(client):
    response = client.get("/login")

    assert response.status_code == 200
    assert b'<title>ED Log In</title>' in response.data


def test_login_incorrect_credentials(client):
    response = client.post("/login", data={"username": "wronguser", "password": "wrongpass"})

    assert response.location != "/dash"  # Check that it is not redirected to the dashboard
    assert response.status_code == 200
    assert b'<title>ED Log In</title>' in response.data  # Check that we are still in the login page


def test_login_correct_credentials(client):
    response = client.post("/login", data={"username": "admin", "password": "abc"})

    assert response.status_code == 302  # Check if it's a redirect response (to the dash)
    assert response.location == "/dash"  # Check that we're redirected to the dash

    response = client.get(response.location)

    assert response.status_code == 200
    assert b'<title>ED Dash</title>' in response.data  # Check that the dash HTML page is retrieved
