-- Migration pour ajouter le champ username à la table users
-- Date: 2024-12-01

-- Ajouter la colonne username à la table users
ALTER TABLE users 
ADD COLUMN username VARCHAR(50) NOT NULL DEFAULT 'user_' || substr(md5(random()::text), 1, 8);

-- Créer un index unique sur username pour éviter les doublons
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Ajouter une contrainte pour s'assurer que le username respecte le format attendu
ALTER TABLE users 
ADD CONSTRAINT chk_username_format 
CHECK (username ~ '^[a-zA-Z0-9_-]+$');

-- Ajouter une contrainte pour la longueur minimale
ALTER TABLE users 
ADD CONSTRAINT chk_username_length 
CHECK (length(username) >= 3 AND length(username) <= 50);

-- Mettre à jour les utilisateurs existants avec des usernames uniques
-- (si des utilisateurs existent déjà)
UPDATE users 
SET username = 'user_' || substr(md5(random()::text), 1, 8) 
WHERE username = 'user_' || substr(md5(random()::text), 1, 8);

-- Commentaire sur la migration
COMMENT ON COLUMN users.username IS 'Pseudo unique de l''utilisateur (3-50 caractères, lettres, chiffres, tirets et underscores uniquement)'; 