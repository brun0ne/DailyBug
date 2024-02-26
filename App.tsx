import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import Main from './components/Main';
import { theme } from './util/Theme';

import { useCallback, useEffect, useState } from 'react';
import ConsentView from './components/Screens/ConsentView';
import { Platform, StatusBar, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as SplashScreen from 'expo-splash-screen';
import * as Updates from 'expo-updates';

import { useFonts } from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [consent, setConsent] = useState(false);
  const [consentLoading, setConsentLoading] = useState(true);

  StatusBar.setBarStyle("dark-content");

  if (Platform.OS === "android") {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }

  /* Consent */
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
    <PaperProvider theme={theme}>
      <View style={{ flexGrow: 1, backgroundColor: theme.colors.elevation.level2 }} onLayout={onLayoutRootView}>
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
      </View>
    </PaperProvider>
  );
};
