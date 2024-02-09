import { memo } from "react";
import SubmitButton from "./SubmitButton";
import { Button, useTheme } from "react-native-paper";

export type AnswerButtonsProps = {
    submitButtonDisabled: boolean;
    submitButtonCallback: () => void;

    skipButtonCallback: () => void;
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
                onPress={props.skipButtonCallback}
            >
                Skip
            </Button>
        </>
    )
};

export default memo(AnswerButtons);
