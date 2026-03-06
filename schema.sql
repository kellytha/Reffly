-- Database schema for Referee Allocation System

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id SERIAL PRIMARY KEY,
    name_of_tournament VARCHAR(255) NOT NULL,
    sport_type VARCHAR(50) NOT NULL,
    dropbox_file_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Referees table
CREATE TABLE IF NOT EXISTS referees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    association VARCHAR(100), -- For touch rugby associations
    club VARCHAR(100), -- Club affiliation
    level VARCHAR(50) DEFAULT 'Junior', -- Junior, Intermediate, Senior, Elite
    rating DECIMAL(3,2) DEFAULT 3.0, -- Rating from 1.0 to 5.0
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    home_team VARCHAR(255) NOT NULL,
    away_team VARCHAR(255) NOT NULL,
    time_slot TIME NOT NULL,
    game_date DATE DEFAULT CURRENT_DATE,
    field_number INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game allocations (referee assignments to games)
CREATE TABLE IF NOT EXISTS game_allocations (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    referee_id INTEGER REFERENCES referees(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'referee', -- referee, assistant_referee, etc.
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(game_id, referee_id)
);

-- Referee ratings (for rating system)
CREATE TABLE IF NOT EXISTS referee_ratings (
    id SERIAL PRIMARY KEY,
    referee_id INTEGER REFERENCES referees(id) ON DELETE CASCADE,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    rated_by INTEGER REFERENCES referees(id), -- Who rated them (could be admin/coach)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_tournament_id ON games(tournament_id);
CREATE INDEX IF NOT EXISTS idx_games_time_slot ON games(time_slot);
CREATE INDEX IF NOT EXISTS idx_game_allocations_game_id ON game_allocations(game_id);
CREATE INDEX IF NOT EXISTS idx_game_allocations_referee_id ON game_allocations(referee_id);
CREATE INDEX IF NOT EXISTS idx_referee_ratings_referee_id ON referee_ratings(referee_id);
CREATE INDEX IF NOT EXISTS idx_referees_association ON referees(association);
CREATE INDEX IF NOT EXISTS idx_referees_active ON referees(is_active);

-- Update trigger for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referees_updated_at BEFORE UPDATE ON referees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();