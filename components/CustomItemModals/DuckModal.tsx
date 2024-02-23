import { Avatar, Button, Card, Divider, Icon, Modal, Portal, Text, useTheme } from "react-native-paper";
import { ActivityIndicator, StyleSheet, View, Image } from "react-native";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ItemType, UserAPI, UserContext } from "../../util/UserContext";

import { type CustomItemModal } from "./CustomItemModal";

type ItemModalProps = {
    visible: boolean
    hide: () => void

    item: ItemType
    image?: any

    children?: ReactNode
};

const DuckModal: CustomItemModal = (props: ItemModalProps) => {
    const theme = useTheme();
    const userContext = useContext(UserContext);

    const name = "Rubber Duck";

    const titleLeftCallback = useCallback((callbackProps) => (
        props.image ? (
            <Avatar.Image source={props.image} size={45} />    
        ) : (
            <Avatar.Icon {...callbackProps} icon={props.item.icon} style={{ backgroundColor: props.item.stars !== 5 ? props.item.color : "blue" }} color="white" />
        )
    ), [props.item]);

    const cookiesAmount = (userContext.progressData?.items["Cookie"] ?? {}).amount ?? 0;
    const duckLuckLevel = props.item.special?.level ?? 1;

    console.log(userContext.progressData?.other.canFeedDuck);

    const actionDisabled = cookiesAmount <= 0 || !(userContext.progressData?.other.canFeedDuck);
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        setActivating(false);
    }, [props.item, userContext]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} dismissable={false} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{name}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content style={{flexDirection: "column", gap: 10}}>
                        <View style={{flexDirection: "row", gap: 0}}>
                            {
                                [...Array(props.item?.stars ?? 0)].map((_, i) => {
                                    return <Icon key={`star_${i}`} source={"star"} size={20} color={"black"} />;
                                })
                            }
                        </View>

                        {
                            props.item.active ? (
                                <>
                                    <Text style={{color: theme.colors.secondary, fontWeight: "bold"}}>Activated</Text>
                                    <Divider style={{marginTop: 10, marginBottom: 10}} />
                                </>
                            ) : null
                        }

                        <Text variant="bodyMedium" style={{fontWeight: "bold"}}>
                            Luck Level: {duckLuckLevel} / 10 {duckLuckLevel >= 10 ? "[MAX]" : null}
                        </Text>

                        <Divider />

                        <Text variant="bodyMedium">
                            {props.children}
                        </Text>

                        <Divider />

                        <Text variant="bodyMedium">
                            Feed it <Text variant="bodyMedium" style={{fontWeight: "bold"}}>Cookies</Text> to increase the Luck Level, which may increase your chances of better rewards!
                        </Text>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        <Button disabled={actionDisabled} mode="outlined" onPress={() => {
                            UserAPI.doActivateItem(userContext, name);
                            setActivating(true);
                        }}>
                            {
                                !actionDisabled ? (
                                    <Text style={{fontWeight: "bold", color: theme.colors.primary}}>
                                        Feed {!activating ? `(${cookiesAmount ?? 0} Cookies left)`
                                            : <ActivityIndicator color={theme.colors.primary} size={14} style={{paddingLeft: 5}} />}
                                    </Text>
                                ) : (
                                    <Text style={{fontWeight: "bold", color: theme.colors.backdrop}}>
                                        Feed (wait a day)
                                    </Text>
                                )
                            }
                        </Button>

                        <Button textColor={theme.colors.secondary} mode="outlined" onPress={props.hide}>Close</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        shadowColor: 'transparent',
        padding: 20
    },
    buttons: {
        marginTop: 10
    },
});

export default DuckModal;
