import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import Header from "./Header";

import HomeView from "./Screens/HomeView";
import UserView from "./Screens/UserView";
import SpecialView from "./Screens/SpecialView";
import { UserAPI, UserContext, UserProgressData } from "../util/UserContext";

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import SignInModal from "./SignInModal";
import { PostHogProvider } from "posthog-react-native";

import mobileAds from "react-native-google-mobile-ads";

const Tab = createMaterialBottomTabNavigator();

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../util/PushNotifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    }),
});  

const Main = () => {
    const [user, setUser] = useState<FirebaseAuthTypes.User>(null);
    const [updated, setUpdated] = useState(true);
    const [progressData, setProgressData] = useState<UserProgressData>(null);

    const [loginVisible, setLoginVisible] = useState(false);

    const signedIn = useMemo(() => (
        !!user
    ), [user]);

    /* Notifications */
    const [expoPushToken, setExpoPushToken] = useState('');

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    }, []);

    /* User & progress */
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
                setLoginVisible(true);
            }
            else {
                UserAPI.init(user, expoPushToken);
                setLoginVisible(false);
            }
        });
        return subscriber; /* unsubscribe on unmount */
    }, [expoPushToken]);

    useEffect(() => {
        if (!user && !loginVisible) {
            setLoginVisible(true);
        }
    });

    /* Ads */
    useEffect(() => {
        mobileAds()
            .initialize()
            .then(adapterStatuses => {
                console.log("Ads initialization complete!");
                console.log(adapterStatuses);
            });
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
                        <Tab.Screen name="Sprint" component={signedIn && progressData ? SpecialView : View} options={{
                            tabBarIcon:({color})=>(
                                <MaterialCommunityIcons name="creation" color={color} size={26} />
                            ),
                        }} />
                        <Tab.Screen name="Profile" component={signedIn && progressData ? UserView: View} options={{
                            tabBarIcon:({color})=>(
                                <MaterialCommunityIcons name="account" color={color} size={26} />
                            ),
                        }} />
                    </Tab.Navigator>
                    <SignInModal visible={loginVisible} hide={() => {setLoginVisible(false)}} />
                </PostHogProvider>
            </NavigationContainer>
        </UserContext.Provider>
    );
};

export default Main;
