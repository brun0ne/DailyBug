import { View, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useCallback, useContext, useState } from "react";
import { useIsFocused } from '@react-navigation/native';
import { Video, ResizeMode } from "expo-av";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import ShaderButton from "../Animated/ShaderButton";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

import { UserAPI, UserContext } from "../../util/UserContext";

const sprintGoldVid = require("../../assets/Sprint/gold1.mp4");
const sprintPurpleVid = require("../../assets/Sprint/purple1.mp4");
const sprintBlueVid = require("../../assets/Sprint/blue1.mp4");

const SpecialView = () => {
    const userContext = useContext(UserContext);
    const isFocused = useIsFocused();

    const [rolling, setRolling] = useState<5 | 4 | 3 | false>(false);

    const blackCoverOpacity = useSharedValue(0);

    const sprintCallback = useCallback(async () => {
        blackCoverOpacity.value = withTiming(1, {
            duration: 500
        });

        const res = await UserAPI.doSprint(userContext);

        setTimeout(() => {
            if (!res.reward)
                return;

            setRolling(res.reward.stars);
        }, 100);

        /* todo: display what was pulled */
    }, [userContext]);

    const onSprintVideoEnd = useCallback(() => {
        setRolling(false);
        
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
                    disabled={(userContext.progressData?.currency ?? 0) < 150}
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
                            onPlaybackStatusUpdate={(status) => {
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
