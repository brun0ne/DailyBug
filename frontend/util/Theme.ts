// @ts-nocheck

import { DefaultTheme, configureFonts } from "react-native-paper";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#be123c',
        error: '#be123c',

        secondary: '#4d7c0f'
    },
    fonts: configureFonts({
        config: {
            labelSmall: {
                fontFamily: "Inter-Regular"
            },
            labelMedium: {
                fontFamily: "Inter-Regular"
            },
            labelLarge: {
                fontFamily: "Inter-Regular"
            },
            titleSmall: {
                fontFamily: "Inter-Regular"
            },
            titleMedium: {
                fontFamily: "Inter-Regular"
            },
            titleLarge: {
                fontFamily: "Inter-Black"
            },
            bodySmall: {
                fontFamily: "Inter-Regular"
            },
            bodyMedium: {
                fontFamily: "Inter-Regular"
            },
            bodyLarge: {
                fontFamily: "Inter-Regular"
            },
            headlineSmall: {
                fontFamily: "Inter-Regular"
            },
            headlineMedium: {
                fontFamily: "Inter-Regular"
            },
            headlineLarge: {
                fontFamily: "Inter-Regular"
            },
            displaySmall: {
                fontFamily: "Inter-Regular"
            },
            displayMedium: {
                fontFamily: "Inter-Regular"
            },
            displayLarge: {
                fontFamily: "Inter-Regular"
            }
        },
        isV3: true
    })
};

export { theme };
