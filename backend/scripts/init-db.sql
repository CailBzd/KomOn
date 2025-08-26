-- Script d'initialisation de la base de données KomOn
-- Ce script est exécuté automatiquement lors du premier démarrage du conteneur PostgreSQL

-- Création de l'extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Création de l'extension pour les recherches full-text
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Création de l'extension pour les index GIN
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Création d'un utilisateur de test (optionnel)
-- INSERT INTO "Users" (Id, Email, FirstName, LastName, Username, PasswordHash, CreatedAt, Status, Role)
-- VALUES (
--     uuid_generate_v4(),
--     'admin@komon.local',
--     'Admin',
--     'KomOn',
--     'admin',
--     '$2a$11$example_hash_here', -- À remplacer par un vrai hash
--     NOW(),
--     'Active',
--     'Admin'
-- );

-- Log de l'initialisation
DO $$
BEGIN
    RAISE NOTICE 'Base de données KomOn initialisée avec succès!';
    RAISE NOTICE 'Extensions PostgreSQL installées: uuid-ossp, pg_trgm, btree_gin';
END $$; 