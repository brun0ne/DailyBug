import { Modal, Portal, useTheme, Text, Card, Button, Avatar } from "react-native-paper";
import { StyleSheet } from "react-native";
import { memo, useCallback, useContext } from "react";

import { UserContext } from "../util/UserContext";
import { webModalContainerStyle } from "../util/Layout";

type SkipModalProps = {
    visible: boolean

    skip: () => void
    hide: () => void
};

const SkipModal = (props: SkipModalProps) => {
    const theme = useTheme();
    
    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="skip-next-circle-outline" theme={{colors: {primary: theme.colors.primary}}} color="white" />
    ), [theme]);

    const userContext = useContext(UserContext);
    const skipItemsAmount = (userContext.progressData?.items ?? {})["Skip"]?.amount ?? 0;
    const disabled = skipItemsAmount <= 0;
    
    const skipCallback = useCallback(() => {
        props.hide();
        props.skip();
    }, []);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{"Skip"}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content>
                        <Text variant="bodyMedium">
                            You can skip this bug by using an item.
                            Your <Text style={{fontWeight: "bold"}}>combo</Text> will <Text style={{fontWeight: "bold"}}>not</Text> be affected.
                        </Text>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        <Button disabled={disabled} mode="outlined" onPress={skipCallback}>
                            <Text
                                style={{fontWeight: "bold", color: !disabled ? theme.colors.primary : theme.colors.backdrop}}
                            >
                                Use Skip ({skipItemsAmount} left)
                            </Text>
                        </Button>
                        <Button textColor={theme.colors.secondary} mode="outlined" onPress={props.hide}>Cancel</Button>
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
        padding: 20,
        ...webModalContainerStyle,
    },
    buttons: {
        marginTop: 10
    },
});

export default memo(SkipModal);
