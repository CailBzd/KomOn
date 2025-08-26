#!/bin/bash

echo "🚀 Configuration de KomOn Web Application..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/"
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18+ est requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi

echo "✅ Dépendances installées avec succès"

# Créer le fichier d'environnement
echo "⚙️  Configuration de l'environnement..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Configuration de l'API backend
VITE_API_URL=http://192.168.1.197:5000/api

# Configuration PWA
VITE_APP_NAME=KomOn
VITE_APP_DESCRIPTION=Application pour organiser et participer à des événements sportifs
VITE_APP_VERSION=1.0.0

# Configuration de développement
VITE_DEV_MODE=true
EOF
    echo "✅ Fichier .env.local créé"
else
    echo "ℹ️  Fichier .env.local existe déjà"
fi

# Vérifier que le backend est accessible
echo "🔍 Vérification de la connectivité avec le backend..."
if command -v curl &> /dev/null; then
    if curl -s http://192.168.1.197:5000/api/health &> /dev/null; then
        echo "✅ Backend accessible sur http://192.168.1.197:5000"
    else
        echo "⚠️  Backend non accessible sur http://192.168.1.197:5000"
        echo "   Assurez-vous que votre backend KomOn est en cours d'exécution"
        echo "   et accessible depuis cette machine"
    fi
else
    echo "ℹ️  Impossible de vérifier la connectivité backend (curl non installé)"
fi

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "Pour démarrer l'application :"
echo "  npm run dev"
echo ""
echo "L'application sera accessible sur :"
echo "  http://localhost:3001"
echo ""
echo "L'API backend est configurée sur :"
echo "  http://192.168.1.197:5000"
echo ""
echo "Pour construire l'application :"
echo "  npm run build"
echo ""
echo "📚 Consultez le README.md pour plus d'informations" 