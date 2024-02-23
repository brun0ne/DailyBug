import { useCallback, memo, useEffect } from "react";
import { View } from "react-native";
import { Avatar, Card, IconButton, useTheme, Text, Button } from "react-native-paper";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

export type HomeHeaderProps = {
    explanation: string
    showExplanation: boolean
    rewardText?: string
    showReward: boolean

    hintCallback: () => any
}

const HomeHeader = (props: HomeHeaderProps) => {
    const theme = useTheme();

    const rewardOpacity = useSharedValue(0);

    useEffect(() => {
        if (!props.showReward) {
            rewardOpacity.value = 0;
        }
        else if (props.rewardText) {
            rewardOpacity.value = withDelay(10, withTiming(1, {
                duration: 300
            }));
        }
    }, [rewardOpacity, props.showReward, props.rewardText]);

    const rewardStyles = useAnimatedStyle(() => {
        return {
            opacity: rewardOpacity.value
        }
    }, [rewardOpacity]);

    const leftCallback = useCallback((left_props) => (
        <Avatar.Icon
            {...left_props}
            icon={props.showExplanation ? "party-popper" : "progress-question"}
            style={{backgroundColor: theme.colors.secondary}}
        />
    ), [props.showExplanation]);

    const rightCallback = useCallback((right_props) => (
        <>
            <Animated.View style={[rewardStyles, {flexDirection: "row", padding: 15, display: props.showReward ? "flex" : "none"}]}>
                {/* reward text */}
                { props.rewardText ? <Button mode="contained-tonal">{props.rewardText}</Button> : <></> }
            </Animated.View>
            {
                !props.showReward ? (
                    <View style={{flexDirection: "row"}}>
                        {/* hint button */}
                        <IconButton {...right_props} icon="head-question-outline" onPress={props.hintCallback} size={28} />
                    </View>
                ) : null
            }
        </>
    ), [props.hintCallback, props.showReward, props.rewardText, rewardOpacity]);

    let title: string | React.ReactElement;
    let subtitle: string;

    if (props.showExplanation) {
        title = <Text style={{fontSize: 18, fontWeight: "bold"}}>Correct!</Text>;
        subtitle = props.explanation;
    }
    else {
        title = "Where is the bug?";
        subtitle = "Select a line of code and submit!";
    }

    return (
        <Card.Title
            title={title}
            subtitle={subtitle}
            subtitleNumberOfLines={6}
            left={leftCallback}
            right={rightCallback}
        />
    );
};

export default memo(HomeHeader);
