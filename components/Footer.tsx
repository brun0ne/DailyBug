import React from "react";
import { View } from "react-native";
import { EnumType } from "typescript";

import Pages from "../util/Pages";

import MenuButton from "./MenuButton";

type FooterProps = {
    setActivePage: Function
};

const Footer = (props: FooterProps) => {
    return (
        <View style={{flexDirection: "row", flex: 1, padding: 20, justifyContent: "space-around", alignItems: "center"}}>
            <MenuButton title="Home" onPress={ () => { props.setActivePage(Pages.Home) } } />
            <MenuButton title="Profile" onPress={ () => { props.setActivePage(Pages.User) } } />
        </View>
    );
};

export default Footer;
