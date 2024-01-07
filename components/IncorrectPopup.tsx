import { memo } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';

export type IncorrectPopupProps = {
    visible: boolean;
    hideCallback: () => any;
}

const IncorrectPopup = (props: IncorrectPopupProps) => {
    const theme = useTheme();

    return (
        <Snackbar
            duration={1000}
            visible={props.visible}
            onDismiss={props.hideCallback}
            // style={{backgroundColor: theme.colors.errorContainer}}
            rippleColor={"red"}
            // theme={{ colors: { inverseOnSurface: theme.colors.onErrorContainer }}}
            wrapperStyle={{ bottom: 100, zIndex: 9999 }}
        >
            Incorrect! Try again.
        </Snackbar>
    );
};

export default memo(IncorrectPopup);
