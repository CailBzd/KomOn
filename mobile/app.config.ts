import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'KomOn Mobile',
  slug: 'komon-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'komon',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.komon.mobile'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.komon.mobile'
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router'
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'your-project-id'
    }
  }
}); 