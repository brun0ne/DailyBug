import { Avatar, Button, Card, Modal, Portal, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { ReactNode, useCallback } from "react";

type ItemModalProps = {
    visible: boolean
    hide: () => void

    name: string
    icon: string
    color: string

    actionButtons?: ReactNode
    
    children?: ReactNode
};

const ItemModal = (props: ItemModalProps) => {
    const theme = useTheme();

    const titleLeftCallback = useCallback((callbackProps) => (
        <Avatar.Icon {...callbackProps} icon={props.icon} style={{ backgroundColor: props.color }} color="white" />
    ), [props.icon, props.color]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{props.name}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content>
                        <Text variant="bodyMedium">
                            {props.children}
                        </Text>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        {props.actionButtons}
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
