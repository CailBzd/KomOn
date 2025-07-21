# Guide de Déploiement KomOn

Ce document décrit le processus de déploiement pour les trois composants de KomOn : Frontend, API et Mobile.

## Architecture de Déploiement

```
komon.ptilab.fr (Frontend Next.js)
    ↓
api.komon.ptilab.fr (API .NET)
    ↓
Mobile App (Expo/React Native)
```

## Prérequis Serveur

### Système
- Ubuntu 20.04+ ou Debian 11+
- .NET 8.0 SDK
- Node.js 18+
- Yarn
- Nginx
- Certbot (Let's Encrypt)

### Utilisateurs et Permissions
```bash
# Créer l'utilisateur pour l'application
sudo useradd -r -s /bin/false www-data
sudo usermod -aG www-data $USER

# Créer les répertoires
sudo mkdir -p /var/www/komon.ptilab.fr
sudo mkdir -p /var/www/api.komon.ptilab.fr
sudo chown -R www-data:www-data /var/www/komon.ptilab.fr
sudo chown -R www-data:www-data /var/www/api.komon.ptilab.fr
```

## 1. Déploiement Frontend

### Configuration Serveur
```bash
# Installer Node.js et Yarn
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g yarn

# Cloner le projet
cd /var/www
sudo git clone https://github.com/votre-repo/KomOn.git komon.ptilab.fr
cd komon.ptilab.fr
sudo chown -R www-data:www-data .

# Installer les dépendances
cd frontend
yarn install --frozen-lockfile

# Build de production
yarn build
```

### Configuration Nginx
```bash
# Copier la configuration
sudo cp config/nginx/komon-frontend.conf /etc/nginx/sites-available/komon-frontend
sudo ln -s /etc/nginx/sites-available/komon-frontend /etc/nginx/sites-enabled/

# Tester et redémarrer nginx
sudo nginx -t
sudo systemctl reload nginx
```

### SSL avec Let's Encrypt
```bash
# Installer certbot
sudo apt install certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d komon.ptilab.fr

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 2. Déploiement API

### Configuration Serveur
```bash
# Installer .NET 8.0
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Cloner le projet
cd /var/www
sudo git clone https://github.com/votre-repo/KomOn.git api.komon.ptilab.fr
cd api.komon.ptilab.fr
sudo chown -R www-data:www-data .

# Restaurer et build
cd backend
dotnet restore
dotnet build --configuration Release
dotnet publish KomOn.API/KomOn.API.csproj -c Release -o ./bin/Release/net8.0/publish
```

### Configuration Systemd
```bash
# Copier le service
sudo cp config/systemd/komon-api.service /etc/systemd/system/

# Activer et démarrer le service
sudo systemctl daemon-reload
sudo systemctl enable komon-api
sudo systemctl start komon-api
```

### Configuration Nginx
```bash
# Copier la configuration
sudo cp config/nginx/komon-api.conf /etc/nginx/sites-available/komon-api
sudo ln -s /etc/nginx/sites-available/komon-api /etc/nginx/sites-enabled/

# SSL
sudo certbot --nginx -d api.komon.ptilab.fr

# Redémarrer nginx
sudo systemctl reload nginx
```

## 3. Configuration Scaleway

### Récupération des Clés
```bash
# Exécuter le script pour obtenir les informations Scaleway
./scripts/get-scaleway-keys.sh

# Ou manuellement :
# 1. Allez sur https://console.scaleway.com/iam/api-keys
# 2. Créez ou sélectionnez vos clés API
# 3. Copiez les clés d'accès et secrètes
```

### Configuration Automatique des Secrets
```bash
# Configurer automatiquement les secrets GitHub
./scripts/setup-github-secrets.sh votre-username/KomOn

# Ou manuellement via l'interface GitHub :
# https://github.com/votre-username/KomOn/settings/secrets/actions
```

## 4. Déploiement Mobile
```bash
# Installer Expo CLI
npm install -g @expo/cli

# Login à Expo
expo login

# Build pour les stores
cd mobile
expo build:android --platform android
expo build:ios --platform ios
```

## Variables d'Environnement

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.komon.ptilab.fr/api
NEXT_PUBLIC_SCALEWAY_PROJECT_ID=849d4454-a4c4-4704-9908-44e1f7954f8b
NEXT_PUBLIC_SCALEWAY_REGION=fr-par
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoi...
```

### API (appsettings.Production.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=komon;Username=komon;Password=${DB_PASSWORD}"
  },
  "Jwt": {
    "Secret": "${JWT_SECRET}",
    "Issuer": "komon.ptilab.fr",
    "Audience": "komon.ptilab.fr",
    "ExpiryInDays": 7
  },
  "Scaleway": {
    "ProjectId": "849d4454-a4c4-4704-9908-44e1f7954f8b",
    "AccessKey": "${SCALEWAY_ACCESS_KEY}",
    "SecretKey": "${SCALEWAY_SECRET_KEY}",
    "Region": "fr-par",
    "DatabaseUrl": "${SCALEWAY_DATABASE_URL}"
  }
}
```

## CI/CD GitHub Actions

### Secrets Requis
- `DEPLOY_HOST`: Adresse IP du serveur
- `DEPLOY_USER`: Utilisateur SSH
- `DEPLOY_SSH_KEY`: Clé SSH privée
- `DEPLOY_PORT`: Port SSH (22)
- `API_DEPLOY_HOST`: Adresse IP du serveur API
- `API_DEPLOY_USER`: Utilisateur SSH API
- `API_DEPLOY_SSH_KEY`: Clé SSH privée API
- `API_DEPLOY_PORT`: Port SSH API
- `EXPO_TOKEN`: Token Expo pour les builds mobile
- `NEXT_PUBLIC_API_URL`: URL de l'API
- `NEXT_PUBLIC_SCALEWAY_PROJECT_ID`: ID du projet Scaleway
- `NEXT_PUBLIC_SCALEWAY_REGION`: Région Scaleway
- `SCALEWAY_ACCESS_KEY`: Clé d'accès Scaleway
- `SCALEWAY_SECRET_KEY`: Clé secrète Scaleway
- `SCALEWAY_DATABASE_URL`: URL base de données PostgreSQL
- `JWT_SECRET`: Clé secrète JWT
- `DB_PASSWORD`: Mot de passe base de données
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Clé Stripe
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Token Mapbox

### Déclenchement
- **Frontend**: Push sur `main` ou `develop` avec modifications dans `frontend/`
- **API**: Push sur `main` ou `develop` avec modifications dans `backend/`
- **Mobile**: Push sur `main` ou `develop` avec modifications dans `mobile/`

## Scripts de Déploiement

### Frontend
```bash
# Déploiement manuel
./scripts/deploy-frontend.sh production

