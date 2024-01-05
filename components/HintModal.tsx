import React, { useImperativeHandle } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Card, Modal, Portal, Text, useTheme } from 'react-native-paper';

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
                    <Card.Title
                        title="Hint"
                        subtitle={props.getHintText()}
                        left={(props) => <Avatar.Icon {...props} icon="help-circle" style={{ backgroundColor: theme.colors.secondary }} />}
                    />
                )}
                <Text style={styles.bottomText}>Touch anywhere to dismiss.</Text>
            </Modal>
        </Portal>
    );
};

const styles = StyleSheet.create({
    "container": {
        backgroundColor: 'white',
        padding: 20
    },
    "bottomText": {
        marginTop: 30
    }
});

export type HintModalHandle = {
    showModal: () => void;
};

export default React.forwardRef<HintModalHandle, HintModalProps>(HintModal);
