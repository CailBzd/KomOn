-- Migration KomOn Database - Reset complet de la base de données
-- Migration ID: 000
-- Date: 2024-12-01
-- Description: Suppression complète de toutes les données et structures
-- Auteur: KomOn Team
-- ATTENTION: Ce script supprime TOUTES les données !

-- =====================================================
-- AVERTISSEMENT
-- =====================================================
-- ⚠️  ATTENTION: Ce script va supprimer TOUTES les données !
-- ⚠️  Utilisez uniquement en développement ou pour réinitialiser complètement
-- ⚠️  Sauvegardez vos données importantes avant d'exécuter ce script

-- =====================================================
-- 1. SUPPRESSION DES DONNÉES ET STRUCTURES
-- =====================================================

-- Désactiver les contraintes de clés étrangères temporairement
SET session_replication_role = replica;

-- Supprimer les vues
DROP VIEW IF EXISTS events_with_details CASCADE;
DROP VIEW IF EXISTS users_with_sports CASCADE;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS update_sports_updated_at ON sports;
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
DROP TRIGGER IF EXISTS update_event_registrations_updated_at ON event_registrations;

-- Supprimer les fonctions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Supprimer les politiques RLS
DROP POLICY IF EXISTS "Sports are viewable by everyone" ON sports;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Events are viewable by everyone" ON events;
DROP POLICY IF EXISTS "Users can create events" ON events;
DROP POLICY IF EXISTS "Organizers can update their events" ON events;
DROP POLICY IF EXISTS "Users can view their registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can register to events" ON event_registrations;
DROP POLICY IF EXISTS "Users can update their registrations" ON event_registrations;
DROP POLICY IF EXISTS "Users can view their sports" ON user_sports;
DROP POLICY IF EXISTS "Users can add sports" ON user_sports;
DROP POLICY IF EXISTS "Users can update their sports" ON user_sports;
DROP POLICY IF EXISTS "Users can delete their sports" ON user_sports;
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can view their credits" ON credits;
DROP POLICY IF EXISTS "Users can add credits" ON credits;

-- Désactiver RLS
ALTER TABLE IF EXISTS sports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS events DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS event_registrations DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_sports DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS credits DISABLE ROW LEVEL SECURITY;

-- Supprimer les index
DROP INDEX IF EXISTS idx_events_sport_id;
DROP INDEX IF EXISTS idx_events_organizer_id;
DROP INDEX IF EXISTS idx_events_start_date;
DROP INDEX IF EXISTS idx_events_status;
DROP INDEX IF EXISTS idx_events_location;
DROP INDEX IF EXISTS idx_event_registrations_event_id;
DROP INDEX IF EXISTS idx_event_registrations_user_id;
DROP INDEX IF EXISTS idx_user_sports_user_id;
DROP INDEX IF EXISTS idx_user_sports_sport_id;
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_messages_receiver_id;
DROP INDEX IF EXISTS idx_messages_created_at;
DROP INDEX IF EXISTS idx_credits_user_id;
DROP INDEX IF EXISTS idx_credits_type;

-- Supprimer les tables dans l'ordre (dépendances)
DROP TABLE IF EXISTS credits CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS user_sports CASCADE;
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sports CASCADE;

-- Réactiver les contraintes de clés étrangères
SET session_replication_role = DEFAULT;

-- =====================================================
-- 2. NETTOYAGE DES SÉQUENCES (si elles existent)
-- =====================================================

-- Supprimer les séquences personnalisées si elles existent
DROP SEQUENCE IF EXISTS sports_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS events_id_seq CASCADE;
DROP SEQUENCE IF EXISTS event_registrations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_sports_id_seq CASCADE;
DROP SEQUENCE IF EXISTS messages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS credits_id_seq CASCADE;

-- =====================================================
-- 3. NETTOYAGE DES SCHEMAS PERSONNALISÉS (si ils existent)
-- =====================================================

-- Supprimer les schémas personnalisés si ils existent
-- DROP SCHEMA IF EXISTS komon CASCADE;

-- =====================================================
-- 4. VÉRIFICATION DU NETTOYAGE
-- =====================================================

-- Vérifier qu'il ne reste plus de tables KomOn
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('sports', 'users', 'events', 'event_registrations', 'user_sports', 'messages', 'credits');
    
    IF table_count = 0 THEN
        RAISE NOTICE '✅ Nettoyage réussi: Aucune table KomOn restante';
    ELSE
        RAISE NOTICE '⚠️ Attention: % tables KomOn restantes', table_count;
    END IF;
END $$;

-- =====================================================
-- FIN DE LA RÉINITIALISATION
-- =====================================================

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE '🔄 Migration 000 - Reset Database terminée!';
    RAISE NOTICE '🗑️  Toutes les données et structures ont été supprimées';
    RAISE NOTICE '📝 Exécutez maintenant la migration 001 pour recréer la base';
    RAISE NOTICE '=====================================================';
END $$; 