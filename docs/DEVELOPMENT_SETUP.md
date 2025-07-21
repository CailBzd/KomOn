# Configuration de Développement KomOn

## 🔧 Configuration HTTP pour le Développement

### Vue d'ensemble

En mode développement, KomOn est configuré pour utiliser HTTP au lieu de HTTPS pour faciliter les tests et le débogage.

### Configuration Backend (.NET API)

#### 1. Désactivation de la redirection HTTPS
- **Fichier** : `backend/KomOn.API/Program.cs`
- **Modification** : La redirection HTTPS est désactivée en mode développement
- **URL de développement** : `http://192.168.1.197:5000`

#### 2. Configuration des ports
- **Fichier** : `backend/KomOn.API/Properties/launchSettings.json`
- **URL** : `http://192.168.1.197:5000` (HTTP uniquement en développement)

#### 3. Configuration CORS
- **Politique** : `AllowAll` - Accepte toutes les origines en développement
- **Headers** : Tous les headers autorisés
- **Méthodes** : Toutes les méthodes HTTP autorisées

### Configuration Mobile (React Native)

#### 1. URL d'API dynamique
- **Fichier** : `mobile/src/config/api.ts`
- **Développement** : `http://192.168.1.197:5000/api`
- **Production** : `https://api.komon.ptilab.fr/api`

#### 2. Service d'authentification
- **Fichier** : `mobile/src/services/authService.ts`
- **Configuration** : Utilise la configuration centralisée d'API
- **Logs** : Logs détaillés en mode développement

### Démarrage du Développement

#### 1. Backend
```bash
cd backend
dotnet run --project KomOn.API
```

#### 2. Mobile
```bash
cd mobile
yarn start
```

### Vérification

#### 1. API Backend
- **URL** : http://192.168.1.197:5000
- **Swagger** : http://192.168.1.197:5000/swagger
- **Health Check** : http://192.168.1.197:5000/health

#### 2. Application Mobile
- **Expo DevTools** : http://localhost:19002
- **Logs** : Vérifier les logs dans la console pour confirmer l'utilisation d'HTTP

### Logs de Développement

#### Backend
```
🔧 Development mode: HTTPS redirection disabled
```

#### Mobile
```
🔧 API Configuration: {
  BASE_URL: "http://192.168.1.197:5000/api",
  ENVIRONMENT: "Development",
  PROTOCOL: "HTTP"
}
🔧 Development mode: Using HTTP for API calls
```

### Dépannage

#### Problème : Erreur de connexion à l'API
1. Vérifier que l'API backend est démarrée
2. Vérifier l'adresse IP dans la configuration
3. Vérifier que le port 5000 est accessible

#### Problème : Erreurs CORS
1. Vérifier que la politique CORS est configurée
2. Vérifier que les headers sont corrects
3. Vérifier que l'origine est autorisée

#### Problème : Redirection HTTPS
1. Vérifier que `ASPNETCORE_ENVIRONMENT=Development`
2. Vérifier que la redirection HTTPS est désactivée en développement

### Sécurité

⚠️ **Important** : Cette configuration HTTP est uniquement pour le développement. En production, HTTPS est obligatoire.

### Variables d'Environnement

#### Backend
```bash
ASPNETCORE_ENVIRONMENT=Development
ASPNETCORE_URLS=http://192.168.1.197:5000
```

#### Mobile
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.197:5000/api
```

### Migration vers la Production

Pour passer en production, les configurations suivantes sont automatiquement appliquées :

1. **Backend** : Redirection HTTPS activée
2. **Mobile** : URL HTTPS utilisée
3. **CORS** : Origines restreintes
4. **Logs** : Logs de développement désactivés 