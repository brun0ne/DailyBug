import { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { UserContext } from '../util/UserContext';

const Header = () => {
    const theme = useTheme();
    const userContext = useContext(UserContext);

    const [streak, setStreak] = useState(0);
    const [combo, setCombo] = useState(0);

    const statsOffset = useSharedValue(-200);
    const logoOffset = useSharedValue(0);

    useEffect(() => {
        const newStreak = userContext.progressData?.streak ?? 0;
        const newCombo = userContext.progressData?.combo ?? 0;

        if (newStreak === streak && newCombo === combo) {
            return;
        }

        setStreak(newStreak);
        setCombo(newCombo);

        if (streak === 0 && combo === 0) {
            /* show logo */
            logoOffset.value = 0;
            statsOffset.value = -200;

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

    return (
        <Appbar.Header elevated>
            <View>
                <Animated.View style={[{top: statsOffset, left: 0}, styles.stats]}> 
                    <Button icon="calendar" mode="outlined" textColor="black">
                        Streak | {streak}
                    </Button>
                    <Button icon="fire" mode="outlined" textColor="black">
                        Combo | {combo}
                    </Button>
                </Animated.View>

                <Animated.View style={{marginLeft: logoOffset, flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <MaterialCommunityIcons name="bug-check" color={theme.colors.primary} size={35} style={{ margin: 10 }}/>
                    <Appbar.Content title="Daily Bug" />
                </Animated.View>
            </View>
            <Appbar.Action style={{position: "absolute", right: 0}} icon="dots-vertical" onPress={() => {}} />
        </Appbar.Header>
    )
};

const styles = StyleSheet.create({
    stats: {
        position: "absolute",
        flexDirection: "row",
        gap: 10,
        padding: 10
    }
});

export default Header;
