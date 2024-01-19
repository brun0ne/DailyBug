import { Button, useTheme } from "react-native-paper";
import ShaderButton from "./Animated/ShaderButton";

export type NextBugButtonProps = {
    onPress: () => void
}

const NextBugButton = (props: NextBugButtonProps) => {
    const theme = useTheme();

    return (
        <>
            <ShaderButton onPress={props.onPress} icon="skip-next-circle-outline" text="Next" />
        </>
    );
}

export default NextBugButton;
