import { Image, LayoutChangeEvent, Platform, View, StyleSheet, useWindowDimensions } from "react-native";
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
import { webScreenContentStyle } from "../../util/Layout";

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
    const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

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

    const onContentLayout = useCallback((event: LayoutChangeEvent) => {
        const { width, height } = event.nativeEvent.layout;

        setContentSize((prev) => {
            if (prev.width === width && prev.height === height) {
                return prev;
            }

            return { width, height };
        });
    }, []);

    /* responsive */
    const {height, width} = useWindowDimensions();

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

    const webVideoStyle = (() => {
        if (Platform.OS !== "web" || contentSize.width <= 0 || contentSize.height <= 0) {
            return null;
        }

        const videoAspectRatio = 1080 / 1920;
        const contentAspectRatio = contentSize.width / contentSize.height;

        if (contentAspectRatio > videoAspectRatio) {
            const scaledHeight = contentSize.width / videoAspectRatio;

            return {
                width: contentSize.width,
                height: scaledHeight,
            };
        }

        const scaledWidth = contentSize.height * videoAspectRatio;

        return {
            width: scaledWidth,
            height: contentSize.height,
        };
    })();

    const webVideoProps = Platform.OS === "web"
        ? ({
            videoStyle: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
            }
        } as any)
        : ({} as any);

    if (!isFocused)
        return <></>;

    return (
        <View style={[styles.screen, Platform.OS === "web" ? styles.screenWeb : null]}>
            <View style={[styles.content, Platform.OS === "web" ? styles.contentWeb : null]} onLayout={onContentLayout}>
                <View style={styles.banner}>
                    <Image source={bg} style={styles.image} />
                    <Animated.Image source={duck_only} style={[duckStyles, styles.image]} />
                    <Animated.Image source={duck_stars} style={[duckStarsStyles, styles.image]} />
                    <Animated.Image source={s4_only} style={[s4Styles, styles.image]} />
                    <Animated.Image source={s4_stars_only} style={[s4StarsStyles, styles.image]} />

                    <IconButton icon={"help"} style={styles.helpButton} mode={"contained-tonal"} onPress={showChances} />

                    {
                        Platform.OS !== "web" ? (
                            <View style={styles.storyPoints}>
                                <ShaderFlatDisplay showBackground={false} text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
                            </View>
                        ) : null
                    }
                </View>

                <View style={[styles.main, Platform.OS === "web" ? styles.mainWeb : null]}>
                    {
                        Platform.OS === "web" ? (
                            <View style={styles.storyPointsWeb}>
                                <ShaderFlatDisplay showBackground={false} text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
                            </View>
                        ) : null
                    }

                    <Text variant={"titleLarge"} style={{fontSize: 25, color: "white"}}>SPRINT</Text>

                    
                    <Icon source="run-fast" color="white" size={50} />
                    

                    <ShaderButton
                        disabled={(userContext.progressData?.currency ?? 0) < 150 || rollingPending || rolling !== false || rewardVisible}
                        text={"Use 150 Story Points"}
                        onPress={sprintCallback}
                        jumpingText={false}
                    />
                </View>

                {
                    rolling !== false ? (
                        <View style={styles.videoLayer}>
                            {
                                Platform.OS === "web" ? (
                                    <View style={[styles.videoFrameWeb, webVideoStyle]}>
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
                                            style={styles.videoWebFill}
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
                                            {...webVideoProps}
                                        />
                                    </View>
                                ) : (
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
                                        style={styles.videoNative}
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
                            }
                        </View>
                        )
                        : null
                }

                {
                    rollingPending || rolling || rewardVisible ?
                        <Animated.View style={[{opacity: blackCoverOpacity}, styles.blackCover]} pointerEvents="none"></Animated.View>
                        : null
                }

                <Animated.View style={[{opacity: blackCoverOpacity}, styles.rewardOverlay]} pointerEvents={"box-none"}>
                    {
                        rewardVisible ? <SprintReward reward={rolledItem} closeCallback={onClose} /> : null
                    }
                </Animated.View>
            </View>

            <ChancesModal visible={chancesViewVisible} hide={hideChances} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#170112",
    },
    screenWeb: {
        width: "100%",
        minHeight: 0,
        overflow: "visible",
    },
    content: {
        flex: 1,
        width: "100%",
        position: "relative",
        ...webScreenContentStyle,
    },
    contentWeb: {
        minHeight: 0,
        overflow: "visible",
    },
    banner: {
        width: "100%",
        aspectRatio: 1.21,
        position: "relative",
        overflow: "hidden",
    },
    helpButton: {
        position: "absolute",
        top: 10,
        left: 10,
    },
    storyPoints: {
        position: "absolute",

        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,

        width: "100%"
    },
    main: {
        flex: 1,
        paddingTop: 25,
        paddingBottom: 30,
        padding: 10,
        
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
    },
    mainWeb: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 26,
        zIndex: 5,
        flex: 0,
        justifyContent: "flex-end",
        paddingTop: 10,
        paddingBottom: 28,
        overflow: "visible",
    },
    storyPointsWeb: {
        width: "100%",
        paddingHorizontal: 10,
    },
    blackCover: {
        position: "absolute",

        left: 0,
        top: 0,
        bottom: 0,
        right: 0,

        backgroundColor: "black",
        zIndex: 6,
    },
    videoLayer: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
    },
    rewardOverlay: {
        position: "absolute",
        zIndex: 20,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%"
    },
    videoNative: {
        position: "absolute",

        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    },
    videoFrameWeb: {
        position: "relative",
        overflow: "hidden",
    },
    videoWebFill: {
        width: "100%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        position: "absolute"
    }
});

export default SpecialView;
