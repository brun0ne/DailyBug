import { useCallback, useMemo, useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useTheme, Text, Icon } from "react-native-paper";

import Color from "color";
import { ItemType } from "../util/UserContext";
import { Canvas, RoundedRect, Shader, Skia, useClockValue, useComputedValue, vec } from "@shopify/react-native-skia";

const source = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;

vec4 main(vec2 pos) {
    vec2 n = pos/resolution.xy;
    vec4 color = vec4(n.x, n.y + sin(n.x * 0.8 - time/1000) * 0.3 - 0.3, 1, 1);

    return color;
}
`)!;


type ItemProps = {
    name: string
    item: ItemType

    image?: any

    pressable: boolean
    onPress?: () => void
};

const WIDTH = 80;
const HEIGHT = 70;

const Item = (props: ItemProps) => {
    const theme = useTheme();
    const disabled = props.item.amount <= 0;

    const clock = useClockValue();

    const baseColor = useMemo(() => (!disabled ? props.item.color: theme.colors.backdrop), [disabled, theme]);
    const [color, setColor] = useState(baseColor);

    const pressInCallback = useCallback(() => {
        setColor(Color(baseColor).lighten(!disabled ? 0.4 : 1).toString())
    }, [props.item, baseColor, disabled]);

    const pressOutCallback = useCallback(() => {
        setColor(baseColor);
    }, [props.item, baseColor]);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(WIDTH, HEIGHT),
            time: clock.current,
        }
    ), [clock]);

    return (
        <Pressable style={styles.main} disabled={!props.pressable} onPress={props.onPress} onPressIn={pressInCallback} onPressOut={pressOutCallback}>
            <View style={[styles.rect, {backgroundColor: color}]}>
                {
                    props.item.stars === 5 ? (
                        <Canvas style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0}}>
                            <RoundedRect x={0} y={0} width={WIDTH} height={HEIGHT} r={10}>
                                <Shader source={source} uniforms={uniforms} />
                            </RoundedRect>
                        </Canvas>
                    ) : null
                }
                
                <Icon source={props.item.icon} size={HEIGHT - 20} color="white" />

                {
                    props.image ? (
                        <Image source={props.image} style={{width: WIDTH, height: HEIGHT, position: "absolute", borderRadius: 10}} resizeMode={"cover"} />
                    ) : null
                }

                {
                    !props.item.maxOne ? (
                        <View style={styles.amount}>
                            <Text style={{fontSize: 11}}>{props.item.amount.toString()}</Text>
                        </View>
                    ) : null
                }
            </View>
            <Text style={styles.name}>{props.name}</Text>
        </Pressable>
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
        flexDirection: "column"
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
