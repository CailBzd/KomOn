#!/bin/bash

# Script pour configurer les secrets GitHub Actions pour KomOn
# Usage: ./scripts/setup-github-secrets.sh [REPO_OWNER/REPO_NAME]

set -e

REPO=${1:-"votre-username/KomOn"}

echo "🔧 Configuration des secrets GitHub Actions pour $REPO"
echo ""

# Vérifier que gh CLI est installé
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) n'est pas installé"
    echo "Installez-le depuis: https://cli.github.com/"
    exit 1
fi

# Vérifier l'authentification
if ! gh auth status &> /dev/null; then
    echo "❌ Vous n'êtes pas connecté à GitHub CLI"
    echo "Exécutez: gh auth login"
    exit 1
fi

echo "📝 Configuration des secrets..."
echo ""

# Secrets Frontend
echo "🔑 Configuration des secrets Frontend..."
gh secret set DEPLOY_HOST --repo "$REPO" --body "votre-serveur.com"
gh secret set DEPLOY_USER --repo "$REPO" --body "deploy"
gh secret set DEPLOY_PORT --repo "$REPO" --body "22"
gh secret set NEXT_PUBLIC_API_URL --repo "$REPO" --body "https://api.komon.ptilab.fr/api"
gh secret set NEXT_PUBLIC_SCALEWAY_PROJECT_ID --repo "$REPO" --body "849d4454-a4c4-4704-9908-44e1f7954f8b"
gh secret set NEXT_PUBLIC_SCALEWAY_REGION --repo "$REPO" --body "fr-par"

echo "⚠️  Vous devez configurer manuellement ces secrets Frontend:"
echo "   - DEPLOY_SSH_KEY (votre clé SSH privée)"
echo "   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (clé Stripe)"
echo "   - NEXT_PUBLIC_MAPBOX_TOKEN (token Mapbox)"
echo ""

# Secrets API
echo "🔑 Configuration des secrets API..."
gh secret set API_DEPLOY_HOST --repo "$REPO" --body "votre-serveur-api.com"
gh secret set API_DEPLOY_USER --repo "$REPO" --body "deploy"
gh secret set API_DEPLOY_PORT --repo "$REPO" --body "22"

echo "⚠️  Vous devez configurer manuellement ces secrets API:"
echo "   - API_DEPLOY_SSH_KEY (votre clé SSH privée)"
echo "   - SCALEWAY_ACCESS_KEY (clé d'accès Scaleway)"
echo "   - SCALEWAY_SECRET_KEY (clé secrète Scaleway)"
echo "   - SCALEWAY_DATABASE_URL (URL base de données PostgreSQL)"
echo "   - JWT_SECRET (clé secrète JWT)"
echo "   - DB_PASSWORD (mot de passe base de données)"
echo ""

# Secrets Mobile
echo "🔑 Configuration des secrets Mobile..."
echo "⚠️  Vous devez configurer manuellement ces secrets Mobile:"
echo "   - EXPO_TOKEN (token Expo)"
echo ""

echo "✅ Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Configurez les secrets manuels listés ci-dessus"
echo "2. Testez les pipelines en poussant du code"
echo "3. Configurez votre serveur selon docs/DEPLOYMENT.md"
echo ""
echo "🔗 Pour configurer les secrets manuels:"
echo "   https://github.com/$REPO/settings/secrets/actions" 