import React, { useImperativeHandle, useState } from 'react';
import { Button, useTheme } from 'react-native-paper';

export type SubmitButtonProps = {
    onPress: () => any
};

const SubmitButton = (props: SubmitButtonProps, ref) => {
    const [isDisabled, setDisabled] = useState(true);
    const theme = useTheme();

    const getIsDisabled = () => (isDisabled);

    useImperativeHandle(ref, () => ({
        setDisabled,
        getIsDisabled
    }));

    return (
        <Button
            icon="check-circle"
            mode="contained"
            style={{ backgroundColor: isDisabled ? theme.colors.backdrop : theme.colors.secondary }}
            disabled={isDisabled}
            onPress={props.onPress}
        >
            Submit
        </Button>
    );
};

export type SubmitButtonHandle = {
    setDisabled: (disabled: boolean) => void;
    getIsDisabled: () => boolean;
};

export default React.forwardRef<SubmitButtonHandle, SubmitButtonProps>(SubmitButton);
