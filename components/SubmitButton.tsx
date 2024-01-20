import React from 'react';
import { Button, useTheme } from 'react-native-paper';

export type SubmitButtonProps = {
    disabled: boolean;
    onPress: () => any;
};

const SubmitButton = (props: SubmitButtonProps) => {
    const theme = useTheme();

    return (
        <Button
            icon="check-circle"
            mode="contained"
            style={{ backgroundColor: props.disabled ? theme.colors.backdrop : theme.colors.secondary }}
            disabled={props.disabled}
            onPress={props.onPress}
        >
            Submit
        </Button>
    );
};

export default SubmitButton;
