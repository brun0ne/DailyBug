import { ReactNode, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Divider, Text, useTheme } from "react-native-paper";

import { Entries } from 'type-fest';

import auth from "@react-native-firebase/auth";

import { useIsFocused } from '@react-navigation/native';

import { UserAPI, UserContext } from "../../util/UserContext";
import ShaderProgressBar from "../Animated/ShaderProgressBar";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";
import Item from "../Item";
import ItemModal from "../ItemModal";

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

    /* items */
    const itemDescriptions = {
        "Skip": (
            <>It can be used for skipping bugs, keeping your <Text style={{fontWeight: "bold"}}>combo</Text> unaffected.</>
        ),
        "Saver": (
            <>
                When activated, protects you from loosing the <Text style={{fontWeight: "bold"}}>Streak</Text>.
                It breaks and loses its power after saving you from <Text style={{fontWeight: "bold"}}>1 missed day</Text>.
            </>
        )
    } satisfies Record<string, ReactNode>;

    const itemActions = {
        "Saver": {
            canBeActivated: true,
            other: null
        }
    } satisfies Record<string, {canBeActivated: boolean, other?: ReactNode}>;

    const defaultModalState = useMemo(() => {
        let obj = {} as Record<keyof typeof itemDescriptions, boolean>;

        for (const [name, _] of Object.entries(itemDescriptions) as Entries<typeof itemDescriptions>) {
            obj[name] = false;
        }

        return obj;
    }, []);

    const [itemModalsVisible, setItemModalsVisible] = useState<Record<keyof typeof itemDescriptions, boolean>>(defaultModalState);

    const setItemModalVisible = (name: keyof typeof itemDescriptions, value: boolean) => {
        setItemModalsVisible({...itemModalsVisible, [name]: value});
    };

    const hasModal = (s: string): s is keyof typeof itemDescriptions => {
        return s in itemDescriptions;
    };

    /* render only if visible */
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
                            <Item
                                key={`key_${name}_${item.amount}`}
                                name={name}
                                amount={item.amount}
                                color={item.color}
                                icon={item.icon}
                                pressable={hasModal(name)}
                                onPress={() => {
                                    hasModal(name) ?
                                        setItemModalVisible(name, true) :
                                        () => {}
                                }}
                            />
                        ))
                    }
                </View>
            </View>

            {
                Object.entries(userContext.progressData?.items).map(([name, item]) => (
                    hasModal(name) ? (
                        <ItemModal
                            key={`modal_${name}`}

                            visible={itemModalsVisible[name]}
                            hide={() => { 
                                hasModal(name) ?
                                    setItemModalVisible(name, false) :
                                    () => {}
                            }}

                            name={name}
                            color={item.color}
                            icon={item.icon}
                            amount={item.amount}

                            active={item.active ?? false}
                            canBeActivated={itemActions[name]?.canBeActivated ?? false}

                            actionButtons={itemActions[name]?.other ?? null}
                        >
                            {itemDescriptions[name]}
                        </ItemModal>
                    ) : null
                ))
            }

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
