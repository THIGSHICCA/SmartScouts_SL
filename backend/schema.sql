-- schema.sql

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20), -- 'scout', 'leader', 'commissioner'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  total_requirements INT
);

CREATE TABLE badge_requirements (
  id SERIAL PRIMARY KEY,
  badge_id INT REFERENCES badges(id),
  requirement_text TEXT,
  order_number INT
);

CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  scout_id INT REFERENCES users(id),
  requirement_id INT REFERENCES badge_requirements(id),
  status VARCHAR(20), -- 'pending', 'completed', 'verified'
  completed_at TIMESTAMP
);

CREATE TABLE evidence (
  id SERIAL PRIMARY KEY,
  progress_id INT REFERENCES progress(id),
  file_url VARCHAR(255),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
