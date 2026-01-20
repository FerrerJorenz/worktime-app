-- Database initialization script
-- This runs automatically when the PostgreSQL container starts

\echo 'Initializing WorkTime database...'

-- The database 'worktime' is created by docker-compose environment variable
-- This script runs in that database context

\echo 'Installing UUID extension...'
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

\echo 'Database initialization complete!'
