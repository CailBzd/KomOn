#!/bin/bash

# Script pour récupérer les clés Scaleway du projet KomOn
# Usage: ./scripts/get-scaleway-keys.sh

set -e

PROJECT_ID="849d4454-a4c4-4704-9908-44e1f7954f8b"

echo "🔑 Récupération des clés Scaleway pour le projet $PROJECT_ID"
echo ""

# Vérifier que scaleway CLI est installé
if ! command -v scw &> /dev/null; then
    echo "❌ Scaleway CLI n'est pas installé"
    echo "Installez-le avec: curl -sL https://get.scaleway.com/install.sh | bash"
    exit 1
fi

echo "📋 Informations du projet Scaleway:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: fr-par"
echo ""

echo "🔐 Pour récupérer vos clés Scaleway:"
echo ""
echo "1. Allez sur https://console.scaleway.com/iam/api-keys"
echo "2. Créez une nouvelle clé API ou utilisez une existante"
echo "3. Copiez les informations suivantes:"
echo ""
echo "   📍 Project ID:"
echo "   $PROJECT_ID"
echo ""
echo "   🔑 Access Key:"
echo "   (copiez depuis l'interface Scaleway)"
echo ""
echo "   🔑 Secret Key:"
echo "   (copiez depuis l'interface Scaleway)"
echo ""
echo "4. Pour la base de données PostgreSQL:"
echo "   - Allez sur https://console.scaleway.com/rdb/instances"
echo "   - Créez ou sélectionnez votre instance PostgreSQL"
echo "   - Récupérez l'URL de connexion"
echo ""
echo "5. Utilisez ces clés dans vos secrets GitHub Actions:"
echo ""
echo "   NEXT_PUBLIC_SCALEWAY_PROJECT_ID=$PROJECT_ID"
echo "   NEXT_PUBLIC_SCALEWAY_REGION=fr-par"
echo "   SCALEWAY_ACCESS_KEY=votre-access-key"
echo "   SCALEWAY_SECRET_KEY=votre-secret-key"
echo "   SCALEWAY_DATABASE_URL=postgresql://username:password@host:port/database"
echo ""

echo "🚀 Pour configurer automatiquement les secrets GitHub:"
echo "   ./scripts/setup-github-secrets.sh"
echo ""
echo "📚 Documentation Scaleway:"
echo "   https://www.scaleway.com/en/docs/" 