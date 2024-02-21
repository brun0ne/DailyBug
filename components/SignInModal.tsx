import { Card, Modal, Portal, useTheme, Text, Avatar, Button } from "react-native-paper";
import { StyleSheet, TouchableOpacity, Image, Pressable } from "react-native";

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { View } from "react-native";
import { ReactElement, useCallback } from "react";

export const invokeAnonymousSignIn = async () => {
    auth()
        .signInAnonymously()
        .then(() => {
            console.log('User signed in anonymously');
        })
        .catch(error => {
            if (error.code === 'auth/operation-not-allowed') {
                console.log('Enable anonymous in your firebase console.');
            }

            console.error(error);
        });
};

GoogleSignin.configure({
    webClientId: 'YOUR_WEB_OAUTH_CLIENT_ID',
});

export const invokeGoogleSignIn = async (link: boolean = false) => {
    /* Check if device supports Google Play */
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    /* Get the user ID token */
    const { idToken } = await GoogleSignin.signIn();
    /* Create a Google credential */
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    /* Sign-in  */
    if (link) {
        const linked = await auth().currentUser.linkWithCredential(googleCredential).catch((e) => false);
        console.log(linked);
        if (!linked)
            return await invokeGoogleSignIn();
    }
    else
        return auth().signInWithCredential(googleCredential);
};

type GoogleButtonProps = {
    color: string,
    backgroundColor: string,
    disabled: boolean,

    onPress: () => void

    children?: ReactElement
}

const logoSource = require('../assets/google-logo.png');

export const GoogleButton = (props: GoogleButtonProps) => {
    return (
        <TouchableOpacity {...props} onPress={props.onPress} style={[
            GoogleButtonStyles.container,
            {
                opacity: props.disabled ? 0.5 : 1,
                backgroundColor: props.backgroundColor,
            },
        ]}>
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Image style={GoogleButtonStyles.logo} source={logoSource} />
                <Text style={[GoogleButtonStyles.label, { color: props.color }]}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    );
}

const GoogleButtonStyles = StyleSheet.create({
    container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    logo: {
        position: 'absolute',
        left: 20,
        width: 20,
        height: 20,
        marginRight: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
})

const SignInModal = (props: { visible: boolean, hide: () => void }) => {
    const theme = useTheme();

    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="account" style={{ backgroundColor: theme.colors.secondary }} />
    ), [theme]);

    return (
        <Portal>
            <Modal visible={props.visible} dismissable={false} contentContainerStyle={styles.container}>
                <Card style={{ shadowColor: 'transparent' }}>
                    <Card.Title
                        title={<Text variant="titleLarge">{"Sign in"}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content style={{gap: 30, marginTop: 10}}>
                        <GoogleButton onPress={() => { invokeGoogleSignIn(); props.hide() }} color="black" backgroundColor="white" disabled={false}>
                            <Text variant="bodyMedium" style={{fontWeight: "bold"}}>Sign in with Google</Text>
                        </GoogleButton>
                        <View style={{justifyContent: "center", alignItems: "center"}}>
                            <Button
                                onPress={() => { invokeAnonymousSignIn(); props.hide() }}
                                mode={"elevated"}
                            >
                                <Text variant="bodySmall" style={{color: "gray"}} >Later (progress may be lost)</Text>
                            </Button>
                        </View>
                    </Card.Content>
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
        padding: 20
    },
    buttons: {
        marginTop: 10
    },
    okButton: {}
});

export default SignInModal;
