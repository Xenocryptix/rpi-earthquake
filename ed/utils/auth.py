import functools

from flask import (
    Blueprint,
    flash,
    g,
    redirect,
    render_template,
    request,
    session,
    url_for,
    jsonify,
)
from werkzeug.security import check_password_hash, generate_password_hash

from ed.utils.db import get_db

bp = Blueprint("auth", __name__)


# Redirects the root ulr to the login page
@bp.route("/", methods=["GET"])
def get_root():
    return redirect(url_for("auth.login"))


@bp.route("/register", methods=["POST"])
def register():
    # Get the values from the HTML <form> element
    username = request.form["username"]
    device_id = request.form["deviceId"]
    password = request.form["password"]
    db = get_db()
    error = None

    if not username:
        error = "Username is required."
    elif not password:
        error = "Password is required."

    if error is None:
        try:
            # Insert a new user into the database
            db.execute(
                "INSERT INTO user (username, deviceId, password) VALUES (?, ?, ?)",
                (username, device_id, generate_password_hash(password)),
            )
            db.commit()
        except db.IntegrityError:
            return f"User {username} is already registered."
        else:
            return redirect(url_for("auth.login"))


@bp.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        error = None
        user = db.execute(
            "SELECT * FROM user WHERE username = ?", (username,)
        ).fetchone()

        if user is None:
            error = "Incorrect username."
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password."

        if error is None:
            # Create a session for the authenticated user
            session.clear()
            session["user_id"] = user["id"]
            return redirect(url_for("auth.get_dash"))

        flash(error)

    return render_template("login.html")


# Decorator function for protecting routes that require authentication
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))

        return view(**kwargs)

    return wrapped_view


@bp.route("/dash", methods=["GET"])
@login_required  # Apply the login_required decorator here
def get_dash():
    return render_template("dashboard.html")


@bp.route("/change-password", methods=["GET"])
@login_required  # Apply the login_required decorator here
def change_passwd():
    return render_template("changePassword.html")


# Load the logged-in user's information before each request
@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None
    else:
        g.user = (
            get_db().execute("SELECT * FROM user WHERE id = ?", (user_id,)).fetchone()
        )


@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("auth.login"))


# Todo: add /reset to frontend
@bp.route("/reset", methods=["POST"])
def reset_password():
    user_id = session.get("user_id")
    old_password = request.form(["old_password"])
    new_password = generate_password_hash(request.form["new_password"])
    db = get_db()
    error = None
    password = db.execute("SELECT password FROM user WHERE id = ?", (id,)).fetchone()

    if user_id is None:
        error = "Invalid user ID."
    elif not check_password_hash(old_password, password):
        error = "Incorrect password."
    else:
        g.user = db.execute(
            "UPDATE user SET password = ? WHERE id = ?;", (password, user_id)
        ).commit()
        return redirect(url_for("auth.login"))
    flash(error)


@bp.route("/alerts", methods=["GET"])
def get_alerts():
    db = get_db()
    alerts = db.execute("SELECT * FROM alerts").fetchall()
    alerts_list = [dict(alert) for alert in alerts]
    return jsonify(alerts_list)


@bp.route("/alerts", methods=["POST"])
def add_alert():
    db = get_db()
    data = request.get_json()
    avg = data.get("avg")
    max_value = data.get("max")
    lat = data.get("lat")
    lng = data.get("lng")

    if avg is None or max_value is None or lat is None or lng is None:
        return jsonify({"error": "Invalid data"}), 400
    try:
        db.execute(
            "INSERT INTO alerts (avg, max, time, lat, lng) VALUES (?, ?, CURRENT_TIMESTAMP, ?, ?)",
            (avg, max_value, lat, lng),
        )
        db.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"message": "Alert added successfully"}), 201


@bp.route("/switch_detection_mode", methods=["POST"])
def switch_detection_mode():
    from ed.utils.dash import change_mode
    try:
        data = request.get_json()

        # Assuming that the JSON data sent contains the sensitivity value
        sensitivity = data.get("sensitivity")

        change_mode(sensitivity)

        # TODO: Add your logic to switch the detection mode using the sensitivity value
        # For now, let's just print the received sensitivity value
        print(f"Received sensitivity value: {sensitivity}")

        # You can add your logic here to switch the detection mode using the sensitivity value

        return jsonify({"message": "Switched detection mode successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
