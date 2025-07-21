#!/bin/bash

# Script de déploiement pour le frontend KomOn
# Usage: ./scripts/deploy-frontend.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/komon.ptilab.fr"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKUP_DIR="$PROJECT_DIR/backups"

echo "🚀 Déploiement du frontend KomOn - Environnement: $ENVIRONMENT"

# Créer les dossiers nécessaires
mkdir -p "$BACKUP_DIR"

# Sauvegarder la version actuelle
if [ -d "$FRONTEND_DIR/.next" ]; then
    echo "📦 Sauvegarde de la version actuelle..."
    tar -czf "$BACKUP_DIR/frontend-backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$FRONTEND_DIR" .next
fi

# Aller dans le répertoire du projet
cd "$PROJECT_DIR"

# Pull des dernières modifications
echo "📥 Récupération des dernières modifications..."
git pull origin main

# Aller dans le répertoire frontend
cd "$FRONTEND_DIR"

# Installer les dépendances
echo "📦 Installation des dépendances..."
yarn install --frozen-lockfile --production=false

# Build de l'application
echo "🔨 Build de l'application..."
yarn build

# Vérifier que le build s'est bien passé
if [ ! -d ".next" ]; then
    echo "❌ Erreur: Le build a échoué"
    exit 1
fi

# Redémarrer le service nginx
echo "🔄 Redémarrage de nginx..."
sudo systemctl reload nginx

# Vérifier le statut de nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx redémarré avec succès"
else
    echo "❌ Erreur: Nginx n'a pas pu redémarrer"
    exit 1
fi

echo "🎉 Déploiement du frontend terminé avec succès!"
echo "🌐 Site accessible sur: https://komon.ptilab.fr" 