import { View, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useCallback, useContext, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode } from "expo-av";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import ShaderButton from "../Animated/ShaderButton";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

import { ItemType, UserAPI, UserContext } from "../../util/UserContext";
import SprintReward from "../Animated/SprintReward";

const sprintGoldVid = require("../../assets/Sprint/gold1.mp4");
const sprintPurpleVid = require("../../assets/Sprint/purple1.mp4");
const sprintBlueVid = require("../../assets/Sprint/blue1.mp4");

const SpecialView = () => {
    const userContext = useContext(UserContext);
    const isFocused = useIsFocused();

    const [rollingPending, setRollingPending] = useState(false);
    const [rolling, setRolling] = useState<5 | 4 | 3 | false>(false);
    const [rolledItem, setRolledItem] = useState<ItemType & {itemName: string}>(null);
    const [rewardVisible, setRewardVisible] = useState(false);

    const blackCoverOpacity = useSharedValue(0);

    const sprintCallback = useCallback(async () => {
        blackCoverOpacity.value = withTiming(1, {
            duration: 500
        });
        setRollingPending(true);

        const res = await UserAPI.doSprint(userContext);
        setRollingPending(false);
        setRolledItem({itemName: res.itemName, ...res.reward});

        if (!res.reward)
            return;

        setRolling(res.reward.stars);
    }, [userContext]);

    const onSprintVideoEnd = useCallback(() => {
        setRolling(false);
    }, []);

    const onClose = useCallback(() => {
        setRewardVisible(false);
        setRolledItem(null);

        blackCoverOpacity.value = withTiming(0, {
            duration: 300
        });
    }, []);

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
                                if ((status as any).positionMillis >= 4600 && !rewardVisible) {
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

                <Animated.View style={[{opacity: blackCoverOpacity}, styles.blackCover]} pointerEvents="none"></Animated.View>

                <Animated.View style={{opacity: blackCoverOpacity, position: "absolute", zIndex: 20}}>
                    {
                        rewardVisible ? <SprintReward item={rolledItem} closeCallback={onClose} /> : null
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
