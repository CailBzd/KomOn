#!/bin/bash

# Script pour récupérer les clés Supabase du projet KomOn
# Usage: ./scripts/get-supabase-keys.sh

set -e

PROJECT_ID="849d4454-a4c4-4704-9908-44e1f7954f8b"

echo "🔑 Récupération des clés Supabase pour le projet $PROJECT_ID"
echo ""

# Vérifier que supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé"
    echo "Installez-le avec: npm install -g supabase"
    exit 1
fi

echo "📋 Informations du projet Supabase:"
echo "   Project ID: $PROJECT_ID"
echo "   URL: https://$PROJECT_ID.supabase.co"
echo ""

echo "🔐 Pour récupérer vos clés Supabase:"
echo ""
echo "1. Allez sur https://supabase.com/dashboard/project/$PROJECT_ID"
echo "2. Cliquez sur 'Settings' > 'API'"
echo "3. Copiez les clés suivantes:"
echo ""
echo "   📍 Project URL:"
echo "   https://$PROJECT_ID.supabase.co"
echo ""
echo "   🔑 anon public:"
echo "   (copiez depuis l'interface Supabase)"
echo ""
echo "   🔑 service_role secret:"
echo "   (copiez depuis l'interface Supabase)"
echo ""
echo "4. Utilisez ces clés dans vos secrets GitHub Actions:"
echo ""
echo "   NEXT_PUBLIC_SUPABASE_URL=https://$PROJECT_ID.supabase.co"
echo "   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon"
echo "   SUPABASE_ANON_KEY=votre-clé-anon"
echo "   SUPABASE_SERVICE_ROLE_KEY=votre-clé-service"
echo ""

echo "🚀 Pour configurer automatiquement les secrets GitHub:"
echo "   ./scripts/setup-github-secrets.sh"
echo ""
echo "📚 Documentation Supabase:"
echo "   https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs" 