# Déploiement automatique via CI/CD
# Se déclenche automatiquement sur push
```

### API
```bash
# Déploiement manuel
./scripts/deploy-api.sh production

# Déploiement automatique via CI/CD
# Se déclenche automatiquement sur push
```

## Monitoring et Logs

### Logs Nginx
```bash
# Frontend
sudo tail -f /var/log/nginx/komon-frontend.access.log
sudo tail -f /var/log/nginx/komon-frontend.error.log

# API
sudo tail -f /var/log/nginx/komon-api.access.log
sudo tail -f /var/log/nginx/komon-api.error.log
```

### Logs API
```bash
# Service systemd
sudo journalctl -u komon-api -f

# Application
sudo tail -f /var/www/api.komon.ptilab.fr/logs/app.log
```

### Health Checks
```bash
# Frontend
curl https://komon.ptilab.fr/health

# API
curl https://api.komon.ptilab.fr/health
```

## Maintenance

### Sauvegardes
Les scripts de déploiement créent automatiquement des sauvegardes dans :
- `/var/www/komon.ptilab.fr/backups/`
- `/var/www/api.komon.ptilab.fr/backups/`

### Mise à Jour
```bash
# Frontend
cd /var/www/komon.ptilab.fr
git pull origin main
cd frontend
yarn install --frozen-lockfile
yarn build
sudo systemctl reload nginx

# API
cd /var/www/api.komon.ptilab.fr
git pull origin main
dotnet restore
dotnet build --configuration Release
sudo systemctl restart komon-api
```

## Sécurité

### Firewall
```bash
# Ouvrir uniquement les ports nécessaires
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### Mise à Jour Système
```bash
# Mise à jour automatique
sudo apt update && sudo apt upgrade -y
```

## Support

En cas de problème :
1. Vérifier les logs : `sudo journalctl -u komon-api -f`
2. Tester les health checks
3. Vérifier la configuration nginx : `sudo nginx -t`
4. Redémarrer les services si nécessaire 