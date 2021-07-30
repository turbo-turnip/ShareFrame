-- ShareFrame PostgreSQL Database

-- Establish ShareFrame main Database
CREATE DATABASE shareframe_db;

-- Create shareframe_db necessary tables

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_pass VARCHAR(255) NOT NULL,
    pfp TEXT
);

CREATE TABLE unv_users (
    uuser_id SERIAL PRIMARY KEY,
    uuser_name VARCHAR(50) NOT NULL,
    uuser_email VARCHAR(100) NOT NULL,
    uuser_pass VARCHAR(255) NOT NULL
);

CREATE TABLE rt_banishlist (
    rt_id SERIAL PRIMARY KEY,
    rt VARCHAR(512) NOT NULL
);