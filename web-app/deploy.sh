#!/bin/bash

echo "🚀 Déploiement de KomOn Web Application..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Veuillez exécuter ce script depuis le répertoire web-app"
    exit 1
fi

# Vérifier que les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Build de production
echo "🏗️  Construction de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de la construction"
    exit 1
fi

echo "✅ Application construite avec succès"

# Vérifier que le dossier dist existe
if [ ! -d "dist" ]; then
    echo "❌ Dossier dist non trouvé après la construction"
    exit 1
fi

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📁 L'application est prête dans le dossier 'dist'"
echo ""
echo "🌐 Pour tester en local :"
echo "  npm run preview"
echo ""
echo "📱 Pour déployer sur un serveur web :"
echo "  Copiez le contenu du dossier 'dist' vers votre serveur web"
echo ""
echo "🔧 Configuration PWA :"
echo "  - Manifest : dist/manifest.json"
echo "  - Service Worker : dist/sw.js"
echo "  - Icônes : dist/icons/" 