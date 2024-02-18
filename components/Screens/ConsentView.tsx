import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Portal, Modal, Card, Text, Avatar, Button, useTheme, Switch } from "react-native-paper";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConsentView = ({ consentGivenCallback, consent }: { consentGivenCallback: () => void, consent: boolean }) => {
    const theme = useTheme();

    const titleLeftCallback = useCallback((callbackProps) => (
        <Avatar.Icon {...callbackProps} icon={"file-document-outline"} style={{ backgroundColor: theme.colors.secondary }} color="white" />
    ), []);

    const termsCallback = useCallback(() => {
        Linking.openURL('https://example.com');
    }, []);

    const privacyPolicyCallback = useCallback(() => {
        Linking.openURL('https://example.com');
    }, []);

    const [agreeSwitch, setAgreeSwitch] = useState(false);

    const consentGiven = useCallback(async () => {
        consentGivenCallback();

        try {
            await AsyncStorage.setItem("user_consent", JSON.stringify(true));
        }
        catch (e) {
            console.error(e);
        }
    }, []);

    const loadConsent = async () => {
        try {
            const value = await AsyncStorage.getItem("user_consent");
            if (value !== null) {
                const consent = JSON.parse(value);
                if (consent)
                    consentGivenCallback();
            }
        }
        catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        loadConsent();
    }, []);

    return (
        <Portal>
            <Modal visible={!consent} dismissable={false} contentContainerStyle={styles.container}>
                <Card>
                    <Card.Title
                        title={<Text variant="titleLarge">{"Consent"}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content>
                        <Text variant="bodyLarge">
                            To continue using our app, please read and agree to our
                            <Text> </Text>
                            <Text onPress={termsCallback} style={{ color: "blue", textDecorationLine: "underline" }}>Terms and Conditions</Text>
                            <Text> </Text>
                            and
                            <Text> </Text>
                            <Text onPress={privacyPolicyCallback} style={{ color: "blue", textDecorationLine: "underline" }}>Privacy Policy</Text>.
                        </Text>

                        <View style={styles.lower}>
                            <Text style={{ fontWeight: "bold" }}>I have read and agree to the terms</Text>
                            <Switch value={agreeSwitch} onValueChange={(value) => { setAgreeSwitch(value) }} />
                        </View>
                    </Card.Content>

                    <Card.Actions style={styles.buttons}>
                        <Button disabled={!agreeSwitch} mode={"elevated"} textColor={theme.colors.secondary} onPress={consentGiven}>Continue</Button>
                    </Card.Actions>
                </Card>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "gray",
        flexGrow: 1
    },
    container: {
        padding: 20
    },
    lower: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 15,
        alignItems: "center",
        flexWrap: "wrap"
    },
    buttons: {
        padding: 20
    },
});

export default ConsentView;
