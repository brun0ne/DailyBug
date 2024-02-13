import { Avatar, Button, Card, Divider, Icon, Modal, Portal, Text, useTheme } from "react-native-paper";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { ItemType, UserAPI, UserContext } from "../util/UserContext";

type ItemModalProps = {
    visible: boolean
    hide: () => void

    name: string
    item: ItemType

    canBeActivated?: boolean
    actionButtons?: ReactNode
    
    children?: ReactNode
};

const ItemModal = (props: ItemModalProps) => {
    const theme = useTheme();
    const userContext = useContext(UserContext);

    const titleLeftCallback = useCallback((callbackProps) => (
        <Avatar.Icon {...callbackProps} icon={props.item.icon} style={{ backgroundColor: props.item.stars !== 5 ? props.item.color : "blue" }} color="white" />
    ), [props.item]);

    const actionDisabled = (props.item.amount <= 0 ?? true) || props.item.active;
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        setActivating(false);
    }, [props.item, userContext]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{props.name}</Text>}
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

                        <Text variant="bodyMedium">
                            {props.children}
                        </Text>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        {props.actionButtons}
                        {
                            props.canBeActivated ? (
                                <Button disabled={actionDisabled} mode="outlined" onPress={() => {
                                    UserAPI.doActivateItem(userContext, props.name);
                                    setActivating(true);
                                }}>
                                    {
                                        <Text style={{fontWeight: "bold", color: !actionDisabled ? theme.colors.primary : theme.colors.backdrop}}>
                                            Activate {props.name} {!activating ? `(${props.item.amount ?? 0} left)`
                                                : <ActivityIndicator color={theme.colors.primary} size={14} style={{paddingLeft: 5}} />}
                                        </Text>
                                    }
                                </Button>
                            ): null
                        }
                        <Button textColor={theme.colors.secondary} mode="outlined" onPress={props.hide}>Close</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
}

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

export default ItemModal;
