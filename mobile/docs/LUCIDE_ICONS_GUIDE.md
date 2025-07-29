# 🎨 Guide des Icônes Lucide pour KomOn

## 📋 Vue d'ensemble

KomOn utilise maintenant **Lucide React Native** pour toutes ses icônes. Lucide propose une collection moderne et cohérente d'icônes SVG qui s'intègrent parfaitement avec l'identité visuelle de KomOn.

## 🚀 Installation

Lucide React Native est déjà installé dans le projet :

```bash
yarn add lucide-react-native
```

## 📦 Composants Disponibles

### 1. KomOnIcon (Composant Principal)

Le composant principal pour utiliser les icônes par nom :

```tsx
import KomOnIcon from '../components/KomOnIcons';

// Utilisation basique
<KomOnIcon name="home" size={24} />

// Avec style personnalisé
<KomOnIcon name="activity" size={32} style={{ marginRight: 8 }} />
```

### 2. KomOnLogo (Logo Personnalisé)

Logo spécialement conçu pour KomOn :

```tsx
import { KomOnLogo } from '../components/KomOnIcons';

<KomOnLogo size={48} />
```

### 3. SportIcon (Icônes de Sports)

Icônes spécialisées pour les différents sports :

```tsx
import { SportIcon } from '../components/KomOnIcons';

<SportIcon sport="running" size={24} />
<SportIcon sport="cycling" size={24} />
<SportIcon sport="swimming" size={24} />
```

### 4. EventTypeIcon (Types d'Événements)

Icônes pour les différents types d'événements :

```tsx
import { EventTypeIcon } from '../components/KomOnIcons';

<EventTypeIcon type="competition" size={24} />
<EventTypeIcon type="training" size={24} />
<EventTypeIcon type="social" size={24} />
```

## 🎯 Icônes Disponibles

### Navigation Principale
- `home` - Accueil
- `events` - Événements
- `profile` - Profil utilisateur
- `community` - Communauté
- `settings` - Paramètres

### Actions Principales
- `activity` - Activité sportive
- `add` - Ajouter
- `logout` - Déconnexion
- `search` - Rechercher
- `filter` - Filtrer
- `edit` - Modifier
- `delete` - Supprimer
- `save` - Sauvegarder
- `cancel` - Annuler
- `close` - Fermer

### Navigation
- `chevronRight` - Flèche droite
- `chevronLeft` - Flèche gauche
- `arrowRight` - Flèche droite
- `arrowLeft` - Flèche gauche

### Événements et Sport
- `location` - Localisation
- `time` - Horloge
- `trophy` - Trophée
- `award` - Récompense
- `target` - Objectif
- `trendingUp` - Progression
- `zap` - Énergie

### Social et Communauté
- `heart` - J'aime
- `star` - Favori
- `message` - Message
- `share` - Partager
- `bookmark` - Marquer
- `users` - Utilisateurs

### Media
- `camera` - Caméra
- `play` - Lecture
- `pause` - Pause
- `stop` - Arrêt

### Formulaires et Validation
- `eye` - Voir
- `eyeOff` - Masquer
- `lock` - Verrouiller
- `mail` - Email
- `phone` - Téléphone

### Notifications
- `bell` - Notification
- `notification` - Notification (alias)

### Statuts
- `success` - Succès
- `error` - Erreur
- `warning` - Attention
- `info` - Information
- `help` - Aide

### Actions Secondaires
- `minus` - Moins
- `more` - Plus d'options
- `moreVertical` - Plus d'options vertical
- `download` - Télécharger
- `upload` - Téléverser
- `refresh` - Actualiser
- `rotate` - Rotation

### Interface
- `maximize` - Maximiser
- `minimize` - Minimiser
- `volume` - Volume
- `volumeOff` - Volume coupé

### Système
- `wifi` - Wi-Fi
- `wifiOff` - Wi-Fi coupé
- `battery` - Batterie
- `batteryCharging` - Batterie en charge
- `signal` - Signal
- `signalHigh` - Signal fort
- `signalMedium` - Signal moyen
- `signalLow` - Signal faible
- `signalZero` - Pas de signal

### Paiements
- `creditCard` - Carte de crédit
- `wallet` - Portefeuille
- `gift` - Cadeau

### Sécurité
- `shield` - Bouclier

## 🎨 Utilisation avec le Thème

Les icônes s'adaptent automatiquement au thème de l'application :

```tsx
import { useTheme } from '../contexts/ThemeContext';
import KomOnIcon from '../components/KomOnIcons';

function MyComponent() {
  const { colors } = useTheme();
  
  return (
    <KomOnIcon 
      name="activity" 
      size={24}
      style={{ color: colors.primary }} // Couleur personnalisée
    />
  );
}
```

## 📱 Exemples d'Utilisation

### Navigation Tab
```tsx
import KomOnIcon from '../components/KomOnIcons';

<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ focused, color, size }) => (
      <KomOnIcon 
        name="home" 
        size={size} 
        style={{ color: focused ? colors.primary : color }}
      />
    ),
  }}
/>
```

### Bouton d'Action
```tsx
import KomOnIcon from '../components/KomOnIcons';

<TouchableOpacity style={styles.button}>
  <KomOnIcon name="add" size={20} />
  <Text>Créer un événement</Text>
</TouchableOpacity>
```

### Liste d'Événements
```tsx
import { EventTypeIcon } from '../components/KomOnIcons';

{events.map(event => (
  <View key={event.id} style={styles.eventItem}>
    <EventTypeIcon type={event.type} size={24} />
    <Text>{event.title}</Text>
  </View>
))}
```

## 🔧 Personnalisation

### Ajouter une Nouvelle Icône

1. Importer l'icône depuis Lucide :
```tsx
import { NewIcon } from 'lucide-react-native';
```

2. Ajouter au mapping dans `KomOnIcons.tsx` :
```tsx
const iconMap = {
  // ... autres icônes
  newIcon: NewIcon,
};
```

3. Utiliser dans l'application :
```tsx
<KomOnIcon name="newIcon" size={24} />
```

### Créer un Composant Spécialisé

```tsx
export function CustomIcon({ variant, size = 24, style }: CustomIconProps) {
  const { colors } = useTheme();
  
  const iconMap = {
    variant1: Activity,
    variant2: Trophy,
    default: Star,
  };
  
  const IconComponent = iconMap[variant] || iconMap.default;
  
  return (
    <IconComponent
      size={size}
      style={[styles.icon, style]}
    />
  );
}
```

## 🎯 Bonnes Pratiques

1. **Taille cohérente** : Utilisez des tailles standard (16, 20, 24, 32, 48)
2. **Couleurs du thème** : Laissez les icônes utiliser les couleurs du thème par défaut
3. **Accessibilité** : Ajoutez des labels pour les icônes importantes
4. **Performance** : Importez uniquement les icônes nécessaires

## 🐛 Dépannage

### Icône non trouvée
Si vous obtenez un avertissement "Icône non trouvée", vérifiez :
- Le nom de l'icône dans le mapping
- L'import de l'icône depuis Lucide
- La casse du nom (minuscules)

### Problèmes de rendu
- Vérifiez que Lucide React Native est correctement installé
- Assurez-vous que le composant est dans un contexte de thème
- Vérifiez les styles appliqués

## 📚 Ressources

- [Documentation Lucide](https://lucide.dev/)
- [Lucide React Native](https://github.com/lucide-icons/lucide/tree/main/packages/lucide-react-native)
- [Icônes disponibles](https://lucide.dev/icons/) 