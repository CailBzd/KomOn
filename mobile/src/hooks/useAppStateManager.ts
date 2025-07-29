import { useState, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus, Dimensions } from 'react-native';

interface AppStateManagerReturn {
  appState: string;
  isActive: boolean;
  forceRefresh: () => void;
  lastActiveTime: number;
}

export function useAppStateManager(): AppStateManagerReturn {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isActive, setIsActive] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const lastActiveTime = useRef(Date.now());
  const refreshTimeoutRef = useRef<number | null>(null);

  // Fonction pour forcer le rafraîchissement
  const forceRefresh = useCallback(() => {
    console.log('Force refresh triggered');
    setRefreshKey(prev => prev + 1);
    
    // Nettoyer les timeouts précédents
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    
    // Forcer plusieurs rafraîchissements avec des délais différents
    refreshTimeoutRef.current = setTimeout(() => {
      console.log('Delayed refresh 1');
      setRefreshKey(prev => prev + 1);
      
      refreshTimeoutRef.current = setTimeout(() => {
        console.log('Delayed refresh 2');
        setRefreshKey(prev => prev + 1);
        
        refreshTimeoutRef.current = setTimeout(() => {
          console.log('Final refresh');
          setRefreshKey(prev => prev + 1);
        }, 200);
      }, 100);
    }, 50);
  }, []);

  // Gérer les changements d'état de l'application
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('AppState changed:', appState, '->', nextAppState);
      
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan
        console.log('App returning to foreground');
        lastActiveTime.current = Date.now();
        setIsActive(true);
        
        // Forcer le rafraîchissement immédiat
        forceRefresh();
        
        // Forcer un nouveau rafraîchissement après un délai plus long
        setTimeout(() => {
          console.log('Long delay refresh');
          forceRefresh();
        }, 1000);
      } else if (nextAppState.match(/inactive|background/)) {
        // L'app passe en arrière-plan
        console.log('App going to background');
        setIsActive(false);
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [appState, forceRefresh]);

  // Écouter les changements de dimensions
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      console.log('Dimensions changed:', window);
      forceRefresh();
    });

    return () => {
      subscription?.remove();
    };
  }, [forceRefresh]);

  return {
    appState,
    isActive,
    forceRefresh,
    lastActiveTime: lastActiveTime.current,
  };
} 