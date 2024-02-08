import { View, StyleSheet } from "react-native";
import { useTheme, Text, Icon } from "react-native-paper";

type ItemProps = {
    name: string
    amount: number

    icon: string
    color: string
};

const WIDTH = 80;
const HEIGHT = 60;

const Item = (props: ItemProps) => {
    const theme = useTheme();
    const disabled = props.amount <= 0;

    return (
        <View style={styles.main}>
            <View style={[styles.rect, {backgroundColor: !disabled ? props.color : theme.colors.backdrop}]}>
                <Icon source={props.icon} size={HEIGHT - 20} color="white" />

                <View style={styles.amount}>
                    <Text style={{fontSize: 11}}>{props.amount.toString()}</Text>
                </View>
            </View>
            <Text style={styles.name}>{props.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        width: WIDTH,
        alignItems: "center",
        gap: 5
    },
    rect: {
        width: WIDTH,
        height: HEIGHT,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10
    },
    amount: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 10,
        padding: 3
    },
    name: {
        fontWeight: "bold",
        textAlign: "center"
    }
});

export default Item;
