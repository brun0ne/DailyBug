import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import { theme } from './util/Theme';

import { useCallback, useEffect, useState } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { useFonts } from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

const CANVAS_KIT_VERSION = "0.39.1";
const CANVAS_KIT_BASE_URL = `https://cdn.jsdelivr.net/npm/canvaskit-wasm@${CANVAS_KIT_VERSION}/bin/full`;

export default function App() {
  const [isSkiaReady, setIsSkiaReady] = useState(Platform.OS !== "web");
  const [MainComponent, setMainComponent] = useState<React.ComponentType | null>(null);
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Black": require("./assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    "Inter-Light": require("./assets/fonts/Inter-Light.ttf"),
    "Inter-Thin": require("./assets/fonts/Inter-Thin.ttf"),
    "CascadiaCode": require("./assets/fonts/CascadiaCode.ttf"),
    "Roboto-Medium": require("./assets/Roboto/Roboto-Medium.ttf"),
  });

  useEffect(() => {
    if (!isSkiaReady) {
      return;
    }

    setMainComponent(() => require('./components/Main').default);
  }, [isSkiaReady]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSkiaWeb = async () => {
      if (Platform.OS !== "web") {
        return;
      }

      if ((globalThis as any).CanvasKit) {
        if (isMounted) {
          setIsSkiaReady(true);
        }
        return;
      }

      await new Promise<void>((resolve, reject) => {
        const existingScript = document.getElementById("canvaskit-wasm-loader") as HTMLScriptElement | null;

        if (existingScript) {
          if ((globalThis as any).CanvasKitInit) {
            resolve();
            return;
          }

          existingScript.addEventListener("load", () => resolve(), { once: true });
          existingScript.addEventListener("error", () => reject(new Error("Failed loading CanvasKit script")), { once: true });
          return;
        }

        const script = document.createElement("script");
        script.id = "canvaskit-wasm-loader";
        script.src = `${CANVAS_KIT_BASE_URL}/canvaskit.js`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed loading CanvasKit script"));
        document.head.appendChild(script);
      });

      const canvasKitInit = (globalThis as any).CanvasKitInit;
      if (!canvasKitInit) {
        throw new Error("CanvasKitInit is not available on window");
      }

      const canvasKit = await canvasKitInit({
        locateFile: (file: string) => `${CANVAS_KIT_BASE_URL}/${file}`,
      });

      (globalThis as any).CanvasKit = canvasKit;

      if (isMounted) {
        setIsSkiaReady(true);
      }
    };

    bootstrapSkiaWeb().catch((error) => {
      console.error("Failed to initialize Skia on web", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  StatusBar.setBarStyle("dark-content");

  if (Platform.OS === "android") {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent");
  }

  const onLayoutRootView = useCallback(async () => {
    if (!isSkiaReady) {
      return;
    }

    await SplashScreen.hideAsync();
  }, [isSkiaReady]);

  if (!isSkiaReady || !MainComponent || !fontsLoaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme} settings={{ icon: ({ name, size, color }) => <MaterialCommunityIcons name={name as any} size={size} color={color as any} /> }}>
      <View style={{ flexGrow: 1, backgroundColor: theme.colors.elevation.level2 }} onLayout={onLayoutRootView}>
        <GestureHandlerRootView style={{ flexGrow: 1 }}>
          <MainComponent />
        </GestureHandlerRootView>
      </View>
    </PaperProvider>
  );
};
