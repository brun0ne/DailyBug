import React, { createContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from "./Header";

import HomeView from "./Screens/HomeView";
import UserView from "./Screens/UserView";

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserAPI, UserContext } from "../util/UserContext";
import { invokeGoogleSignIn } from "./GoogleSignIn";

const Tab = createMaterialBottomTabNavigator();

const Main = () => {
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
    const [updated, setUpdated] = useState(true);

    const signedIn = useMemo(() => (
        !!user
    ), [user]);

    const context = useMemo(() => (
        { 
            user,
            updated,
            setUpdated
        }
    ), [user, updated, setUpdated]);

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged((user) => {
            setUser(user);
            setUpdated(true);

            if (!user) {
                invokeGoogleSignIn();
            }
            else {
                UserAPI.init(user);
            }
        });
        return subscriber; /* unsubscribe on unmount */
    }, []);

    return (
        <UserContext.Provider value={context}>
            <NavigationContainer>
                <Header />
                <Tab.Navigator>
                    <Tab.Screen name="Home" component={signedIn ? HomeView : View} options={{
                        tabBarIcon:({color})=>(
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        ),
                    }} />
                    <Tab.Screen name="Create" component={View} options={{
                        tabBarIcon:({color})=>(
                            <MaterialCommunityIcons name="creation" color={color} size={26} />
                        ),
                    }} />
                    <Tab.Screen name="Profile" component={signedIn ? UserView: View} options={{
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
