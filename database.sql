-- ShareFrame PostgreSQL Database

-- Establish ShareFrame main Database
CREATE DATABASE shareframe_db;

-- Create shareframe_db necessary tables

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_pass VARCHAR(255) NOT NULL,
    pfp TEXT,
    verified VARCHAR(5) NOT NULL
);

CREATE TABLE rt_banishlist (
    rt_id SERIAL PRIMARY KEY,
    rt VARCHAR(512) NOT NULL
);

CREATE TABLE projects (
    project_id SERIAL PRIMARY KEY,
    project_title VARCHAR(25) NOT NULL,
    project_desc VARCHAR(120) NOT NULL,
    project_desc_short VARCHAR(50) NOT NULL,
    version_control VARCHAR(5) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    user_pfp TEXT NOT NULL,
    repo_username TEXT,
    repo_title TEXT,
    allow_feedback VARCHAR(5) NOT NULL,
    allow_reviews VARCHAR(5) NOT NULL,
    allow_threads VARCHAR(5) NOT NULL,
    threads JSON,
    feedback JSON,
    reviews JSON,
    supporters JSON,
    members JSON
);