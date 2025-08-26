-- Migration KomOn Database - Création complète de la base de données
-- Migration ID: 001
-- Date: 2024-12-01
-- Description: Initialisation de la base de données KomOn avec tous les sports
-- Auteur: KomOn Team

-- =====================================================
-- 1. CRÉATION DES TABLES
-- =====================================================

-- Table des sports
CREATE TABLE IF NOT EXISTS sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    bio TEXT,
    profile_picture_url VARCHAR(255),
    role VARCHAR(50) DEFAULT 'participant',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des événements
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    sport_id UUID NOT NULL REFERENCES sports(id),
    organizer_id UUID NOT NULL REFERENCES users(id),
    max_participants INTEGER DEFAULT 10,
    price DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'draft',
    type VARCHAR(50) DEFAULT 'competition',
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    requirements TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des inscriptions aux événements
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'confirmed',
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Table des sports des utilisateurs
CREATE TABLE IF NOT EXISTS user_sports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    skill_level VARCHAR(50) DEFAULT 'beginner',
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, sport_id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des crédits
CREATE TABLE IF NOT EXISTS credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL DEFAULT 0,
    type VARCHAR(50) NOT NULL, -- 'purchase', 'earned', 'spent', 'refund'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. INDEX POUR LES PERFORMANCES
-- =====================================================

-- Index pour les événements
CREATE INDEX IF NOT EXISTS idx_events_sport_id ON events(sport_id);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);

-- Index pour les inscriptions
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);

