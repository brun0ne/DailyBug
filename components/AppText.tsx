import React from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../util/Colors";
import AppConfig from "../util/AppConfig";

interface MyProps { }

const AppText = (props: React.PropsWithChildren<MyProps>) => {
    return <Text style={styles.text}>{props.children}</Text>
}

const styles = StyleSheet.create({
    text: {
        fontFamily: AppConfig.fontFamily,
        color: Colors.white
    }
});

export default AppText;
