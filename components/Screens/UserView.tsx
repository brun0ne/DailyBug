import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Text, useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";

import { UserAPI, UserContext } from "../../util/UserContext";

const UserView = () => {
    const userContext = useContext(UserContext); 
    const theme = useTheme();

    const [streak, setStreak] = useState(0);
    const [combo, setCombo] = useState(0);

    const loadFromAPI = useCallback(async () => {
        setStreak(await UserAPI.getStreak(userContext));
        setCombo(await UserAPI.getCombo(userContext));
    }, [userContext]);

    useEffect(() => {
        if (userContext.updated) {
            loadFromAPI();
            userContext.setUpdated(false);
        }
    }, [userContext]);

    return (
        <View style={styles.containter}>
            <Card>
                <Card.Title
                    title={<Text variant="titleLarge">{userContext.user.displayName}</Text>}
                    left={(props) => <Avatar.Icon {...props} icon="account" style={{ backgroundColor: theme.colors.primary }} color={theme.colors.onPrimary} />}
                />

                <Card.Content style={styles.content}>
                    {
                        false ? (
                            <View style={{flex: 1, flexDirection: "row", justifyContent: "center"}}>
                                <ActivityIndicator />
                            </View>
                        ) : (
                            <>
                                <Button icon="calendar" mode="contained" style={{backgroundColor: theme.colors.secondary}} onPress={() => {}}>
                                    Streak  |  {streak}
                                </Button>
                                <Button icon="chart-timeline-variant-shimmer" mode="contained" style={{backgroundColor: theme.colors.secondary}} onPress={() => {}}>
                                    Combo  |  {combo}
                                </Button>
                            </>
                        )
                    }
                </Card.Content>
            </Card>
            <View style={styles.bottom}>
                <Button mode="contained-tonal" onPress={() => { auth().signOut() }}>Sign Out</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containter: {
        padding: 20
    },
    content: {
        flexDirection: "row",
        gap: 10,
        marginTop: 5
    },
    bottom: {
        marginTop: 20,
        gap: 20
    }
});

export default UserView;
