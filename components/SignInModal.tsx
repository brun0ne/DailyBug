import { Card, Modal, Portal, useTheme, Text, Avatar, Button } from "react-native-paper";
import { StyleSheet, TouchableOpacity, Image, Platform } from "react-native";

import { auth } from '../firebaseConfig';
import { GoogleAuthProvider, linkWithCredential, linkWithPopup, signInAnonymously, signInWithCredential, signInWithPopup } from 'firebase/auth';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { View } from "react-native";
import { ReactElement, useCallback } from "react";

export const invokeAnonymousSignIn = async () => {
    signInAnonymously(auth)
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

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID = 'YOUR_WEB_OAUTH_CLIENT_ID';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_ANDROID_OAUTH_CLIENT_ID';

const googleDiscovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export const invokeGoogleSignIn = async (link: boolean = false) => {
    if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();

        if (link) {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                throw new Error("No current user available for linking");
            }

            return linkWithPopup(currentUser, provider);
        }

        return signInWithPopup(auth, provider);
    }

    const request = new AuthSession.AuthRequest({
        clientId: Platform.OS === 'android' ? GOOGLE_ANDROID_CLIENT_ID : GOOGLE_WEB_CLIENT_ID,
        responseType: AuthSession.ResponseType.IdToken,
        scopes: ['openid', 'profile', 'email'],
        redirectUri: AuthSession.makeRedirectUri(),
        extraParams: {
            prompt: 'select_account',
            nonce: String(Date.now()),
        },
    });

    const response = await request.promptAsync(googleDiscovery);

    if (response.type !== 'success') {
        throw new Error('Google sign-in was cancelled or failed.');
    }

    const idToken = response.params?.id_token;
    if (!idToken) {
        throw new Error('No id token returned from Google sign-in.');
    }

    const googleCredential = GoogleAuthProvider.credential(idToken);

    if (link) {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("No current user available for linking");
        }

        const linked = await linkWithCredential(currentUser, googleCredential).catch(() => false);
        if (!linked) {
            return await invokeGoogleSignIn();
        }

        return linked;
    }

    return signInWithCredential(auth, googleCredential);
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

const SignInModal = (props: { visible: boolean, show: () => void, hide: () => void }) => {
    const theme = useTheme();

    const titleLeftCallback = useCallback((props) => (
        <Avatar.Icon {...props} icon="account" theme={{colors: {primary: theme.colors.secondary}}} />
    ), [theme]);

    const googleSingInCallback = useCallback(async () => {
        try {
            await invokeGoogleSignIn();
            props.hide();
        }
        catch (e) {
            props.show();
        }
    }, [props]);

    const anonymousSingInCallback = useCallback(async () => {
        try {
            await invokeAnonymousSignIn();
            props.hide();
        }
        catch (e) {
            props.show();
        }
    }, [props]);

    return (
        <Portal>
            <Modal visible={props.visible} dismissable={false} contentContainerStyle={styles.container}>
                <Card style={{ shadowColor: 'transparent' }}>
                    <Card.Title
                        title={<Text variant="titleLarge">{"Sign in"}</Text>}
                        left={titleLeftCallback}
                    />

                    <Card.Content style={{gap: 30, marginTop: 10}}>
                        {
                            props.visible ? <>
                                <GoogleButton onPress={googleSingInCallback} color="black" backgroundColor="white" disabled={false}>
                                    <Text variant="bodyMedium" style={{fontWeight: "bold"}}>Sign in with Google</Text>
                                </GoogleButton>
                                <View style={{justifyContent: "center", alignItems: "center"}}>
                                    <Button
                                        onPress={anonymousSingInCallback}
                                        mode={"elevated"}
                                    >
                                        <Text variant="bodySmall" style={{color: "gray"}} >Later (progress may be lost)</Text>
                                    </Button>
                                </View>   
                            </> : null
                        }
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
