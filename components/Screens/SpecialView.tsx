import { View, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useCallback, useContext, useEffect, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode } from "expo-av";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import ShaderButton from "../Animated/ShaderButton";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

import { SprintRewardType, UserAPI, UserContext } from "../../util/UserContext";
import SprintReward from "../Animated/SprintReward";

import { usePostHog } from "posthog-react-native";

const sprintGoldVid = require("../../assets/Sprint/gold.mp4");
const sprintPurpleVid = require("../../assets/Sprint/purple.mp4");
const sprintBlueVid = require("../../assets/Sprint/blue.mp4");

const SpecialView = () => {
    const userContext = useContext(UserContext);
    const isFocused = useIsFocused();

    const [rollingPending, setRollingPending] = useState(false);
    const [rolling, setRolling] = useState<5 | 4 | 3 | false>(false);
    const [rolledItem, setRolledItem] = useState<SprintRewardType>(null);
    const [rewardVisible, setRewardVisible] = useState(false);

    const blackCoverOpacity = useSharedValue(0);

    const posthog = usePostHog();

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

        posthog.capture("sprint", {
            reward: res.itemName,
            stars: res.reward.stars
        });
    }, [userContext, posthog]);

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
    }, [isFocused])

    if (!isFocused)
        return <></>;

    return (
        <>
            <View style={styles.top}>
                <ShaderFlatDisplay text="STORY POINTS" number={userContext.progressData?.currency ?? 0} />
            </View>
            <View style={styles.main}>
                <Text style={{fontSize: 25}}>SPRINT</Text>

                <Icon source="run-fast" size={50} />

                <ShaderButton
                    disabled={(userContext.progressData?.currency ?? 0) < 150 || rollingPending || rolling !== false || rewardVisible}
                    text={"Use 150 Story Points"}
                    onPress={sprintCallback}
                    jumpingText={false}
                />

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

                <Animated.View style={{opacity: blackCoverOpacity, position: "absolute", zIndex: 20}}>
                    {
                        rewardVisible ? <SprintReward reward={rolledItem} closeCallback={onClose} /> : null
                    }
                </Animated.View>
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    top: {
        padding: 20
    },
    main: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
        width: "100%",
        height: "100%",
        
        position: "absolute",
        top: 0
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
    }
});

export default SpecialView;
