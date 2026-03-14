import { Platform, ViewStyle } from "react-native";

export const webScreenContentStyle: ViewStyle = Platform.OS === "web"
    ? {
        width: "100%",
        maxWidth: 1100,
        alignSelf: "center",
        paddingHorizontal: 20,
    }
    : {};

export const webModalContainerStyle: ViewStyle = Platform.OS === "web"
    ? {
        width: "100%",
        maxWidth: 640,
        alignSelf: "center",
    }
    : {};
