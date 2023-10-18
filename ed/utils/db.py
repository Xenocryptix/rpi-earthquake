import sqlite3

import click
from flask import current_app, g


def get_db():
    # Get the SQLite database connection from the Flask application's context (g)
    if 'db' not in g:
        g.db = sqlite3.connect(
            current_app.config['DATABASE'],
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    # Initialize the database by executing SQL commands from 'schema.sql'
    db = get_db()
    with current_app.open_resource('schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    # Clear the existing data and create new tables
    init_db()
    click.echo('Initialized the database.')


def init_app(app):
    # Register database-related functions with the Flask app
    app.teardown_appcontext(close_db)  # Close the database connection at the end of requests
    app.cli.add_command(init_db_command)  # Add a CLI command for manually initializing the database
