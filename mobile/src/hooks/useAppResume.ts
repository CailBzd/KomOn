import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppResume() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // L'app revient au premier plan
        console.log('App resumed, triggering refresh');
        setShouldRefresh(true);
        
        // Reset après un délai
        setTimeout(() => {
          setShouldRefresh(false);
        }, 1000);
      }
      
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [appState]);

  return { shouldRefresh, appState };
} 