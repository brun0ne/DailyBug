import { ReactNode, useContext, useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Avatar, Button, Card, Divider, Text, useTheme } from "react-native-paper";

import { Entries } from 'type-fest';

import { useIsFocused } from '@react-navigation/native';

import { ItemType, UserContext } from "../../util/UserContext";
import ShaderProgressBar from "../Animated/ShaderProgressBar";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";
import Item from "../Item";
import ItemModal from "../ItemModal";
import { GoogleButton, invokeGoogleSignIn } from "../SignInModal";

import { itemImages } from "../../util/ItemImages";
import DuckModal from "../CustomItemModals/DuckModal";

const UserView = () => {
    const userContext = useContext(UserContext); 
    const theme = useTheme();

    const isFocused = useIsFocused();

    const displayName = useMemo(() => {
        if ((userContext.user.displayName ?? "").includes(" ")) {
            return userContext.user.displayName.split(" ")[0];
        }
        else {
            return userContext.user.displayName ?? "Anonymous";
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
        ),
        "Cookie": (
            <>Legends say that some people use them to enhance user experience.</>
        ),
        "Rubber Duck": (
            <>Talking to the <Text style={{fontWeight: "bold"}}>Rubber Duck</Text> greatly impoves one's debugging capabilities.</>
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

    const customModals: Record<string, (name: string, item: ItemType) => React.JSX.Element> = {
        "Rubber Duck": (
            (name: string, item: ItemType) => (
                <DuckModal
                    key={`modal_${name}`}

                    visible={itemModalsVisible[name]}
                    hide={() => { 
                        hasModal(name) ?
                            setItemModalVisible(name, false) :
                            () => {}
                    }}
                    
                    item={item}
                    image={itemImages[name]}
                >
                    {itemDescriptions[name]}
                </DuckModal>
            )
        )
    };

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
        <ScrollView style={styles.containter} contentContainerStyle={{padding: 20}}>
            <Card>
                <Card.Title
                    title={<Text variant="titleMedium" style={{fontSize: 22, lineHeight: 40}}>{displayName}</Text>}
                    left={(props) => (
                            userContext.user.photoURL ?
                                <Avatar.Image {...props} source={{uri: userContext.user.photoURL}} /> :
                                <Avatar.Icon {...props} icon="account" theme={{colors: {primary: theme.colors.secondary}}} />
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
                        <Button icon="calendar" mode="contained" buttonColor={theme.colors.secondary}>
                            Streak  |  {userContext.progressData?.streak ?? 0}
                        </Button>
                        <Button icon="fire" mode="contained" buttonColor={theme.colors.secondary}>
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
                        Object.entries(userContext.progressData?.items ?? {})
                            .filter(([name, item]) => item.amount > 0 || !item.hiddenIfNotOwned)
                            .map(([name, item]) =>
                            (
                                <Item
                                    key={`key_${name}_${item.amount}`}
                                    name={name}
                                    item={item}
                                    pressable={hasModal(name)}
                                    onPress={() => {
                                        hasModal(name) ?
                                            setItemModalVisible(name, true) :
                                            () => {}
                                    }}
                                    image={itemImages[name] ?? null}
                                />
                            ))
                    }
                </View>
            </View>

            {
                Object.entries(userContext.progressData?.items ?? {}).map(([name, item]) => (
                    hasModal(name) ? (
                        customModals[name] ? (
                            customModals[name](name, item)
                        ) : (
                            <ItemModal
                                key={`modal_${name}`}

                                visible={itemModalsVisible[name]}
                                hide={() => { 
                                    hasModal(name) ?
                                        setItemModalVisible(name, false) :
                                        () => {}
                                }}

                                name={name}
                                item={item}
                                image={itemImages[name] ?? null}

                                canBeActivated={itemActions[name]?.canBeActivated ?? false}

                                actionButtons={itemActions[name]?.other ?? null}
                            >
                                {itemDescriptions[name]}
                            </ItemModal>
                        )
                    ) : null
                ))
            }

            {
                userContext.user.isAnonymous ? (
                    <View style={{marginTop: 20}}>
                        <GoogleButton onPress={() => { invokeGoogleSignIn(true) }} color="black" backgroundColor="white" disabled={false}>
                            <Text style={{fontWeight: "bold"}}>Sign in with Google</Text>
                        </GoogleButton>
                    </View>
                ) : <></>
            }

            {/* <View style={styles.bottom}>
                <Button mode="contained-tonal" onPress={() => { auth().signOut() }}>Sign Out</Button>
            </View> */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containter: {
        height: "100%",
        overflow: "visible"
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
        paddingTop: 10,
        flexWrap: "wrap"
    },
    bottom: {
        marginTop: 20,
        gap: 20
    }
});

export default UserView;
