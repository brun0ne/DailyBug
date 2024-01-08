import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Button, Card, Modal, Portal, Text, useTheme } from 'react-native-paper';

export type HintModalProps = {
    visible: boolean;
    hide: () => any;
    isLoading: () => boolean;
    getHintText: () => string;
};

const HintModal = (props: HintModalProps) => {
    const theme = useTheme();

    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="help-circle" style={{ backgroundColor: theme.colors.secondary }} />
    ), [theme]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
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
                            <Button textColor={theme.colors.secondary} style={styles.okButton} onPress={props.hide}>Got it!</Button>
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

export default memo(HintModal);
