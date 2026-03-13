import { Avatar, Button, Card, Divider, Modal, Portal, Text, useTheme } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useCallback, useContext } from "react";
import { UserContext } from "../util/UserContext";
import { webModalContainerStyle } from "../util/Layout";

type ChancesModalProps = {
    visible: boolean
    hide: () => void
};

const ChancesModal = (props: ChancesModalProps) => {
    const theme = useTheme();
    const userContext = useContext(UserContext);
    
    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="help-circle" theme={{colors: {primary: theme.colors.secondary}}} />
    ), [theme]);

    return (
        <Portal>
            <Modal visible={props.visible} onDismiss={props.hide} contentContainerStyle={styles.container}>
                <Card style={{shadowColor: 'transparent'}}>
                    <Card.Title
                        title={<Text variant="titleLarge">{"Chances"}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content>
                        <Text variant="bodyMedium">Current chances:</Text>
                        <Text variant="bodyMedium">
                            - <Text style={{fontWeight: "bold"}}>{userContext.progressData?.chances[5].toFixed(3) ?? "err"} %</Text> for a 5-star item (guaranteed every <Text style={{fontWeight: "bold"}}>80</Text> tries)
                        </Text>
                        <Text variant="bodyMedium">
                            - <Text style={{fontWeight: "bold"}}>{userContext.progressData?.chances[4].toFixed(3) ?? "err"} %</Text> for a 4-star item (guaranteed on the first sprint, and every <Text style={{fontWeight: "bold"}}>10</Text> tries)
                        </Text>
                        <Divider style={{marginTop: 15, marginBottom: 15}} />
                        <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>Formula for 5-star pull chance:</Text> 0.01 + ln(streak + 1) * 0.002 + ln(combo + 1) * 0.001 + luck</Text>
                        <Text variant="bodySmall"><Text style={{fontWeight: "bold"}}>Formula for 4-star pull chance:</Text> 0.1 + ln(streak + 1) * 0.005 + ln(combo + 1) * 0.002 + luck</Text>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        <Button textColor={theme.colors.secondary} style={styles.okButton} onPress={props.hide}>Got it!</Button>
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
        padding: 20,
        ...webModalContainerStyle,
    },
    buttons: {
        marginTop: 10
    },
    okButton: {}
});

export default ChancesModal;
