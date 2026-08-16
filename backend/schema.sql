-- =============================================================
-- SmartScouts SL — schema.sql
-- PostgreSQL Database Schema (Improved User Flow)
-- =============================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS password_resets CASCADE;
DROP TABLE IF EXISTS email_verifications CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS document_categories CASCADE;
DROP TABLE IF EXISTS troop_members CASCADE;
DROP TABLE IF EXISTS patrol_members CASCADE;
DROP TABLE IF EXISTS pre_registered_leaders CASCADE;
DROP TABLE IF EXISTS patrols CASCADE;
DROP TABLE IF EXISTS badge_applications CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS evidence CASCADE;
DROP TABLE IF EXISTS progress CASCADE;
DROP TABLE IF EXISTS badge_requirements CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS proficiency_badge_requirements CASCADE;
DROP TABLE IF EXISTS proficiency_badges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS troops CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- =============================================================
-- USERS (Core table, referenced by troops and patrols)
-- =============================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    dob           DATE,
    scout_reg_no  VARCHAR(100) UNIQUE,
    scout_district VARCHAR(100),
    scout_district_reg_no VARCHAR(100),
    commissioner_reg_no VARCHAR(100),
    leader_registration_id VARCHAR(50),
    is_email_verified BOOLEAN DEFAULT FALSE,
    role          VARCHAR(20) NOT NULL CHECK (role IN ('scout', 'patrol_leader', 'leader', 'commissioner')),
    status        VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'blocked')),
    troop_id      INT, -- We will add FK later
    patrol_id     INT, -- We will add FK later
    avatar        TEXT,
    cover_image   TEXT,
    roles         TEXT,
    achievements  TEXT,
    batch         VARCHAR(100),
    join_date     VARCHAR(100),
    created_by    INT REFERENCES users(id) ON DELETE SET NULL,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- TROOPS
-- =============================================================
CREATE TABLE troops (
    id          SERIAL PRIMARY KEY,
    troop_id    VARCHAR(50) UNIQUE,
    name        VARCHAR(150) NOT NULL,
    address     TEXT,
    phone_number VARCHAR(50),
    email       VARCHAR(100),
    district    VARCHAR(100),
    created_by_commissioner INT REFERENCES users(id) ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Add troop_id FK to users
ALTER TABLE users ADD CONSTRAINT fk_user_troop FOREIGN KEY (troop_id) REFERENCES troops(id) ON DELETE SET NULL;

-- =============================================================
-- TROOP MEMBERS (History and many-to-many relationship)
-- =============================================================
CREATE TABLE troop_members (
    id          SERIAL PRIMARY KEY,
    troop_id    INT NOT NULL REFERENCES troops(id) ON DELETE CASCADE,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_date TIMESTAMP DEFAULT NOW(),
    left_date   TIMESTAMP,
    status      VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'transferred', 'left'))
);

