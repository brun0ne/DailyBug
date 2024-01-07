import React, { useImperativeHandle, memo, useCallback } from 'react';
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

    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="help-circle" style={{ backgroundColor: theme.colors.secondary }} />
    ), [theme]);

    return (
        <Portal>
            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
                { props.isLoading() ? (
                    <ActivityIndicator />
                ) : (
                    <Card>
                        <Card.Title
                            title={<Text variant="titleLarge">{"Hint"}</Text>}
                            left={titleLeftCallback}
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

export default memo(React.forwardRef<HintModalHandle, HintModalProps>(HintModal));
