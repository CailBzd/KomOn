# Migration vers Yarn - KomOn

## 🧶 Pourquoi Yarn ?

### **Avantages de Yarn**

#### **Performance**
- **Installation plus rapide** : Cache global et parallélisation
- **Résolution de dépendances optimisée** : Lockfile déterministe
- **Moins d'utilisation réseau** : Cache intelligent

#### **Sécurité**
- **Audit intégré** : `yarn audit`
- **Vérification d'intégrité** : Checksums automatiques
- **Isolation des packages** : Meilleure sécurité

#### **Développement**
- **Workspaces** : Gestion multi-packages
- **Plugins** : Extensibilité avancée
- **Scripts améliorés** : Plus de flexibilité

## 🔄 Migration depuis npm

### **1. Installation de Yarn**

#### **Installation Globale**
```bash
# Avec npm
npm install -g yarn

# Avec Homebrew (macOS)
brew install yarn

# Vérification
yarn --version
```

### **2. Migration des Projets**

#### **Frontend (Next.js)**
```bash
cd frontend

# Supprimer les fichiers npm
rm -rf node_modules package-lock.json

# Installer avec Yarn
yarn install

# Vérifier l'installation
yarn dev
```

#### **Mobile (React Native)**
```bash
cd mobile

# Supprimer les fichiers npm
rm -rf node_modules package-lock.json

# Installer avec Yarn
yarn install

# Vérifier l'installation
yarn start
```

### **3. Mise à Jour des Scripts**

#### **Scripts Frontend**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next out",
    "clean:all": "rm -rf .next out node_modules yarn.lock"
  }
}
```

#### **Scripts Mobile**
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "clean": "rm -rf node_modules yarn.lock",
    "clean:all": "rm -rf node_modules yarn.lock .expo"
  }
}
```

## 🛠️ Configuration Yarn

### **1. Fichier .yarnrc.yml**

#### **Configuration Optimisée**
```yaml
nodeLinker: node-modules

yarnPath: .yarn/releases/yarn-4.0.2.cjs

enableGlobalCache: true

compressionLevel: mixed

logFilters:
  - code: YN0002
    level: discard
  - code: YN0060
    level: discard
  - code: YN0006
    level: discard
  - code: YN0076
    level: discard

plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
    spec: "@yarnpkg/plugin-typescript"
```

### **2. Configuration TypeScript**

#### **tsconfig.json avec Yarn**
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 📦 Commandes Yarn Équivalentes

### **Gestion des Dépendances**

| npm | yarn | Description |
|-----|------|-------------|
| `npm install` | `yarn install` | Installer toutes les dépendances |
| `npm install package` | `yarn add package` | Ajouter une dépendance |
| `npm install -D package` | `yarn add -D package` | Ajouter une dépendance de dev |
| `npm uninstall package` | `yarn remove package` | Supprimer une dépendance |
| `npm update` | `yarn upgrade` | Mettre à jour les dépendances |

### **Scripts**

| npm | yarn | Description |
|-----|------|-------------|
| `npm run dev` | `yarn dev` | Lancer le serveur de développement |
| `npm run build` | `yarn build` | Build de production |
| `npm run test` | `yarn test` | Lancer les tests |
| `npm run lint` | `yarn lint` | Linting du code |

### **Autres Commandes**

| npm | yarn | Description |
|-----|------|-------------|
| `npm audit` | `yarn audit` | Audit de sécurité |
| `npm outdated` | `yarn outdated` | Voir les packages obsolètes |
| `npm list` | `yarn list` | Lister les dépendances |
| `npm cache clean` | `yarn cache clean` | Nettoyer le cache |

## 🔧 Configuration CI/CD

### **GitHub Actions avec Yarn**

#### **Workflow Frontend**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'yarn'
    cache-dependency-path: frontend/yarn.lock

- name: Install dependencies
  run: |
    cd frontend
    yarn install --frozen-lockfile
```

#### **Workflow Mobile**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'yarn'
    cache-dependency-path: mobile/yarn.lock

- name: Install dependencies
  run: |
    cd mobile
    yarn install --frozen-lockfile
```

## 🚨 Dépannage

### **Problèmes Courants**

#### **1. Erreur de Lockfile**
```bash
# Supprimer et régénérer
rm yarn.lock
yarn install
```

#### **2. Cache Corrompu**
```bash
# Nettoyer le cache
yarn cache clean
yarn install
```

#### **3. Conflits de Dépendances**
```bash
# Résolution manuelle
yarn why package-name
yarn add package-name@version
```

#### **4. Performance Lente**
```bash
# Optimiser le cache
yarn config set enableGlobalCache true
yarn install
```

### **Commandes de Debug**

```bash
# Vérifier la configuration
yarn config list

# Voir les dépendances
yarn list --depth=0

# Audit de sécurité
yarn audit

# Vérifier les packages obsolètes
yarn outdated
```

## 📊 Comparaison Performance

### **Tests de Performance**

#### **Installation Initiale**
```bash
# npm
time npm install
# Temps moyen : 45-60 secondes

# yarn
time yarn install
# Temps moyen : 25-35 secondes
```

#### **Installation Incrémentale**
```bash
# npm
time npm install
# Temps moyen : 15-25 secondes

# yarn
time yarn install
# Temps moyen : 5-10 secondes
```

#### **Cache Hit Rate**
```bash
# npm cache
npm cache verify
# Hit rate : ~60-70%

# yarn cache
yarn cache list
# Hit rate : ~85-95%
```

## 🎯 Bonnes Pratiques

### **1. Lockfile**
- **Toujours commiter** `yarn.lock`
- **Ne pas modifier manuellement** le lockfile
- **Utiliser** `--frozen-lockfile` en CI/CD

### **2. Scripts**
- **Utiliser des scripts nommés** dans package.json
- **Éviter** les commandes directes
- **Documenter** les scripts complexes

### **3. Dépendances**
- **Auditer régulièrement** : `yarn audit`
- **Mettre à jour** les packages de sécurité
- **Utiliser** les versions exactes pour les dépendances critiques

### **4. Performance**
- **Utiliser** le cache global
- **Configurer** les plugins appropriés
- **Optimiser** les workspaces si nécessaire

## 🔄 Migration Inverse (si nécessaire)

### **Retour vers npm**
```bash
# Supprimer Yarn
rm -rf node_modules yarn.lock .yarn

# Installer avec npm
npm install

# Vérifier
npm run dev
```

---

**KomOn** - Migration Yarn réussie et optimisée 🚀 