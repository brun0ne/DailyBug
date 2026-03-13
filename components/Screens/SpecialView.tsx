import { Image, View, StyleSheet, useWindowDimensions } from "react-native";
import { Icon, IconButton, Text } from "react-native-paper";
import { useCallback, useContext, useEffect, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode } from "expo-av";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

import ShaderButton from "../Animated/ShaderButton";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

import { SprintRewardType, UserAPI, UserContext } from "../../util/UserContext";
import SprintReward from "../Animated/SprintReward";

import ChancesModal from "../ChancesModal";

const sprintGoldVid = require("../../assets/Sprint/gold.mp4");
const sprintPurpleVid = require("../../assets/Sprint/purple.mp4");
const sprintBlueVid = require("../../assets/Sprint/blue.mp4");

const bg = require("../../assets/banner/bg.png");
const duck_only = require("../../assets/banner/duck_only.png");
const duck_stars = require("../../assets/banner/duck_stars.png");
const s4_only = require("../../assets/banner/s4_only.png");
const s4_stars_only = require("../../assets/banner/s4_stars_only.png");

const SpecialView = () => {
    const userContext = useContext(UserContext);
    const isFocused = useIsFocused();

    const [rollingPending, setRollingPending] = useState(false);
    const [rolling, setRolling] = useState<5 | 4 | 3 | false>(false);
    const [rolledItem, setRolledItem] = useState<SprintRewardType>(null);
    const [rewardVisible, setRewardVisible] = useState(false);

    const [chancesViewVisible, setChancesViewVisible] = useState(false);

    const blackCoverOpacity = useSharedValue(0);

    const sprintCallback = useCallback(async () => {
        blackCoverOpacity.value = withTiming(1, {
            duration: 500
        });
        setRollingPending(true);

        const res = await UserAPI.doSprint(userContext);
        setRollingPending(false);
        setRolledItem(res);

        if (!res.reward)
            return;

        setRolling(res.reward.stars);
    }, [userContext]);

    const onSprintVideoEnd = useCallback(() => {
        setRolling(false);
    }, []);

    const onClose = useCallback(() => {
        setRolling(false);
        setRewardVisible(false);
        setRolledItem(null);

        blackCoverOpacity.value = withTiming(0);
    }, []);

    useEffect(() => {
        if (isFocused) {
            setRollingPending(false);
            setRolling(false);
            setRewardVisible(false);
            setRolledItem(null);

            blackCoverOpacity.value = withTiming(0);
        }
    }, [isFocused]);

    /* chances */
    const showChances = useCallback(() => {
        setChancesViewVisible(true);
    }, []);

    const hideChances = useCallback(() => {
        setChancesViewVisible(false);
    }, []);

    /* responsive */
    const {height, width} = useWindowDimensions();

    const ratio = width / height;
    const tabletRatio = ratio > 0.70 ? true : false;

    /* animated styles */
    const sine = useSharedValue(0);

    useEffect(() => {
        sine.value = 0;
        sine.value = withRepeat(
            withTiming(100, {
                duration: 1000,
                easing: Easing.bezier(0.5, 0.6, 0.7, 0.5)
            }),
            -1,
            true
        );
    }, []);

    const duckStyles = useAnimatedStyle(() => (
        { marginTop: Math.sin(sine.value / 100 + 15) * 6 }
    ), [sine]);

    const duckStarsStyles = useAnimatedStyle(() => (
        { marginTop: Math.sin(sine.value / 100 + 15) * 3 }
    ), [sine]);

    const s4Styles = useAnimatedStyle(() => (
        { marginTop: Math.sin(sine.value / 100 + 15 + 3.14) * 4 }
    ), [sine]);

    const s4StarsStyles = useAnimatedStyle(() => (
        { marginTop: Math.sin(sine.value / 100 + 15 + 3.14) * 2 }
    ), [sine]);

    if (!isFocused)
        return <></>;

    return (
        <View style={{flexGrow: 1, backgroundColor: "#170112"}}>
            <View style={{width: "100%", height: "auto", justifyContent: "flex-start"}}>
                <Image source={bg} style={styles.image} />
                <Animated.Image source={duck_only} style={[duckStyles, styles.image]} />
                <Animated.Image source={duck_stars} style={[duckStarsStyles, styles.image]} />
                <Animated.Image source={s4_only} style={[s4Styles, styles.image]} />
                <Animated.Image source={s4_stars_only} style={[s4StarsStyles, styles.image]} />
            </View>
            
            <View style={styles.storyPoints}>
                <ShaderFlatDisplay showBackground={false} text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
            </View>

            <IconButton icon={"help"} style={{position: "absolute", top: 10, left: 10}} mode={"contained-tonal"} onPress={showChances} />
            
            <View style={[styles.main, {bottom: !tabletRatio ? 160 : 100}]}>
                <Text variant={"titleLarge"} style={{fontSize: 25, color: "white"}}>SPRINT</Text>

                {
                    !tabletRatio ? <Icon source="run-fast" color="white" size={50} /> : null
                }

                <ShaderButton
                    disabled={(userContext.progressData?.currency ?? 0) < 150 || rollingPending || rolling !== false || rewardVisible}
                    text={"Use 150 Story Points"}
                    onPress={sprintCallback}
                    jumpingText={false}
                />
            </View>

            {
                rolling !== false ? (
                    <Video
                        source={(() => {
                            switch (rolling) {
                                case 5:
                                    return sprintGoldVid;
                                case 4:
                                    return sprintPurpleVid;
                                default:
                                    return sprintBlueVid;
                            }
                        })()}
                        onError={(e) => {console.log(e)}}
                        style={styles.video}
                        resizeMode={ResizeMode.COVER}
                        progressUpdateIntervalMillis={100}
                        onPlaybackStatusUpdate={(status) => {
                            if ((status as any).positionMillis >= 4600 && !rewardVisible && rolledItem) {
                                setRewardVisible(true);
                            }

                            if((status as any).didJustFinish) {
                                onSprintVideoEnd();
                            }
                        }}
                        shouldPlay={true}
                    />
                    )
                    : null
            }

            {
                rollingPending || rolling || rewardVisible ?
                    <Animated.View style={[{opacity: blackCoverOpacity}, styles.blackCover]} pointerEvents="none"></Animated.View>
                    : null
            }

            <Animated.View style={{opacity: blackCoverOpacity, position: "absolute", zIndex: 20, left: 0, top: 0, width: "100%", height: "100%"}} pointerEvents={"box-none"}>
                {
                    rewardVisible ? <SprintReward reward={rolledItem} closeCallback={onClose} /> : null
                }
            </Animated.View>

            <ChancesModal visible={chancesViewVisible} hide={hideChances} />
        </View>
    )
};

const styles = StyleSheet.create({
    storyPoints: {
        position: "absolute",
        
        bottom: 0,
        left: 0,
        padding: 20,

        width: "100%"
    },
    main: {
        padding: 10,
        
        justifyContent: "center",
        alignItems: "center",
        gap: 20,

        width: "100%",

        position: "absolute"
    },
    blackCover: {
        position: "absolute",

        left: 0,
        top: 0,
        bottom: 0,
        right: 0,

        backgroundColor: "black"
    },
    video: {
        position: "absolute",

        left: 0,
        top: 0,
        bottom: 0,
        right: 0,

        zIndex: 10
    },
    image: {
        width: "100%",
        height: undefined,
        aspectRatio: 1.21,
        position: "absolute"
    }
});

export default SpecialView;
