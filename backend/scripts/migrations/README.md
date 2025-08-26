# 📊 Système de Migrations SQL KomOn

Ce dossier contient tous les scripts SQL pour gérer la base de données KomOn dans Supabase.

## 📁 Structure des fichiers

```
migrations/
├── README.md                           # Ce fichier
├── 000_reset_database.sql             # Reset complet de la base
├── 001_initial_database_setup.sql     # Création initiale de la base
└── complete_database_setup.sql        # Script complet (reset + création)
```

## 🚀 Scripts disponibles

### 1. **000_reset_database.sql** - Reset complet
**⚠️ ATTENTION : Supprime TOUTES les données !**

- Supprime toutes les tables, vues, triggers, fonctions
- Désactive et supprime toutes les politiques RLS
- Supprime tous les index
- Nettoie complètement la base de données

**Utilisation :**
```sql
-- Dans l'interface Supabase SQL Editor
-- Copier-coller le contenu de 000_reset_database.sql
-- Cliquer sur "Run"
```

### 2. **001_initial_database_setup.sql** - Création initiale
**✅ Crée la base de données complète**

- Crée toutes les tables (sports, users, events, etc.)
- Insère 50+ sports pré-définis
- Configure les index pour les performances
- Active RLS et configure les politiques de sécurité
- Crée les triggers pour `updated_at`
- Crée les vues utiles
- Insère des données de test

**Utilisation :**
```sql
-- Dans l'interface Supabase SQL Editor
-- Copier-coller le contenu de 001_initial_database_setup.sql
-- Cliquer sur "Run"
```

### 3. **complete_database_setup.sql** - Script complet
**🔄 Reset + Création en une seule fois**

- Combine le reset complet + la création initiale
- Idéal pour réinitialiser complètement la base
- Plus rapide que d'exécuter les deux scripts séparément

**Utilisation :**
```sql
-- Dans l'interface Supabase SQL Editor
-- Copier-coller le contenu de complete_database_setup.sql
-- Cliquer sur "Run"
```

## 📋 Tables créées

| Table | Description |
|-------|-------------|
| `sports` | Liste des sports disponibles |
| `users` | Utilisateurs de l'application |
| `events` | Événements sportifs |
| `event_registrations` | Inscriptions aux événements |
| `user_sports` | Sports préférés des utilisateurs |
| `messages` | Messages entre utilisateurs |
| `credits` | Système de crédits |

## 🏃 Sports inclus (50+)

### Sports de ballon
- Football, Basketball, Tennis, Volleyball, Handball, Rugby, Badminton, Ping-pong

### Sports de combat
- Boxe, Judo, Karaté, Taekwondo, MMA

### Sports d'endurance
- Course à pied, Cyclisme, Natation, Triathlon, Marathon

### Sports de montagne
- Escalade, Randonnée, Ski, Snowboard, VTT

### Sports de raquette
- Squash, Padel, Tennis de table

### Sports de fitness
- Musculation, CrossFit, Yoga, Pilates, Zumba

### Sports aquatiques
- Plongée, Surf, Kitesurf, Aviron

### Sports de glace
- Hockey sur glace, Patinage, Curling

### Sports de précision
- Golf, Tir à l'arc, Pétanque, Boules lyonnaises

### Sports urbains
- Skateboard, Roller, Parkour, BMX

### Sports traditionnels
- Pétanque, Boules lyonnaises, Quilles

## 🔒 Sécurité (RLS)

Toutes les tables ont Row Level Security activé avec des politiques appropriées :

- **Sports** : Lecture publique
- **Users** : Chaque utilisateur voit/modifie son propre profil
- **Events** : Lecture publique, création/modification par l'organisateur
- **Registrations** : Chaque utilisateur gère ses inscriptions
- **Messages** : Chaque utilisateur voit ses conversations
- **Credits** : Chaque utilisateur voit ses crédits

## 📊 Vues utiles

### `events_with_details`
Vue enrichie des événements avec :
- Nom et icône du sport
- Informations de l'organisateur
- Nombre de participants actuels

### `users_with_sports`
Vue des utilisateurs avec :
- Liste de leurs sports
- Niveaux de compétence

## 🧪 Données de test

Le script crée automatiquement :
- **Utilisateur de test** : `testuser` (test@komon.com)
- **Événement de test** : "Match de foot amical" à Lyon

## 🔄 Workflow recommandé

### Pour un nouveau projet :
1. Exécuter `complete_database_setup.sql`
2. Vérifier que tout fonctionne
3. Lancer l'API

### Pour ajouter des migrations :
1. Créer un nouveau fichier `002_nouvelle_fonctionnalite.sql`
2. Documenter les changements
3. Tester en développement
4. Déployer en production

### Pour réinitialiser en développement :
1. Exécuter `000_reset_database.sql`
2. Puis `001_initial_database_setup.sql`
3. Ou directement `complete_database_setup.sql`

## ⚠️ Avertissements

- **Ne jamais exécuter les scripts de reset en production**
- **Toujours sauvegarder avant de réinitialiser**
- **Tester en développement avant de déployer**
- **Vérifier les permissions Supabase**

## 🛠️ Commandes utiles

### Vérifier l'état de la base :
```sql
-- Compter les sports
SELECT COUNT(*) FROM sports;

-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('sports', 'users', 'events', 'event_registrations', 'user_sports', 'messages', 'credits');

-- Vérifier les politiques RLS
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📞 Support

En cas de problème :
1. Vérifier les logs dans l'interface Supabase
2. Contrôler que les permissions sont correctes
3. S'assurer que la base est accessible
4. Vérifier la syntaxe SQL

---

**Développé par l'équipe KomOn** 🚀 