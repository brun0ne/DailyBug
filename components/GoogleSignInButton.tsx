import { Button } from "react-native-paper";

import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
    webClientId: 'YOUR_WEB_OAUTH_CLIENT_ID',
});

const onGoogleButtonPress = async () => {
    /* Check if device supports Google Play */
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    /* Get the user ID token */
    const { idToken } = await GoogleSignin.signIn();
    /* Create a Google credential */
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    /* Sign-in  */
    return auth().signInWithCredential(googleCredential);
};

const onSignIn = () => {
    console.log("Signed in!");
}

const GoogleSignInButton = () => {
    return (
        <Button
            mode="outlined"
            onPress={() => onGoogleButtonPress().then(onSignIn)}
        >
            Sign in with Google
        </Button>
    );
};

export default GoogleSignInButton;
