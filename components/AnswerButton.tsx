import { memo } from "react";
import SubmitButton from "./SubmitButton";
import { Button, useTheme } from "react-native-paper";

export type AnswerButtonsProps = {
    submitButtonDisabled: boolean
    submitButtonCallback: () => void

    nextAfterWrongUnlocked: boolean

    skipButtonCallback: () => void
    nextButtonCallback: () => void
}

const AnswerButtons = (props: AnswerButtonsProps) => {
    const theme = useTheme();
    
    return (
        <>
            <SubmitButton disabled={props.submitButtonDisabled} onPress={props.submitButtonCallback} />

            {
                props.nextAfterWrongUnlocked ? (
                    <Button
                        icon="skip-next-circle-outline"
                        mode="contained"
                        buttonColor="#464299"
                        onPress={props.nextButtonCallback}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        icon="skip-next-circle-outline"
                        mode="contained"
                        buttonColor={theme.colors.error}
                        onPress={props.skipButtonCallback}
                    >
                        Skip
                    </Button>
                )
            }
        </>
    )
};

export default memo(AnswerButtons);
