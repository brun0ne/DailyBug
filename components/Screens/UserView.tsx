import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Text, useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";

import { useIsFocused } from '@react-navigation/native';

import { UserAPI, UserContext, UserProgressData } from "../../util/UserContext";
import ShaderProgressBar from "../Animated/ShaderProgressBar";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

const UserView = () => {
    const userContext = useContext(UserContext); 
    const theme = useTheme();

    const isFocused = useIsFocused();

    const displayName = useMemo(() => {
        if (!userContext.user)
            return "Anonymous";

        if (userContext.user.displayName.includes(" ")) {
            return userContext.user.displayName.split(" ")[0];
        }
        else {
            return userContext.user.displayName;
        }
    }, [userContext.user]);

    if (!isFocused)
        return <></>;

    return (
        <View style={styles.containter}>
            <Card>
                <Card.Title
                    title={<Text variant="titleLarge">{displayName}</Text>}
                    left={(props) => (
                        <Avatar.Image {...props} source={{uri: userContext.user.photoURL}} />
                    )}
                />

                <Card.Content style={styles.content}>
                    <View>
                        <Text style={{fontSize: 20}}>✨ Level <Text style={{fontWeight: 'bold'}}>{userContext.progressData?.level ?? 1}</Text></Text>
                    </View>

                    <ShaderProgressBar
                        text={`EXP ${userContext.progressData?.exp ?? 0} / ${userContext.progressData?.maxExp ?? 100}`}
                        progress={(userContext.progressData?.exp ?? 0) / (userContext.progressData?.maxExp ?? 1)}
                    />

                    <View style={styles.stats}> 
                        <Button icon="calendar" mode="contained" style={{backgroundColor: theme.colors.secondary}}>
                            Streak  |  {userContext.progressData?.streak ?? 0}
                        </Button>
                        <Button icon="fire" mode="contained" style={{backgroundColor: theme.colors.secondary}}>
                            Combo  |  {userContext.progressData?.combo ?? 0}
                        </Button>
                    </View>
                </Card.Content>
            </Card>

            <View style={styles.items}>
                <ShaderFlatDisplay text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
            </View>

            {/* <View style={styles.bottom}>
                <Button mode="contained-tonal" onPress={() => { auth().signOut() }}>Sign Out</Button>
            </View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    containter: {
        padding: 20
    },
    content: {
        gap: 15,
    },
    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 5
    },
    items: {
        flexDirection: "column",
        gap: 10,
        marginTop: 20,
        width: "100%"
    },
    bottom: {
        marginTop: 20,
        gap: 20
    }
});

export default UserView;
