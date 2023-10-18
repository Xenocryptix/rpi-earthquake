DROP TABLE IF EXISTS user;

CREATE TABLE user (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      deviceId INTEGER UNIQUE NOT NULL,
                      username TEXT UNIQUE NOT NULL,
                      password TEXT NOT NULL
);