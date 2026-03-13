import { memo } from "react";
import SubmitButton from "./SubmitButton";
import { Button, useTheme } from "react-native-paper";
import { View, StyleSheet } from "react-native";

export type AnswerButtonsProps = {
    submitButtonDisabled: boolean
    submitButtonCallback: () => void

    nextAfterWrongUnlocked: boolean

    skipButtonCallback: () => void
    giveUpButtonCallback: () => void
}

const AnswerButtons = (props: AnswerButtonsProps) => {
    const theme = useTheme();
    
    return (
        <View style={styles.row}>
            <View style={styles.buttonSlot}>
                <SubmitButton disabled={props.submitButtonDisabled} onPress={props.submitButtonCallback} />
            </View>

            {
                props.nextAfterWrongUnlocked ? (
                    <View style={styles.buttonSlot}>
                        <Button
                            icon="skip-next-circle-outline"
                            mode="contained"
                            buttonColor={theme.colors.error}
                            onPress={props.giveUpButtonCallback}
                        >
                            Give up
                        </Button>
                    </View>
                ) : (
                    <View style={styles.buttonSlot}>
                        <Button
                            icon="skip-next-circle-outline"
                            mode="contained"
                            buttonColor={theme.colors.error}
                            onPress={props.skipButtonCallback}
                        >
                            Skip
                        </Button>
                    </View>
                )
            }
        </View>
    )
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonSlot: {
        marginHorizontal: 8,
    },
});

export default memo(AnswerButtons);
