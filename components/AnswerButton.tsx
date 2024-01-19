import { memo } from "react";
import { View, StyleSheet } from "react-native";
import SubmitButton from "./SubmitButton";
import { Button, useTheme } from "react-native-paper";

export type AnswerButtonsProps = {
    submitButtonDisabled: boolean;
    submitButtonCallback: () => any;
}

const AnswerButtons = (props: AnswerButtonsProps) => {
    const theme = useTheme();
    
    return (
        <>
            <SubmitButton disabled={props.submitButtonDisabled} onPress={props.submitButtonCallback} />

            <Button
                icon="skip-next-circle-outline"
                mode="contained"
                style={{backgroundColor: theme.colors.error}}
                // onPress={() => {}}
            >
                Skip
            </Button>
        </>
    )
};

export default memo(AnswerButtons);
