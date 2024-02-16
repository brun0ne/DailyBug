import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from "./Header";

import HomeView from "./Screens/HomeView";
import UserView from "./Screens/UserView";
import SpecialView from "./Screens/SpecialView";

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { UserAPI, UserContext, UserProgressData } from "../util/UserContext";
import { invokeGoogleSignIn } from "./GoogleSignIn";
import { PostHogProvider } from "posthog-react-native";

const Tab = createMaterialBottomTabNavigator();

const Main = () => {
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
    const [updated, setUpdated] = useState(true);
    const [progressData, setProgressData] = useState<UserProgressData>(null);

    const signedIn = useMemo(() => (
        !!user
    ), [user]);

    const loadFromAPI = useCallback(async () => {
        if (!user)
            return;

        const data = await UserAPI.getProgress({user, updated, setUpdated, progressData});
        setProgressData(data);
    }, [user, updated]);

    useEffect(() => {
        if (updated) {
            loadFromAPI();
            setUpdated(false);
        }
    }, [updated]);

    const context = useMemo(() => (
        { 
            user,
            updated,
            progressData,
            setUpdated
        }
    ), [user, updated, setUpdated, progressData]);

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
                <PostHogProvider apiKey="phc_PsM7WSvjoGaIfEzYTsNSGxgfgfhghBZjwQ0Z2wtx6YZ" options={{ host: 'https://eu.posthog.com' }}>
                    <Header />
                    <Tab.Navigator>
                        <Tab.Screen name="Home" component={signedIn ? HomeView : View} options={{
                            tabBarIcon:({color})=>(
                                <MaterialCommunityIcons name="home" color={color} size={26} />
                            ),
                        }} />
                        <Tab.Screen name="Special" component={signedIn ? SpecialView : View} options={{
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
                </PostHogProvider>
            </NavigationContainer>
        </UserContext.Provider>
    );
};

export default Main;
