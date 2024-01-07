import { memo } from "react";
import { View, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";
import { Button, useTheme } from "react-native-paper";

export type HomeButtonsProps = {
    submitButtonDisabled: boolean;
    submitButtonCallback: () => any;
}

const HomeButtons = (props: HomeButtonsProps) => {
    const theme = useTheme();
    
    return (
        <View style={styles.view}>
            <SubmitButton disabled={props.submitButtonDisabled} onPress={props.submitButtonCallback} />

            <Button
                icon="skip-next-circle-outline"
                mode="contained"
                style={{backgroundColor: theme.colors.error}}
                // onPress={() => {}}
            >
                Skip
            </Button>
        </View>
    )
};

const styles = StyleSheet.create({
    view: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        flexDirection: "row"
    }
});

export default memo(HomeButtons);
