import { useContext, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Button, Card, Divider, Text, useTheme } from "react-native-paper";

import auth from "@react-native-firebase/auth";

import { useIsFocused } from '@react-navigation/native';

import { UserContext } from "../../util/UserContext";
import ShaderProgressBar from "../Animated/ShaderProgressBar";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";
import Item from "../Item";

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

            <View style={styles.currency}>
                <ShaderFlatDisplay text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
            </View>

            <View style={styles.items}>
                <Text style={{fontSize: 25}}>Items</Text>
                <Divider />
                <View style={styles.itemsRow}>
                    {
                        Object.entries(userContext.progressData?.items).map(([name, item]) => (
                            <Item key={`key_${name}_${item.amount}`} name={name} amount={item.amount} color={item.color} icon={item.icon} />
                        ))
                    }
                </View>
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
    currency: {
        flexDirection: "column",
        gap: 10,
        marginTop: 20,
        width: "100%"
    },
    items: {
        marginTop: 20
    },
    itemsRow: {
        flexDirection: "row",
        gap: 10,
        width: "100%",
        paddingTop: 10
    },
    bottom: {
        marginTop: 20,
        gap: 20
    }
});

export default UserView;
