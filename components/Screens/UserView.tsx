import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";

import { UserContext } from "../../util/UserContext";

import { ActivityIndicator, Avatar, Button, Card, Text, useTheme } from "react-native-paper";

const UserView = () => {
    const {user, setUser} = useContext(UserContext); 
    const theme = useTheme();

    return (
        <View style={styles.containter}>
            <Card>
                <Card.Title
                    title={<Text variant="titleLarge">{user.logged_in ? "Logged in" : "Not logged in"}</Text>}
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
                                    Streak  |  {user.streak}
                                </Button>
                                <Button icon="chart-timeline-variant-shimmer" mode="contained" style={{backgroundColor: theme.colors.secondary}} onPress={() => {}}>
                                    Combo  |  {user.combo}
                                </Button>
                            </>
                        )
                    }
                </Card.Content>
            </Card>
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
    }
});

export default UserView;
