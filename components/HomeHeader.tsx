import { useCallback, memo } from "react";
import { View } from "react-native";
import { Avatar, Card, IconButton, useTheme } from "react-native-paper";

export type HomeHeaderProps = {
    hintCallback: () => any
}

const HomeHeader = (props: HomeHeaderProps) => {
    const theme = useTheme();

    const leftCallback = useCallback((left_props) => (
        <Avatar.Icon {...left_props} icon="nintendo-game-boy" style={{backgroundColor: theme.colors.secondary}} />
    ), []);

    const rightCallback = useCallback((right_props) => (
        <View style={{flexDirection: "row"}}>
            {/* hint button */}
            <IconButton {...right_props} icon="head-question-outline" onPress={props.hintCallback} />
        </View>
    ), [props.hintCallback]);

    return (
        <Card.Title
            title="Where is the Bug?"
            subtitle="Select a line of code and submit!"
            left={leftCallback}
            right={rightCallback}
        />
    );
};

export default memo(HomeHeader);
