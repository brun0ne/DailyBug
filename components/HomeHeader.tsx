import React, { useCallback, memo } from "react";
import { View } from "react-native";
import { Avatar, Card, IconButton, useTheme, Text } from "react-native-paper";

export type HomeHeaderProps = {
    explanation: string
    showExplanation: boolean

    hintCallback: () => any
}

const HomeHeader = (props: HomeHeaderProps) => {
    const theme = useTheme();

    const leftCallback = useCallback((left_props) => (
        <Avatar.Icon
            {...left_props}
            icon={props.showExplanation ? "party-popper" : "progress-question"}
            style={{backgroundColor: theme.colors.secondary}}
        />
    ), [props.showExplanation]);

    const rightCallback = useCallback((right_props) => (
        <View style={{flexDirection: "row"}}>
            {/* hint button */}
            <IconButton {...right_props} icon="head-question-outline" onPress={props.hintCallback} />
        </View>
    ), [props.hintCallback]);

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
