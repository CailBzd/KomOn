# Guide de Setup KomOn

## 🚀 Installation et Configuration

### Prérequis Système

#### **Développement Backend (.NET)**
- **.NET 8 SDK** : [Télécharger](https://dotnet.microsoft.com/download/dotnet/8.0)
- **IDE recommandé** : Visual Studio 2022 ou JetBrains Rider
- **Base de données** : PostgreSQL 15+

#### **Développement Frontend (Next.js)**
- **Node.js 18+** : [Télécharger](https://nodejs.org/)
- **Yarn** (recommandé) : `npm install -g yarn`
- **IDE recommandé** : VS Code avec extensions TypeScript/React

#### **Développement Mobile (React Native)**
- **Node.js 18+**
- **Yarn** (recommandé)
- **Expo CLI** : `yarn global add @expo/cli`
- **Android Studio** (pour Android)
- **Xcode** (pour iOS, macOS uniquement)

### 🛠️ Installation Rapide

#### **1. Cloner le Repository**
```bash
git clone <repository-url>
cd KomOn
```

#### **2. Configuration Backend**
```bash
cd backend

# Restaurer les packages
dotnet restore

# Créer la base de données
dotnet ef database update

# Lancer l'API
dotnet run --project KomOn.API
```

#### **3. Configuration Frontend**
```bash
cd frontend

# Installer les dépendances
yarn install

# Copier les variables d'environnement
cp env.example .env.local

# Lancer le serveur de développement
yarn dev
```

#### **4. Configuration Mobile**
```bash
cd mobile

# Installer les dépendances
yarn install

# Lancer Expo
yarn start
```

### 📁 Structure du Projet

```
KomOn/
├── backend/                 # API .NET Core
│   ├── KomOn.API/          # Contrôleurs et configuration
│   ├── KomOn.Core/         # Entités et interfaces
│   └── KomOn.Infrastructure/ # Services et données
├── frontend/               # Application Next.js
│   ├── app/               # App Router (Next.js 14)
│   ├── components/        # Composants React
│   └── lib/              # Utilitaires et thème
├── mobile/                # Application React Native
│   ├── src/              # Code source
│   └── assets/           # Images et ressources
└── docs/                 # Documentation
```

### 🔧 Configuration des Variables d'Environnement

#### **Frontend (.env.local)**
```bash
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoi...

# Autres
NODE_ENV=development
```

#### **Backend (appsettings.Development.json)**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=komon;Username=komon_user;Password=komon_password"
  },
  "JWT": {
    "SecretKey": "your-super-secret-jwt-key",
    "Issuer": "KomOn",
    "Audience": "KomOnUsers",
    "ExpirationHours": 24
  },
  "Stripe": {
    "SecretKey": "sk_test_...",
    "PublishableKey": "pk_test_..."
  }
}
```

### 🐳 Docker (Optionnel)

#### **Lancer avec Docker Compose**
```bash
# Construire et démarrer tous les services
docker-compose up --build

# Services disponibles :
# - API : http://localhost:5000
# - Frontend : http://localhost:3000
# - Mobile : http://localhost:19000
# - PostgreSQL : localhost:5432
# - Redis : localhost:6379
```

### 📱 Développement Mobile

#### **Android**
```bash
cd mobile
yarn android
```

#### **iOS** (macOS uniquement)
```bash
cd mobile
yarn ios
```

#### **Web**
```bash
cd mobile
yarn web
```

### 🧪 Tests

#### **Backend**
```bash
cd backend
dotnet test
```

#### **Frontend**
```bash
cd frontend
yarn test
yarn test:watch
```

#### **Mobile**
```bash
cd mobile
yarn test
```

### 🔍 Scripts Utiles

#### **Frontend**
```bash
yarn dev          # Développement
yarn build        # Production build
yarn start        # Serveur de production
yarn lint         # Linting
yarn type-check   # Vérification TypeScript
yarn clean        # Nettoyer les builds
```

#### **Mobile**
```bash
yarn start        # Démarrer Expo
yarn android      # Android
yarn ios          # iOS
yarn web          # Web
yarn clean        # Nettoyer
```

### 🚨 Dépannage

#### **Problèmes Courants**

**1. Erreur de dépendances**
```bash
# Nettoyer et réinstaller
yarn clean:all
yarn install
```

**2. Erreur de port**
```bash
# Vérifier les ports utilisés
lsof -i :3000
lsof -i :5000
```

**3. Erreur de base de données**
```bash
# Recréer la base de données
cd backend
dotnet ef database drop
dotnet ef database update
```

**4. Erreur Expo**
```bash
# Nettoyer le cache Expo
cd mobile
yarn clean
expo r -c
```

### 📊 Monitoring et Debug

#### **Frontend**
- **React DevTools** : Extension navigateur
- **Next.js Analytics** : Intégré dans l'application
- **Console** : Logs de développement

#### **Backend**
- **Swagger UI** : http://localhost:5000/swagger
- **Logs** : Console et fichiers
- **Debugger** : Visual Studio/Rider

#### **Mobile**
- **Expo DevTools** : http://localhost:19002
- **React Native Debugger** : Application standalone
- **Flipper** : Outil de debugging avancé

### 🔄 Workflow de Développement

#### **1. Développement Local**
```bash
# Terminal 1 - Backend
cd backend && dotnet run

# Terminal 2 - Frontend
cd frontend && yarn dev

# Terminal 3 - Mobile
cd mobile && yarn start
```

#### **2. Tests et Validation**
```bash
# Tests unitaires
yarn test

# Tests d'intégration
yarn test:integration

# Linting et formatage
yarn lint
yarn format
```

#### **3. Build et Déploiement**
```bash
# Build de production
yarn build

# Tests de production
yarn test:prod

# Déploiement
yarn deploy
```

### 📚 Ressources Additionnelles

- **Documentation .NET** : https://docs.microsoft.com/dotnet/
- **Documentation Next.js** : https://nextjs.org/docs
- **Documentation Expo** : https://docs.expo.dev/
- **Documentation Chakra UI** : https://chakra-ui.com/
- **Documentation Yarn** : https://yarnpkg.com/

---

**KomOn** - Setup rapide et efficace pour le développement 🚀 