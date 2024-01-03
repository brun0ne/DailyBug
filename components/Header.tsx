import React from "react";
import { Text } from "react-native";
import AppText from "./AppText";

const name = "🐛 Daily Bug 🐛";

const Header = () => {
    return <AppText><Text style={{fontSize: 20}}>{name}</Text></AppText>
};

export default Header;
