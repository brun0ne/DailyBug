import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";

import Colors from "../util/Colors";

import AppText from "./AppText";

type MenuButtonProps = {
    title: string,
    onPress?: Function,
    accessibilityLabel?: string
};

const MenuButton = (props: MenuButtonProps) => {
    return (
        <Pressable
            onPress={ () => {(props.onPress ?? (() => {}))() } }
            style={({ pressed }) => [
                {
                    backgroundColor: pressed ? Colors.button : Colors.white,
                },
                styles.wrapperCustom
            ]}>
            <AppText><Text style={styles.text}>{props.title}</Text></AppText>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        color: "black"
    },
    wrapperCustom: {
        borderRadius: 8,
        padding: 20,
    }
});

export default MenuButton;