-- =============================================================
-- PRE-REGISTERED LEADERS (Added by Commissioner)
-- =============================================================
CREATE TABLE pre_registered_leaders (
    id                  SERIAL PRIMARY KEY,
    troop_id            INT NOT NULL REFERENCES troops(id) ON DELETE CASCADE,
    leader_registration_id VARCHAR(50) UNIQUE NOT NULL,
    name                VARCHAR(150) NOT NULL,
    first_name          VARCHAR(100),
    last_name           VARCHAR(100),
    scout_registration_no VARCHAR(100),
    email               VARCHAR(100),
    registered          BOOLEAN DEFAULT FALSE,
    registered_user_id  INT REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- PATROLS
-- =============================================================
CREATE TABLE patrols (
    id          SERIAL PRIMARY KEY,
    patrol_id   VARCHAR(50) UNIQUE,
    name        VARCHAR(150) NOT NULL,
    troop_id    INT REFERENCES troops(id) ON DELETE CASCADE,
    leader_id   INT REFERENCES users(id) ON DELETE SET NULL, -- Scout Leader who created it
    patrol_leader_id INT REFERENCES users(id) ON DELETE SET NULL, -- Scout who leads it
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Add patrol_id FK to users
ALTER TABLE users ADD CONSTRAINT fk_user_patrol FOREIGN KEY (patrol_id) REFERENCES patrols(id) ON DELETE SET NULL;

-- =============================================================
-- PATROL MEMBERS (History of patrol assignments)
-- =============================================================
CREATE TABLE patrol_members (
    id          SERIAL PRIMARY KEY,
    patrol_id   INT NOT NULL REFERENCES patrols(id) ON DELETE CASCADE,
    scout_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at   TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- EMAIL VERIFICATIONS
-- =============================================================
CREATE TABLE email_verifications (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otp         VARCHAR(10) NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    verified    BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- PASSWORD RESETS
-- =============================================================
CREATE TABLE password_resets (
    id          SERIAL PRIMARY KEY,
    user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- BADGES (5 award levels)
-- =============================================================
CREATE TABLE badges (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(150) NOT NULL,
    description         TEXT,
    level_order         INT NOT NULL,          
    min_training_months INT DEFAULT 0,          
    total_requirements  INT NOT NULL DEFAULT 0
);

-- =============================================================
-- BADGE REQUIREMENTS
-- =============================================================
CREATE TABLE badge_requirements (
    id                  SERIAL PRIMARY KEY,
    badge_id            INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    parent_id           INT REFERENCES badge_requirements(id) ON DELETE CASCADE,
    requirement_text    TEXT NOT NULL,           
    requirement_text_ta TEXT,                    
    requirement_text_si TEXT,                    
    order_number        INT NOT NULL DEFAULT 1,
    is_mandatory        BOOLEAN DEFAULT TRUE
);

-- =============================================================
-- PROGRESS
-- =============================================================
CREATE TABLE progress (
    id               SERIAL PRIMARY KEY,
    scout_id         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requirement_id   INT NOT NULL REFERENCES badge_requirements(id) ON DELETE CASCADE,
    status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending', 'pending_pl', 'pl_approved', 'verified', 'rejected')),
    completed_at     TIMESTAMP,              
    pl_approved_by   INT REFERENCES users(id) ON DELETE SET NULL,
    pl_approved_at   TIMESTAMP,              
    verified_by      INT REFERENCES users(id) ON DELETE SET NULL,
    verified_at      TIMESTAMP,              
    evidence_url     VARCHAR(500),           
    notes            TEXT,                   
    UNIQUE (scout_id, requirement_id)
);

-- =============================================================
-- EVIDENCE
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
-- BADGE APPLICATIONS
-- =============================================================
CREATE TABLE badge_applications (
    id           SERIAL PRIMARY KEY,
    scout_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id     INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    status       VARCHAR(20) NOT NULL DEFAULT 'pending' 
                 CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMP DEFAULT NOW(),
    reviewed_by  INT REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at  TIMESTAMP,
    notes        TEXT,
    UNIQUE (scout_id, badge_id, status)
);

-- =============================================================
-- PROFICIENCY BADGES
-- =============================================================
CREATE TABLE proficiency_badges (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    name_ta     TEXT,
    name_si     TEXT,
    group_name  VARCHAR(100) NOT NULL,
    scout_level VARCHAR(20) NOT NULL CHECK (scout_level IN ('junior','senior','both'))
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
    type       VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info','milestone','verification','rejection')),
    is_read    BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================================
-- DOCUMENTS (For Knowledge base tracking)
-- =============================================================
CREATE TABLE documents (
    id               SERIAL PRIMARY KEY,
    filename         VARCHAR(255) UNIQUE NOT NULL,
    file_path        VARCHAR(255) NOT NULL,
    uploaded_at      TIMESTAMP DEFAULT NOW(),
    chunk_ids_prefix VARCHAR(50) NOT NULL,
    category         VARCHAR(100) DEFAULT 'General Reference',
    description      TEXT
);

-- =============================================================
-- DOCUMENT CATEGORIES (Managed by Admin)
-- =============================================================
CREATE TABLE document_categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed default categories
INSERT INTO document_categories (name, is_default) VALUES
  ('General Reference', TRUE),
  ('Junior Scout Syllabus', TRUE),
  ('Senior Scout Syllabus', TRUE),
  ('Proficiency Badges', TRUE),
  ('Membership Badges', TRUE),
  ('Leader Training', TRUE),
  ('Activity Guidelines', TRUE);

-- =============================================================
-- INDEXES for performance
-- =============================================================
CREATE INDEX idx_progress_scout        ON progress(scout_id);
CREATE INDEX idx_progress_requirement  ON progress(requirement_id);
CREATE INDEX idx_progress_status       ON progress(status);
CREATE INDEX idx_evidence_scout        ON evidence(scout_id);
CREATE INDEX idx_evidence_progress     ON evidence(progress_id);
CREATE INDEX idx_milestones_scout      ON milestones(scout_id);
CREATE INDEX idx_badge_apps_scout      ON badge_applications(scout_id);
CREATE INDEX idx_badge_apps_status     ON badge_applications(status);
CREATE INDEX idx_notifications_user    ON notifications(user_id);
CREATE INDEX idx_req_badge             ON badge_requirements(badge_id);
CREATE INDEX idx_req_parent            ON badge_requirements(parent_id);
CREATE INDEX idx_users_troop           ON users(troop_id);
CREATE INDEX idx_troop_members_user    ON troop_members(user_id);
CREATE INDEX idx_patrol_members_scout  ON patrol_members(scout_id);