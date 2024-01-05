import React, { useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Modal, Portal, Text, useTheme } from 'react-native-paper';

export type HintModalProps = {
    isLoading: () => boolean;
    getHintText: () => string;
};

const HintModal = (props: HintModalProps, ref) => {
    const [visible, setVisible] = React.useState(false);

    const theme = useTheme();

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    useImperativeHandle(ref, () => ({
        showModal
    }));

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
                { props.isLoading() ? (
                    <ActivityIndicator />
                ) : (
                    <Card>
                        <Card.Title
                            title={<Text variant="titleLarge">{"Hint"}</Text>}
                            left={ (props) => <Avatar.Icon {...props} icon="help-circle" style={{ backgroundColor: theme.colors.secondary }} /> }
                        />

                        <Card.Content>
                            <Text variant="bodyMedium">{props.getHintText()}</Text>
                        </Card.Content>

                        <Card.Actions style={styles.buttons}>
                            <Button textColor={theme.colors.secondary} style={styles.okButton} onPress={hideModal}>Got it!</Button>
                        </Card.Actions>
                    </Card>
                )}
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
    okButton: {}
});

export type HintModalHandle = {
    showModal: () => void;
};

export default React.forwardRef<HintModalHandle, HintModalProps>(HintModal);
