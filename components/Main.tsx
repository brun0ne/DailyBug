import React, { useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from "./Header";

import Home from "./Screens/Home";
import User from "./Screens/User";

const Tab = createMaterialBottomTabNavigator();

const Main = () => {
    return (
        <NavigationContainer>
            <Header />
            <Tab.Navigator>
                <Tab.Screen name="Home" component={Home} options={{
                    tabBarIcon:({color})=>(
                        <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                }} />
                <Tab.Screen name="Create" component={User} options={{
                    tabBarIcon:({color})=>(
                        <MaterialCommunityIcons name="creation" color={color} size={26} />
                    ),
                }} />
                <Tab.Screen name="Profile" component={User} options={{
                    tabBarIcon:({color})=>(
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

export default Main;
