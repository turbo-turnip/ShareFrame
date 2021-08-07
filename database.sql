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

CREATE TYPE thread_post_t AS (
    post_id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_pfp TEXT NOT NULL,
    post_content TEXT NOT NULL,
    post_created TEXT NOT NULL
);

CREATE TYPE thread_t AS (
    thread_id SERIAL PRIMARY KEY,
    thread_title VARCHAR(50) NOT NULL,
    thread_desc VARCHAR(255) NOT NULL,
    thread_posts thread_post_t[]
);

CREATE TYPE feedback_t AS (
    user_name VARCHAR(50) NOT NULL,
    user_pfp TEXT NOT NULL,
    feedback TEXT NOT NULL,
    feedback_created TEXT NOT NULL,
    likes INT NOT NULL,
    dislikes INT NOT NULL
);

CREATE TYPE review_t AS (
    user_name VARCHAR(50) NOT NULL,
    user_pfp TEXT NOT NULL,
    review TEXT NOT NULL,
    review_created TEXT NOT NULL,
    rating TEXT NOT NULL
);

CREATE TABLE projects (
    project_title VARCHAR(25) NOT NULL,
    project_desc VARCHAR(120) NOT NULL,
    project_desc_short VARCHAR(50) NOT NULL,
    version_control VARCHAR(5) NOT NULL,
    repo_username TEXT,
    repo_title TEXT,
    allow_feedback VARCHAR(5) NOT NULL,
    allow_reviews VARCHAR(5) NOT NULL,
    allow_threads VARCHAR(5) NOT NULL,
    threads thread_t[],
    feedback feedback_t[]
    reviews review_t[]
);