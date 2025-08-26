# Script PowerShell pour démarrer la base de données PostgreSQL KomOn
# Exécutez ce script depuis le répertoire backend

Write-Host "🚀 Démarrage de la base de données PostgreSQL pour KomOn..." -ForegroundColor Green

# Vérifier si Docker est en cours d'exécution
try {
    docker info | Out-Null
    Write-Host "✅ Docker est en cours d'exécution" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# Arrêter et supprimer les conteneurs existants
Write-Host "🔄 Nettoyage des conteneurs existants..." -ForegroundColor Yellow
docker-compose -f docker-compose.db.yml down -v

# Démarrer les services
Write-Host "🚀 Démarrage des services PostgreSQL et pgAdmin..." -ForegroundColor Green
docker-compose -f docker-compose.db.yml up -d

# Attendre que PostgreSQL soit prêt
Write-Host "⏳ Attente que PostgreSQL soit prêt..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    Start-Sleep -Seconds 2
    $attempt++
    
    try {
        $result = docker exec komon_postgres pg_isready -U postgres -d komon_dev 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL est prêt!" -ForegroundColor Green
            break
        }
    } catch {
        # Ignorer les erreurs
    }
    
    Write-Host "⏳ Tentative $attempt/$maxAttempts..." -ForegroundColor Yellow
} while ($attempt -lt $maxAttempts)

if ($attempt -ge $maxAttempts) {
    Write-Host "❌ PostgreSQL n'a pas pu démarrer dans le délai imparti" -ForegroundColor Red
    exit 1
}

# Afficher les informations de connexion
Write-Host ""
Write-Host "🎉 Base de données PostgreSQL démarrée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Informations de connexion:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Port: 5432" -ForegroundColor White
Write-Host "   Database: komon_dev" -ForegroundColor White
Write-Host "   Username: postgres" -ForegroundColor White
Write-Host "   Password: password" -ForegroundColor White
Write-Host ""
Write-Host "🌐 pgAdmin (interface web):" -ForegroundColor Cyan
Write-Host "   URL: http://localhost:8080" -ForegroundColor White
Write-Host "   Email: admin@komon.local" -ForegroundColor White
Write-Host "   Password: admin" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Pour arrêter la base de données:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.db.yml down" -ForegroundColor White
Write-Host ""
Write-Host "📝 Logs en temps réel:" -ForegroundColor Yellow
Write-Host "   docker-compose -f docker-compose.db.yml logs -f" -ForegroundColor White 