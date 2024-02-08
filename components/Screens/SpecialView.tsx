import { View, StyleSheet } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useCallback, useContext } from "react";
import { useIsFocused } from '@react-navigation/native';

import ShaderButton from "../Animated/ShaderButton";
import ShaderFlatDisplay from "../Animated/ShaderFlatDisplay";

import { UserAPI, UserContext } from "../../util/UserContext";

const SpecialView = () => {
    const userContext = useContext(UserContext);
    const isFocused = useIsFocused();

    const sprintCallback = useCallback(() => {
        UserAPI.doSprint(userContext);

        /* todo: display what was pulled */
    }, [userContext]);

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
    }
});

export default SpecialView;
