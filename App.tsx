import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import Main from './components/Main';
import { theme } from './util/Theme';

import { useCallback, useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';

import * as SplashScreen from 'expo-splash-screen';

import mobileAds, { AdsConsent } from 'react-native-google-mobile-ads';

SplashScreen.preventAutoHideAsync();

export default function App() {
  StatusBar.setBarStyle("dark-content");

  if (Platform.OS === "android") {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }

  /* Consent */
  const loadConsent = async () => {
    AdsConsent.requestInfoUpdate().then(() => {
      AdsConsent.loadAndShowConsentFormIfRequired().then(adsConsentInfo => {
        if (adsConsentInfo.canRequestAds) {
          mobileAds().initialize();
          console.log("Mobile ads initialized");
        }
      })
    });
  };

  useEffect(() => {
    loadConsent();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <View style={{ flexGrow: 1, backgroundColor: theme.colors.elevation.level2 }} onLayout={onLayoutRootView}>
        <GestureHandlerRootView style={{ flexGrow: 1 }}>
          <Main />
        </GestureHandlerRootView>
      </View>
    </PaperProvider>
  );
};
