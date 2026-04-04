-- Systema Education Platform Schema

CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  session_id VARCHAR(50) NOT NULL DEFAULT 'default',
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id),
  part VARCHAR(50) NOT NULL,
  option_key VARCHAR(100) NOT NULL,
  voted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id),
  question_type VARCHAR(50) NOT NULL, -- 'pain_point' | 'automation'
  response_text TEXT NOT NULL,
  responded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  participant_id INTEGER REFERENCES participants(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast polling
CREATE INDEX IF NOT EXISTS idx_participants_joined ON participants(joined_at DESC);
CREATE INDEX IF NOT EXISTS idx_responses_type ON responses(question_type);
CREATE INDEX IF NOT EXISTS idx_votes_part ON votes(part);
