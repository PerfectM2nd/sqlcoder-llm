-- Create database if it doesn't exist
CREATE DATABASE llm_demo;

-- Connect to the database
\c llm_demo;

-- Create PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create test_cases table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(255) NOT NULL,
    natural_language TEXT NOT NULL,
    reference_sql TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test_result table if it doesn't exist
CREATE TABLE IF NOT EXISTS test_result (
    id SERIAL PRIMARY KEY,
    test_case_id INTEGER REFERENCES test_cases(id),
    generated_sql TEXT,
    is_correct BOOLEAN,
    execution_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 