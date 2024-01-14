import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from "./Header";

import HomeView from "./Screens/HomeView";
import UserView from "./Screens/UserView";

import { User, UserContext } from "../util/UserContext";

const Tab = createMaterialBottomTabNavigator();

const Main = () => {
    const [user, setUser] = useState<User>(null);

    const context = useMemo(() => (
        { user, setUser }
    ), [user, setUser]);

    const loadUser = async () => {
        setUser(await (new User()).getUpdated());
    };

    useEffect(() => {
        if (!user) {
            loadUser();
        }
    }, [user]);

    return (
        <UserContext.Provider value={context}>
            <NavigationContainer>
                <Header />
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={HomeView} options={{
                        tabBarIcon:({color})=>(
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }} />
                    <Tab.Screen name="Create" component={View} options={{
                        tabBarIcon:({color})=>(
                            <MaterialCommunityIcons name="creation" color={color} size={26} />
                        ),
                    }} />
                    <Tab.Screen name="Profile" component={UserView} options={{
                        tabBarIcon:({color})=>(
                            <MaterialCommunityIcons name="account" color={color} size={26} />
                        ),
                    }} />
                </Tab.Navigator>
            </NavigationContainer>
        </UserContext.Provider>
    );
};

export default Main;
