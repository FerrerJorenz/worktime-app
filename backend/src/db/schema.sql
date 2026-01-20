-- WorkTime Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#00E599', -- Hex color code
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster project queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Sessions table (main work tracking)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    name VARCHAR(200) NOT NULL,
    work_type VARCHAR(50) NOT NULL, -- e.g., 'Deep Work', 'Light Work', 'Meeting'
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL, -- Computed but stored for performance
    goal_duration_seconds INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_end_after_start CHECK (end_time > start_time),
    CONSTRAINT check_positive_duration CHECK (duration_seconds > 0)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_project_id ON sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions(start_time DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_work_type ON sessions(work_type);

-- Tags table (for categorizing sessions)
CREATE TABLE IF NOT EXISTS tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure unique tag names per user
    UNIQUE(user_id, name)
);

-- Session tags junction table (many-to-many)
CREATE TABLE IF NOT EXISTS session_tags (
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (session_id, tag_id)
);

-- Create indexes for junction table
CREATE INDEX IF NOT EXISTS idx_session_tags_session_id ON session_tags(session_id);
CREATE INDEX IF NOT EXISTS idx_session_tags_tag_id ON session_tags(tag_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for session analytics (useful for reports)
CREATE OR REPLACE VIEW session_analytics AS
SELECT 
    s.id,
    s.user_id,
    s.name,
    s.work_type,
    s.start_time,
    s.end_time,
    s.duration_seconds,
    s.goal_duration_seconds,
    p.name as project_name,
    p.color as project_color,
    ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
    DATE(s.start_time) as session_date,
    EXTRACT(HOUR FROM s.start_time) as session_hour,
    CASE 
        WHEN s.duration_seconds >= s.goal_duration_seconds THEN true
        ELSE false
    END as goal_achieved
FROM sessions s
LEFT JOIN projects p ON s.project_id = p.id
LEFT JOIN session_tags st ON s.id = st.session_id
LEFT JOIN tags t ON st.tag_id = t.id
GROUP BY s.id, p.id;

-- Sample comment documenting the schema design decisions
COMMENT ON TABLE sessions IS 'Main table for tracking work sessions with computed duration for performance';
COMMENT ON COLUMN sessions.duration_seconds IS 'Denormalized for analytics performance, calculated as end_time - start_time';
COMMENT ON VIEW session_analytics IS 'Aggregated view for analytics queries, includes project and tag information';
