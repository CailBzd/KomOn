yarn insl# KomOn - Plateforme d'Organisation d'Événements Sportifs Locaux

## 🏃‍♂️ À propos

KomOn est une plateforme complète qui facilite la connexion entre les amateurs de sports locaux, les organisateurs d'événements, et les municipalités. Elle permet aux utilisateurs de découvrir, s'inscrire et participer à divers événements sportifs dans leur région.

## 🎯 Objectifs

- **Faciliter la découverte** et la participation aux événements sportifs
- **Offrir une solution complète** de gestion d'événements aux organisateurs
- **Encourager l'engagement communautaire** et un mode de vie actif

## 🏗️ Architecture

```
KomOn/
├── backend/                 # API .NET Core
├── frontend/                # Application Next.js
├── mobile/                  # Application React Native
├── docs/                    # Documentation
├── scripts/                 # Scripts de déploiement
└── infrastructure/          # Configuration infrastructure
```

## 🛠️ Technologies

### Backend
- **.NET Core 8** - API robuste et scalable
- **Entity Framework Core** - ORM pour la base de données
- **JWT Authentication** - Authentification sécurisée

### Frontend Web
- **Next.js 14** - Framework React avec SSR
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling moderne
- **React Query** - Gestion d'état serveur

### Application Mobile
- **React Native** - Application multiplateforme
- **Expo** - Outils de développement

### Base de Données & Services
- **Supabase** - Base de données PostgreSQL
- **Stripe** - Paiements en ligne
- **Scaleway** - Hébergement cloud

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerisation

## 🚀 Démarrage Rapide

### Prérequis
- .NET 8 SDK
- Node.js 18+
- Yarn (recommandé) ou npm
- Docker
- Compte Supabase
- Compte Stripe

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd KomOn
```

2. **Backend (.NET Core)**
```bash
cd backend
dotnet restore
dotnet run
```

3. **Frontend (Next.js)**
```bash
cd frontend
yarn install
yarn dev
```

4. **Mobile (React Native)**
```bash
cd mobile
yarn install
yarn start
```

## 📋 Fonctionnalités

### Pour les Participants
- ✅ Inscription et gestion de profil
- ✅ Recherche et inscription aux événements
- ✅ Paiement en ligne
- ✅ Messagerie intégrée
- ✅ Notifications en temps réel

### Pour les Organisateurs
- ✅ Création et gestion d'événements
- ✅ Tableau de bord analytique
- ✅ Gestion des inscriptions
- ✅ Communication avec participants

### Pour les Municipalités
- ✅ Gestion des lieux publics
- ✅ Partenariats et promotion
- ✅ Statistiques locales

## 💰 Modèle Économique

- **Abonnements premium** - Fonctionnalités avancées
- **Frais de participation** - Commission sur événements
- **Publicité locale** - Partenariats entreprises
- **Services municipaux** - Solutions sur mesure

## 📅 Planning

- **Phase 1** (1 mois) : Recherche et analyse
- **Phase 2** (4 mois) : Développement
- **Phase 3** (1 mois) : Tests et validation
- **Phase 4** (1 mois) : Lancement et marketing

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

- **Email** : contact@komon.fr
- **Site Web** : https://komon.fr
- **Documentation** : https://docs.komon.fr

---

**KomOn** - Connecter les passionnés de sport local 🏆 