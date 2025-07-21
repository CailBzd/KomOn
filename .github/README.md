# Pipelines CI/CD KomOn

Ce dossier contient les workflows GitHub Actions pour l'intégration et le déploiement continu des trois composants de KomOn.

## Structure des Pipelines

### 1. Frontend CI/CD (`frontend-deploy.yml`)
**Déclenchement** : Modifications dans `frontend/` ou `mobile/`
- **Tests** : Type checking, linting, tests unitaires
- **Build** : Build Next.js en mode production
- **Déploiement** : Déploiement automatique sur `komon.ptilab.fr`

### 2. API CI/CD (`api-deploy.yml`)
**Déclenchement** : Modifications dans `backend/`
- **Tests** : Build, tests unitaires .NET
- **Build** : Publication .NET en mode Release
- **Déploiement** : Déploiement automatique sur `api.komon.ptilab.fr`

### 3. Mobile CI/CD (`mobile-deploy.yml`)
**Déclenchement** : Modifications dans `mobile/`
- **Tests** : Type checking, linting
- **Build** : Build Expo pour Android et iOS
- **Déploiement** : Préparation pour les stores

## Configuration des Secrets

### Secrets Frontend
```yaml
DEPLOY_HOST: "votre-serveur.com"
DEPLOY_USER: "deploy"
DEPLOY_SSH_KEY: "-----BEGIN OPENSSH PRIVATE KEY-----..."
DEPLOY_PORT: "22"
NEXT_PUBLIC_API_URL: "https://api.komon.ptilab.fr/api"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_..."
NEXT_PUBLIC_MAPBOX_TOKEN: "pk.eyJ1Ijoi..."
```

### Secrets API
```yaml
API_DEPLOY_HOST: "votre-serveur-api.com"
API_DEPLOY_USER: "deploy"
API_DEPLOY_SSH_KEY: "-----BEGIN OPENSSH PRIVATE KEY-----..."
API_DEPLOY_PORT: "22"
```

### Secrets Mobile
```yaml
EXPO_TOKEN: "votre-token-expo"
```

## Workflow de Développement

### Branches
- `main` : Production
- `develop` : Développement/Staging
- `feature/*` : Nouvelles fonctionnalités

### Processus
1. **Développement** : Créer une branche feature
2. **Tests** : Les pipelines s'exécutent automatiquement sur les PR
3. **Merge** : Fusionner dans `develop` pour les tests
4. **Production** : Fusionner `develop` dans `main` pour le déploiement

## Monitoring des Pipelines

### Statuts
- ✅ **Succès** : Tests passés, déploiement réussi
- ❌ **Échec** : Tests échoués ou erreur de déploiement
- ⏳ **En cours** : Pipeline en cours d'exécution

### Logs
- **Actions** : Voir les logs dans l'onglet "Actions" de GitHub
- **Serveur** : Vérifier les logs sur le serveur de déploiement

## Dépannage

### Problèmes Courants

#### Pipeline Frontend
```bash
# Erreur de build
cd frontend
yarn install
yarn build

# Erreur de déploiement
ssh user@server
cd /var/www/komon.ptilab.fr
git pull
cd frontend && yarn build
sudo systemctl reload nginx
```

#### Pipeline API
```bash
# Erreur de build
cd backend
dotnet restore
dotnet build

# Erreur de déploiement
ssh user@server
cd /var/www/api.komon.ptilab.fr
git pull
dotnet restore && dotnet build
sudo systemctl restart komon-api
```

#### Pipeline Mobile
```bash
# Erreur de build Expo
cd mobile
yarn install
npx expo build:android --platform android
```

### Vérification des Services
```bash
# Statut des services
sudo systemctl status nginx
sudo systemctl status komon-api

# Logs en temps réel
sudo journalctl -u komon-api -f
sudo tail -f /var/log/nginx/komon-frontend.error.log
```

## Sécurité

### Bonnes Pratiques
- ✅ Utiliser des secrets GitHub pour les données sensibles
- ✅ Limiter les permissions SSH sur le serveur
- ✅ Utiliser HTTPS pour tous les déploiements
- ✅ Maintenir les dépendances à jour
- ❌ Ne jamais commiter de secrets dans le code

### Audit de Sécurité
```bash
# Vérifier les permissions
ls -la /var/www/komon.ptilab.fr/
ls -la /var/www/api.komon.ptilab.fr/

# Vérifier les certificats SSL
sudo certbot certificates

# Vérifier le firewall
sudo ufw status
```

## Support

Pour toute question ou problème :
1. Vérifier les logs GitHub Actions
2. Consulter la documentation de déploiement
3. Vérifier les logs serveur
4. Contacter l'équipe de développement 