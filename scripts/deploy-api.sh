#!/bin/bash

# Script de déploiement pour l'API KomOn
# Usage: ./scripts/deploy-api.sh [environment]

set -e

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/api.komon.ptilab.fr"
BACKUP_DIR="$PROJECT_DIR/backups"

echo "🚀 Déploiement de l'API KomOn - Environnement: $ENVIRONMENT"

# Créer les dossiers nécessaires
mkdir -p "$BACKUP_DIR"

# Sauvegarder la version actuelle
if [ -d "$PROJECT_DIR/bin" ]; then
    echo "📦 Sauvegarde de la version actuelle..."
    tar -czf "$BACKUP_DIR/api-backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$PROJECT_DIR" bin obj
fi

# Aller dans le répertoire du projet
cd "$PROJECT_DIR"

# Pull des dernières modifications
echo "📥 Récupération des dernières modifications..."
git pull origin main

# Restaurer les dépendances
echo "📦 Restauration des dépendances..."
dotnet restore

# Build de l'application
echo "🔨 Build de l'application..."
dotnet build --configuration Release --no-restore

# Publier l'application
echo "📤 Publication de l'application..."
dotnet publish KomOn.API/KomOn.API.csproj -c Release -o ./bin/Release/net8.0/publish

# Redémarrer le service
echo "🔄 Redémarrage du service API..."
sudo systemctl restart komon-api

# Vérifier le statut du service
sleep 5
if systemctl is-active --quiet komon-api; then
    echo "✅ Service API redémarré avec succès"
else
    echo "❌ Erreur: Le service API n'a pas pu redémarrer"
    sudo systemctl status komon-api
    exit 1
fi

echo "🎉 Déploiement de l'API terminé avec succès!"
echo "🌐 API accessible sur: https://api.komon.ptilab.fr" 