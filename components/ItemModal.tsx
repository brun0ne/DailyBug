import { Avatar, Button, Card, Divider, Modal, Portal, Text, useTheme } from "react-native-paper";
import { ActivityIndicator, StyleSheet } from "react-native";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { UserAPI, UserContext } from "../util/UserContext";

type ItemModalProps = {
    visible: boolean
    hide: () => void

    name: string
    icon: string
    color: string
    amount: number
    active: boolean

    canBeActivated?: boolean
    actionButtons?: ReactNode
    
    children?: ReactNode
};

const ItemModal = (props: ItemModalProps) => {
    const theme = useTheme();
    const userContext = useContext(UserContext);

    const titleLeftCallback = useCallback((callbackProps) => (
        <Avatar.Icon {...callbackProps} icon={props.icon} style={{ backgroundColor: props.color }} color="white" />
    ), [props.icon, props.color]);

    const actionDisabled = (props.amount <= 0 ?? true) || props.active;
    const [activating, setActivating] = useState(false);

    useEffect(() => {
        setActivating(false);
    }, [props.active, userContext]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{props.name}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content>
                        {
                            props.active ? (
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
                                            Activate {props.name} {!activating ? `(${props.amount ?? 0} left)`
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
