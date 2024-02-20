import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image, Linking } from 'react-native';
import { Appbar, Button, Menu, useTheme } from 'react-native-paper';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { UserContext } from '../util/UserContext';

const Header = () => {
    const theme = useTheme();
    const userContext = useContext(UserContext);

    const [streak, setStreak] = useState(0);
    const [combo, setCombo] = useState(0);

    const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

    const statsOffset = useSharedValue(-200);
    const logoOffset = useSharedValue(0);

    useEffect(() => {
        const newStreak = userContext.progressData?.streak ?? 0;
        const newCombo = userContext.progressData?.combo ?? 0;

        if (!(
            (newStreak !== streak) ||
            (combo === 0 && newCombo === 1) ||
            (newCombo !== combo && newCombo % 10 === 0) ||
            (newStreak !== 0 && combo !== 0 && newCombo === 0)
        )) {
            return;
        }

        setStreak(newStreak);
        setCombo(newCombo);

        if (streak === 0 && combo === 0) {
            /* show logo */
            logoOffset.value = withTiming(0);
            statsOffset.value = withTiming(-200);

            return;
        }

        /* show stats */
        logoOffset.value = withTiming(-200);
        statsOffset.value = withTiming(0);

        setTimeout(() => {
            /* show logo */
            logoOffset.value = withTiming(0);
            statsOffset.value = withTiming(-200);
        }, 2500);
    }, [userContext]);

    const statsStyles = useAnimatedStyle(() => {
        return {
            top: statsOffset.value
        };
    }, [statsOffset]);

    const logoStyles = useAnimatedStyle(() => {
        return {
            marginLeft: logoOffset.value
        };
    }, [logoOffset]);

    const privacyPolicyCallback = useCallback(() => {
        Linking.openURL('https://dailybug.app/privacy');
    }, []);

    const contactCallback = useCallback(() => {
        Linking.openURL('mailto:brunonblok@gmail.com');
    }, []);

    return (
        <Appbar.Header elevated>
            <View>
                <Animated.View style={[statsStyles, styles.stats]}> 
                    <Button icon="calendar" mode="outlined" textColor="black">
                        {streak}
                    </Button>
                    <Button icon="fire" mode="outlined" textColor="black">
                        {combo}
                    </Button>
                </Animated.View>

                <Animated.View style={[logoStyles, styles.logo]}>
                    <Image source={require("../assets/adaptive-icon.png")} style={{ width: 60, height: 60, margin: 10 }} />
                    <Appbar.Content title="Daily Bug" />
                </Animated.View>

                <Menu
                    visible={moreOptionsVisible}
                    onDismiss={() => {setMoreOptionsVisible(false)}}
                    anchor={{x: 800, y: 100}}
                >
                    <Menu.Item onPress={privacyPolicyCallback} title="Privacy Policy" />
                    <Menu.Item onPress={contactCallback} title="Contact us" />
                </Menu>
            </View>
            <Appbar.Action style={{position: "absolute", right: 0}} icon="dots-vertical" onPress={() => {setMoreOptionsVisible(true)}} />
        </Appbar.Header>
    )
};

const styles = StyleSheet.create({
    stats: {
        position: "absolute",
        flexDirection: "row",
        gap: 10,
        padding: 10,

        left: 0,
        marginTop: 10
    },
    logo: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
    }
});

export default Header;
