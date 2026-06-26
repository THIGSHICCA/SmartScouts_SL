-- =============================================================
-- SmartScouts SL — schema.sql
-- PostgreSQL Database Schema
-- =============================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS badge_requirements CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS proficiency_badge_requirements CASCADE;
DROP TABLE IF EXISTS proficiency_badges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS troops CASCADE;

-- =============================================================
-- TROOPS
-- =============================================================
CREATE TABLE troops (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    district    VARCHAR(100),
    created_at  TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- USERS
-- =============================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('scout', 'leader')),
    troop_id      INT REFERENCES troops(id) ON DELETE SET NULL,
    created_at    TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- BADGES  (the 5 award levels)
-- =============================================================
CREATE TABLE badges (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(150) NOT NULL,
    description         TEXT,
    level_order         INT NOT NULL,          -- 1 to 5, progression order
    min_training_months INT DEFAULT 0,          -- minimum months required
    total_requirements  INT NOT NULL DEFAULT 0
);

-- =============================================================
-- BADGE REQUIREMENTS
-- Two-level structure: parent = main requirement, child = sub-task
-- parent_id NULL means it is a top-level requirement
-- =============================================================
CREATE TABLE badge_requirements (
    id               SERIAL PRIMARY KEY,
    badge_id         INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    parent_id        INT REFERENCES badge_requirements(id) ON DELETE CASCADE,
    requirement_text TEXT NOT NULL,
    order_number     INT NOT NULL DEFAULT 1,
    is_mandatory     BOOLEAN DEFAULT TRUE
);

-- =============================================================
-- PROGRESS
-- One row per scout per requirement
-- =============================================================
CREATE TABLE progress (
    id             SERIAL PRIMARY KEY,
    scout_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requirement_id INT NOT NULL REFERENCES badge_requirements(id) ON DELETE CASCADE,
    status         VARCHAR(20) NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','completed','verified','rejected')),
    completed_at   TIMESTAMP,
    verified_by    INT REFERENCES users(id) ON DELETE SET NULL,
    verified_at    TIMESTAMP,
    notes          TEXT,                        -- leader rejection/approval notes
    UNIQUE (scout_id, requirement_id)
);

-- =============================================================
-- EVIDENCE
-- Files uploaded against a progress record
-- =============================================================
CREATE TABLE evidence (
    id          SERIAL PRIMARY KEY,
    progress_id INT NOT NULL REFERENCES progress(id) ON DELETE CASCADE,
    scout_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_url    VARCHAR(255) NOT NULL,
    file_type   VARCHAR(50),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- MILESTONES
-- Auto-generated when all requirements for a badge are verified
-- =============================================================
CREATE TABLE milestones (
    id          SERIAL PRIMARY KEY,
    scout_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id    INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP DEFAULT NOW(),
    notified    BOOLEAN DEFAULT FALSE,
    UNIQUE (scout_id, badge_id)
);

-- =============================================================
-- PROFICIENCY BADGES.  (separate system — optional badges)
-- =============================================================
CREATE TABLE proficiency_badges (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(20) UNIQUE NOT NULL,   -- e.g. JA-1, SB-3
    name        VARCHAR(100) NOT NULL,
    group_name  VARCHAR(100) NOT NULL,          -- e.g. Public Service Group
    scout_level VARCHAR(20) NOT NULL            -- 'junior' or 'senior'
                CHECK (scout_level IN ('junior','senior','both'))
);

CREATE TABLE proficiency_badge_requirements (
    id               SERIAL PRIMARY KEY,
    prof_badge_id    INT NOT NULL REFERENCES proficiency_badges(id) ON DELETE CASCADE,
    requirement_text TEXT NOT NULL,
    order_number     INT NOT NULL DEFAULT 1
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================
CREATE TABLE notifications (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message    TEXT NOT NULL,
    type       VARCHAR(50) DEFAULT 'info'
               CHECK (type IN ('info','milestone','verification','rejection')),
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- INDEXES for performance
-- =============================================================
CREATE INDEX idx_progress_scout        ON progress(scout_id);
CREATE INDEX idx_progress_requirement  ON progress(requirement_id);
CREATE INDEX idx_progress_status       ON progress(status);
CREATE INDEX idx_evidence_scout        ON evidence(scout_id);
CREATE INDEX idx_evidence_progress     ON evidence(progress_id);
CREATE INDEX idx_milestones_scout      ON milestones(scout_id);
CREATE INDEX idx_notifications_user    ON notifications(user_id);
CREATE INDEX idx_req_badge             ON badge_requirements(badge_id);
CREATE INDEX idx_req_parent            ON badge_requirements(parent_id);
CREATE INDEX idx_users_troop           ON users(troop_id);