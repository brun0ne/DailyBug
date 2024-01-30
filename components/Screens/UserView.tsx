import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, ProgressBar, Text, useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";

import { UserAPI, UserContext } from "../../util/UserContext";
import ShaderProgressBar from "../Animated/ShaderProgressBar";

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
                        <Text style={{fontSize: 20}}>✨ Level <Text style={{fontWeight: 'bold'}}>1</Text></Text>
                    </View>

                    <ShaderProgressBar text="EXP 50 / 100" progress={0.5} />

                    <View style={styles.stats}> 
                        <Button icon="calendar" mode="contained" style={{backgroundColor: theme.colors.secondary}}>
                            Streak  |  {streak}
                        </Button>
                        <Button icon="fire" mode="contained" style={{backgroundColor: theme.colors.secondary}}>
                            Combo  |  {combo}
                        </Button>
                    </View>
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
        gap: 15,
    },
    stats: {
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
