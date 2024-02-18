import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import Main from './components/Main';
import { theme } from './util/Theme';

import { useCallback, useEffect, useState } from 'react';
import ConsentView from './components/Screens/ConsentView';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [consent, setConsent] = useState(false);
  const [consentLoading, setConsentLoading] = useState(true);

  const loadConsent = async () => {
      try {
          const value = await AsyncStorage.getItem("user_consent");
          if (value !== null) {
              setConsent(JSON.parse(value));
          }
      }
      catch (e) {
          console.error(e);
      }
      finally {
        setConsentLoading(false);
      }
  };

  useEffect(() => {
    loadConsent();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!consentLoading) {
      await SplashScreen.hideAsync();
    }
  }, [consentLoading]);

  if (consentLoading) {
    return null;
  }

  return (
    <View style={{ flexGrow: 1 }} onLayout={onLayoutRootView}>
      <PaperProvider theme={theme}>
        {
          consent ? (
            <GestureHandlerRootView style={{ flexGrow: 1 }}>
              <Main />
            </GestureHandlerRootView>
          ) : (
            <View style={{ flexGrow: 1 }}>
              <ConsentView consentGivenCallback={() => { setConsent(true) }} consent={consent} />
            </View>
          )
        }
      </PaperProvider>
    </View>
  );
};
