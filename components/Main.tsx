import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

import Colors from "../util/Colors";
import Pages from "../util/Pages";

import Home from "./Home";
import Header from "./Header";
import Footer from "./Footer";

const pageToJSX = new Map([
    [Pages.Home, <Home />],
    // [Pages.User, <User />]
]);

const Main = () => {
    const [activePage, setActivePage] = useState(Pages.Home);

    return (
        <View style={ [ styles.container ] }>
            <StatusBar></StatusBar>
            <View style={[styles.centered, {flex: 2, backgroundColor: Colors.grey_1 }]}>
                <Header />
            </View>
            <View style={[styles.centered, {flex: 15, backgroundColor: Colors.grey_2}]}>
                {pageToJSX.get(activePage)}
            </View>
            <View style={{flex: 3, backgroundColor: Colors.grey_1}}>
                <Footer setActivePage={setActivePage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: 'column'
    },
    centered: {
        justifyContent: "center",
        alignItems: "center"
    }
});

export default Main;
