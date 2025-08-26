# KomOn Web Application

Application web PWA (Progressive Web App) pour organiser et participer à des événements sportifs.

## 🚀 Fonctionnalités

- **Authentification complète** : Connexion, inscription, récupération de mot de passe
- **Tableau de bord personnalisé** : Vue d'ensemble des activités et statistiques
- **Gestion des événements** : Création, recherche et participation
- **Profil utilisateur** : Gestion des informations personnelles
- **Système de crédits** : Gestion du solde pour participer aux événements
- **Interface responsive** : Optimisée pour mobile, tablette et desktop
- **Thème sombre/clair** : Basculement automatique selon les préférences système
- **PWA** : Installation sur l'écran d'accueil et fonctionnement hors ligne

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Navigation** : React Router DOM
- **Formulaires** : React Hook Form + Zod
- **État global** : Context API React
- **Requêtes API** : Axios + React Query
- **Icônes** : Lucide React
- **Build** : Vite + PWA Plugin

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Backend KomOn API en cours d'exécution

## 🔧 Installation

1. **Cloner le projet**
   ```bash
   cd web-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuration de l'environnement**
   Créer un fichier `.env.local` :
   ```env
   VITE_API_URL=http://192.168.1.197:5000/api
   ```

4. **Lancer l'application en mode développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Ouvrir dans le navigateur**
   L'application sera accessible sur `http://localhost:3001`

## 🏗️ Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── Header.tsx      # En-tête avec navigation et thème
│   ├── Layout.tsx      # Layout principal avec sidebar
│   ├── NavigationBar.tsx # Barre de navigation latérale
│   └── ProtectedRoute.tsx # Protection des routes authentifiées
├── contexts/           # Contextes React
│   ├── AuthContext.tsx # Gestion de l'authentification
│   └── ThemeContext.tsx # Gestion du thème
├── pages/              # Pages de l'application
│   ├── auth/           # Pages d'authentification
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   └── main/           # Pages principales
│       ├── DashboardPage.tsx
│       ├── EventsPage.tsx
│       ├── CreateEventPage.tsx
│       ├── MyEventsPage.tsx
│       ├── ProfilePage.tsx
│       └── CreditsPage.tsx
├── services/           # Services API
│   └── authService.ts  # Service d'authentification
├── App.tsx             # Composant racine
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🔐 Authentification

L'application utilise un système d'authentification JWT avec stockage local :

- **Connexion** : Email + mot de passe
- **Inscription** : Formulaire complet avec validation
- **Récupération de mot de passe** : Envoi d'email de réinitialisation
- **Persistance** : Token stocké dans localStorage
- **Protection des routes** : Redirection automatique vers la connexion

## 🎨 Thèmes

- **Thème clair** : Interface claire par défaut
- **Thème sombre** : Interface sombre pour les environnements à faible luminosité
- **Détection automatique** : Basculement selon les préférences système
- **Persistance** : Choix sauvegardé dans localStorage

## 📱 PWA (Progressive Web App)

L'application est configurée comme une PWA avec :

- **Manifest** : Métadonnées pour l'installation
- **Service Worker** : Mise en cache et fonctionnement hors ligne
- **Installation** : Bouton d'ajout à l'écran d'accueil
- **Responsive** : Optimisée pour tous les appareils

## 🚀 Déploiement

### Build de production
```bash
npm run build
# ou
yarn build
```

### Prévisualisation du build
```bash
npm run preview
# ou
yarn preview
```

### Variables d'environnement de production
```env
VITE_API_URL=http://192.168.1.197:5000/api
```

## 🔗 Intégration avec le frontend existant

Pour intégrer cette application avec votre site de présentation existant, ajoutez un bouton "Accéder à l'application" qui redirige vers l'URL de l'application web.

Exemple d'intégration :
```html
<a href="https://app.komon.com" class="btn-primary">
  Accéder à l'application
</a>
```

## 🧪 Tests

```bash
npm run lint
# ou
yarn lint
```

## 📝 Notes de développement

- L'application est conçue pour être responsive et accessible
- Les composants utilisent Tailwind CSS pour un styling cohérent
- L'état est géré via les Contextes React pour une architecture simple
- Les formulaires utilisent React Hook Form avec validation Zod
- L'API est configurée pour fonctionner avec votre backend existant

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 