-- Index pour les sports des utilisateurs
CREATE INDEX IF NOT EXISTS idx_user_sports_user_id ON user_sports(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sports_sport_id ON user_sports(sport_id);

-- Index pour les messages
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Index pour les crédits
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_type ON credits(type);

-- =====================================================
-- 3. INSERTION DES SPORTS PRÉ-DÉFINIS
-- =====================================================

-- Sports de ballon
INSERT INTO sports (name, description, icon_url) VALUES
('Football', 'Le football est un sport collectif qui se joue principalement au pied avec un ballon sphérique.', '⚽'),
('Basketball', 'Le basketball est un sport collectif qui se joue à la main avec un ballon.', '🏀'),
('Tennis', 'Le tennis est un sport de raquette qui se joue entre deux joueurs ou deux équipes.', '🎾'),
('Volleyball', 'Le volleyball est un sport collectif qui se joue avec les mains et les avant-bras.', '🏐'),
('Handball', 'Le handball est un sport collectif qui se joue à la main avec un ballon.', '🤾'),
('Rugby', 'Le rugby est un sport collectif qui se joue avec les mains et les pieds.', '🏉'),
('Badminton', 'Le badminton est un sport de raquette qui se joue avec un volant.', '🏸'),
('Ping-pong', 'Le ping-pong est un sport de raquette qui se joue sur une table.', '🏓')
ON CONFLICT (name) DO NOTHING;

-- Sports de combat
INSERT INTO sports (name, description, icon_url) VALUES
('Boxe', 'La boxe est un sport de combat qui se pratique avec les poings.', '🥊'),
('Judo', 'Le judo est un art martial et un sport de combat d''origine japonaise.', '🥋'),
('Karaté', 'Le karaté est un art martial japonais qui se pratique à mains nues.', '🥋'),
('Taekwondo', 'Le taekwondo est un art martial coréen qui se pratique avec les pieds et les poings.', '🥋'),
('MMA', 'Le MMA (Mixed Martial Arts) est un sport de combat qui combine plusieurs arts martiaux.', '🥊')
ON CONFLICT (name) DO NOTHING;

-- Sports d''endurance
INSERT INTO sports (name, description, icon_url) VALUES
('Course à pied', 'La course à pied est un sport d''endurance qui se pratique en extérieur.', '🏃'),
('Cyclisme', 'Le cyclisme est un sport qui se pratique à vélo.', '🚴'),
('Natation', 'La natation est un sport qui se pratique dans l''eau.', '🏊'),
('Triathlon', 'Le triathlon combine natation, cyclisme et course à pied.', '🏊‍♂️'),
('Marathon', 'Le marathon est une course à pied de 42,195 km.', '🏃‍♂️')
ON CONFLICT (name) DO NOTHING;

-- Sports de montagne
INSERT INTO sports (name, description, icon_url) VALUES
('Escalade', 'L''escalade est un sport qui consiste à grimper sur des parois rocheuses.', '🧗'),
('Randonnée', 'La randonnée est une activité de marche en pleine nature.', '🥾'),
('Ski', 'Le ski est un sport de glisse qui se pratique sur la neige.', '⛷️'),
('Snowboard', 'Le snowboard est un sport de glisse qui se pratique sur la neige.', '🏂'),
('VTT', 'Le VTT (Vélo Tout Terrain) est une activité cycliste en terrain varié.', '🚵')
ON CONFLICT (name) DO NOTHING;

-- Sports de raquette
INSERT INTO sports (name, description, icon_url) VALUES
('Squash', 'Le squash est un sport de raquette qui se joue dans un court fermé.', '🎾'),
('Padel', 'Le padel est un sport de raquette qui se joue sur un court plus petit que le tennis.', '🎾'),
('Tennis de table', 'Le tennis de table est un sport de raquette qui se joue sur une table.', '🏓')
ON CONFLICT (name) DO NOTHING;

-- Sports de fitness
INSERT INTO sports (name, description, icon_url) VALUES
('Musculation', 'La musculation est un sport qui vise à développer la force musculaire.', '💪'),
('CrossFit', 'Le CrossFit est un programme de fitness qui combine plusieurs disciplines.', '🏋️'),
('Yoga', 'Le yoga est une discipline qui combine postures, respiration et méditation.', '🧘'),
('Pilates', 'Le Pilates est une méthode d''exercices qui renforce les muscles profonds.', '🧘‍♀️'),
('Zumba', 'La Zumba est une activité fitness qui combine danse et exercices.', '💃')
ON CONFLICT (name) DO NOTHING;

-- Sports aquatiques
INSERT INTO sports (name, description, icon_url) VALUES
('Plongée', 'La plongée est un sport qui consiste à explorer les fonds marins.', '🤿'),
('Surf', 'Le surf est un sport de glisse qui se pratique sur les vagues.', '🏄'),
('Kitesurf', 'Le kitesurf est un sport de glisse qui combine surf et cerf-volant.', '🏄‍♂️'),
('Aviron', 'L''aviron est un sport qui se pratique en bateau avec des rames.', '🚣')
ON CONFLICT (name) DO NOTHING;

-- Sports de glace
INSERT INTO sports (name, description, icon_url) VALUES
('Hockey sur glace', 'Le hockey sur glace est un sport collectif qui se joue sur glace.', '🏒'),
('Patinage', 'Le patinage est un sport de glisse qui se pratique sur glace.', '⛸️'),
('Curling', 'Le curling est un sport de précision qui se joue sur glace.', '🥌')
ON CONFLICT (name) DO NOTHING;

-- Sports de précision
INSERT INTO sports (name, description, icon_url) VALUES
('Golf', 'Le golf est un sport de précision qui se joue avec des clubs.', '⛳'),
('Tir à l''arc', 'Le tir à l''arc est un sport de précision qui se pratique avec un arc.', '🏹'),
('Pétanque', 'La pétanque est un sport de précision qui se joue avec des boules.', '🎯'),
('Boules lyonnaises', 'Les boules lyonnaises sont un sport de précision traditionnel.', '🎯')
ON CONFLICT (name) DO NOTHING;

-- Sports urbains
INSERT INTO sports (name, description, icon_url) VALUES
('Skateboard', 'Le skateboard est un sport de glisse urbain.', '🛹'),
('Roller', 'Le roller est un sport de glisse qui se pratique avec des patins à roues.', '🛼'),
('Parkour', 'Le parkour est un sport qui consiste à se déplacer en milieu urbain.', '🤸'),
('BMX', 'Le BMX est un sport cycliste acrobatique.', '🚲')
ON CONFLICT (name) DO NOTHING;

-- Sports traditionnels (supprimé les doublons)
INSERT INTO sports (name, description, icon_url) VALUES
('Quilles', 'Les quilles sont un sport traditionnel qui se joue avec des quilles.', '🎳')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. FONCTIONS ET TRIGGERS
-- =====================================================

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour mettre à jour updated_at
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. POLITIQUES RLS (Row Level Security)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

-- Politiques pour les sports (lecture publique)
CREATE POLICY "Sports are viewable by everyone" ON sports FOR SELECT USING (true);

-- Politiques pour les utilisateurs
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Politiques pour les événements
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Organizers can update their events" ON events FOR UPDATE USING (auth.uid() = organizer_id);

-- Politiques pour les inscriptions
CREATE POLICY "Users can view their registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can register to events" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their registrations" ON event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Politiques pour les sports des utilisateurs
CREATE POLICY "Users can view their sports" ON user_sports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add sports" ON user_sports FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their sports" ON user_sports FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their sports" ON user_sports FOR DELETE USING (auth.uid() = user_id);

-- Politiques pour les messages
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Politiques pour les crédits
CREATE POLICY "Users can view their credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add credits" ON credits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- 6. VUES UTILES
-- =====================================================

-- Vue pour les événements avec détails
CREATE VIEW events_with_details AS
SELECT 
    e.*,
    s.name as sport_name,
    s.icon_url as sport_icon,
    u.first_name as organizer_first_name,
    u.last_name as organizer_last_name,
    u.username as organizer_username,
    COUNT(er.id) as current_participants
FROM events e
JOIN sports s ON e.sport_id = s.id
JOIN users u ON e.organizer_id = u.id
LEFT JOIN event_registrations er ON e.id = er.event_id AND er.status = 'confirmed'
GROUP BY e.id, s.name, s.icon_url, u.first_name, u.last_name, u.username;

-- Vue pour les utilisateurs avec leurs sports
CREATE VIEW users_with_sports AS
SELECT 
    u.*,
    ARRAY_AGG(s.name) as sport_names,
    ARRAY_AGG(us.skill_level) as skill_levels
FROM users u
LEFT JOIN user_sports us ON u.id = us.user_id
LEFT JOIN sports s ON us.sport_id = s.id
GROUP BY u.id;

-- =====================================================
-- 7. DONNÉES DE TEST (OPTIONNEL)
-- =====================================================

-- Créer un utilisateur de test (mot de passe: test123)
INSERT INTO users (username, first_name, last_name, email, password_hash, role) VALUES
('testuser', 'Test', 'User', 'test@komon.com', '$2a$10$test_hash_here', 'participant')
ON CONFLICT (email) DO NOTHING;

-- Créer un événement de test (seulement si l'utilisateur de test existe)
INSERT INTO events (title, description, start_date, end_date, location, sport_id, organizer_id, status, type)
SELECT 
    'Match de foot amical', 
    'Match de football amical au parc des sports', 
    NOW() + INTERVAL '1 day', 
    NOW() + INTERVAL '1 day' + INTERVAL '2 hours',
    'Parc des Sports, Lyon', 
    s.id,
    u.id,
    'published', 
    'competition'
FROM sports s, users u
WHERE s.name = 'Football' 
AND u.username = 'testuser'
AND NOT EXISTS (
    SELECT 1 FROM events e 
    WHERE e.title = 'Match de foot amical' 
    AND e.organizer_id = u.id
)
LIMIT 1;

-- =====================================================
-- FIN DE LA MIGRATION
-- =====================================================

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Migration 001 - Initial Database Setup terminée avec succès!';
    RAISE NOTICE 'Sports créés: %', (SELECT COUNT(*) FROM sports);
    RAISE NOTICE 'Tables créées: sports, users, events, event_registrations, user_sports, messages, credits';
END $$; 