# Architecture KomOn

## Vue d'ensemble

KomOn est une plateforme d'organisation d'événements sportifs locaux construite avec une architecture moderne et scalable. Le projet suit les principes de l'architecture hexagonale (Clean Architecture) et utilise les technologies les plus récentes.

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Web                         │
│                    (Next.js + TypeScript)                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Gateway / Load Balancer              │
│                         (Nginx)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│                   (.NET Core 8 + C#)                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌─────────────────┐    ┌─────────────────┐
        │   PostgreSQL    │    │     Redis       │
        │   (Supabase)    │    │   (Cache/Session)│
        └─────────────────┘    └─────────────────┘
                    │                   │
                    │                   │
                    ▼                   ▼
        ┌─────────────────┐    ┌─────────────────┐
        │     Stripe      │    │   External APIs │
        │   (Paiements)   │    │   (Maps, etc.)  │
        └─────────────────┘    └─────────────────┘
```

## Composants Principaux

### 1. Frontend Web (Next.js)

**Technologies :**
- Next.js 14 avec App Router
- TypeScript
- Tailwind CSS
- React Query (TanStack Query)
- React Hook Form + Zod
- Framer Motion
- Mapbox GL

**Structure :**
```
frontend/
├── app/                    # App Router (Next.js 14)
│   ├── (auth)/            # Routes d'authentification
│   ├── (dashboard)/       # Routes du tableau de bord
│   ├── events/            # Routes des événements
│   └── layout.tsx         # Layout principal
├── components/            # Composants réutilisables
│   ├── ui/               # Composants UI de base
│   ├── forms/            # Composants de formulaires
│   └── layout/           # Composants de mise en page
├── lib/                  # Utilitaires et configurations
├── hooks/                # Hooks personnalisés
└── types/                # Types TypeScript
```

### 2. Backend API (.NET Core)

**Technologies :**
- .NET Core 8
- Entity Framework Core
- PostgreSQL (via Supabase)
- JWT Authentication
- AutoMapper
- FluentValidation
- Swagger/OpenAPI

**Architecture :**
```
backend/
├── KomOn.API/            # Couche présentation
│   ├── Controllers/      # Contrôleurs API
│   ├── Middleware/       # Middleware personnalisé
│   └── Program.cs        # Point d'entrée
├── KomOn.Core/           # Couche domaine
│   ├── Entities/         # Entités du domaine
│   ├── Interfaces/       # Interfaces des services
│   └── DTOs/            # Objets de transfert
├── KomOn.Infrastructure/ # Couche infrastructure
│   ├── Data/            # Contexte EF et migrations
│   ├── Services/        # Implémentation des services
│   └── Repositories/    # Repositories
└── KomOn.Tests/         # Tests unitaires et d'intégration
```

### 3. Application Mobile (React Native)

**Technologies :**
- React Native avec Expo
- TypeScript
- React Navigation
- React Query
- React Native Maps
- Expo Location
- Stripe React Native

**Structure :**
```
mobile/
├── src/
│   ├── components/       # Composants réutilisables
│   ├── screens/          # Écrans de l'application
│   ├── navigation/       # Configuration de navigation
│   ├── services/         # Services API
│   ├── hooks/           # Hooks personnalisés
│   └── utils/           # Utilitaires
├── assets/              # Images, icônes, etc.
└── app.json            # Configuration Expo
```

## Base de Données

### Modèle de Données

```sql
-- Utilisateurs
Users (
  Id, FirstName, LastName, Email, PasswordHash,
  PhoneNumber, DateOfBirth, Bio, ProfilePictureUrl,
  Role, Status, CreatedAt, UpdatedAt
)

-- Sports
Sports (
  Id, Name, Description, IconUrl, IsActive,
  CreatedAt, UpdatedAt
)

-- Événements
Events (
  Id, Title, Description, StartDate, EndDate,
  Location, Latitude, Longitude, SportId, OrganizerId,
  MaxParticipants, Price, Status, Type, DifficultyLevel,
  Requirements, ImageUrl, CreatedAt, UpdatedAt
)

-- Inscriptions aux événements
EventRegistrations (
  Id, EventId, UserId, Status, RegistrationDate,
  PaymentAmount, PaymentId, PaymentStatus, Notes,
  CreatedAt, UpdatedAt
)

-- Sports des utilisateurs
UserSports (
  Id, UserId, SportId, SkillLevel, IsFavorite,
  CreatedAt, UpdatedAt
)

-- Messages
Messages (
  Id, SenderId, ReceiverId, Content, Type,
  IsRead, ReadAt, EventId, CreatedAt, UpdatedAt
)
```

### Relations

- **User** ↔ **Event** (1:N) - Un utilisateur peut organiser plusieurs événements
- **User** ↔ **EventRegistration** (1:N) - Un utilisateur peut s'inscrire à plusieurs événements
- **Event** ↔ **EventRegistration** (1:N) - Un événement peut avoir plusieurs inscriptions
- **User** ↔ **UserSport** (1:N) - Un utilisateur peut pratiquer plusieurs sports
- **Sport** ↔ **UserSport** (1:N) - Un sport peut être pratiqué par plusieurs utilisateurs
- **User** ↔ **Message** (1:N) - Un utilisateur peut envoyer/recevoir plusieurs messages

## Services Externes

### 1. Supabase
- Base de données PostgreSQL
- Authentification et autorisation
- Storage pour les fichiers
- Real-time subscriptions

### 2. Stripe
- Paiements en ligne
- Gestion des abonnements
- Remboursements
- Rapports financiers

### 3. Mapbox
- Cartes interactives
- Géolocalisation
- Recherche d'adresses
- Calcul d'itinéraires

### 4. Scaleway
- Hébergement cloud
- Load balancing
- CDN
- Monitoring

## Sécurité

### Authentification
- JWT tokens avec refresh
- Hachage des mots de passe (BCrypt)
- Authentification multi-facteurs (optionnel)
- Sessions sécurisées

### Autorisation
- Rôles utilisateurs (Participant, Organizer, Municipality, Admin)
- Permissions granulaires
- Middleware d'autorisation

### Protection des Données
- Chiffrement en transit (HTTPS/TLS)
- Chiffrement au repos
- Validation des entrées
- Protection contre les injections SQL
- Rate limiting

## Performance

### Optimisations Frontend
- Code splitting automatique (Next.js)
- Lazy loading des composants
- Optimisation des images
- Service Worker pour le cache
- Bundle analysis

### Optimisations Backend
- Pagination des résultats
- Mise en cache Redis
- Optimisation des requêtes EF Core
- Compression des réponses
- Connection pooling

### Monitoring
- Logs structurés
- Métriques de performance
- Alertes automatiques
- Health checks

## Déploiement

### Environnements
- **Development** : Docker Compose local
- **Staging** : Environnement de test automatisé
- **Production** : Scaleway avec load balancing

### CI/CD
- GitHub Actions
- Tests automatisés
- Build et déploiement automatiques
- Rollback automatique en cas d'erreur

### Infrastructure as Code
- Docker Compose pour le développement
- Terraform pour la production
- Configuration centralisée

## Évolutivité

### Horizontal Scaling
- Load balancing automatique
- Base de données en cluster
- Cache distribué
- Microservices ready

### Vertical Scaling
- Ressources cloud élastiques
- Auto-scaling basé sur la charge
- Monitoring des performances

## Maintenance

### Backups
- Sauvegarde automatique quotidienne
- Rétention de 30 jours
- Tests de restauration

### Updates
- Mises à jour de sécurité automatiques
- Déploiement sans interruption
- Versioning sémantique

### Support
- Documentation complète
- Guides de dépannage
- Support utilisateur intégré 