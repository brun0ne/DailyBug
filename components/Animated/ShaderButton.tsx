import { Skia, Canvas, Shader, Fill, useFont, Text, vec, useClockValue, useComputedValue, useValue, useTouchHandler, AnimatedProp, SkFont } from "@shopify/react-native-skia";
import { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";

import {
    Easing,
    useDerivedValue,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

type AnimatedLetterProps = {
    text: string
    index: number

    x: number
    y: number

    font: AnimatedProp<SkFont, any>
    color: string

    jumping?: boolean
    delayBetweenJumps?: number
};

const BezierEasing = Easing.bezier(0.25, -0.5, 0.25, 1);

const JumpingLetter = ({text, index, x, y, font, color, jumping = true, delayBetweenJumps = 1000}: AnimatedLetterProps) => {
    const offset = useSharedValue(0);

    useEffect(() => {
        if (!jumping)
            return;

        offset.value = withDelay(index * 100, withRepeat(withSequence(
            withTiming(10, { duration: 500, easing: BezierEasing }),
            withTiming(0, { duration: 500, easing: Easing.bounce }),
            withDelay(delayBetweenJumps, withTiming(0))
        ), -1));
    });

    const offset_y = useDerivedValue(() => (
        y - offset.value
    ), [y, offset]);

    return (
        <Text
            x={x}
            y={jumping ? offset_y : y}
            text={text}
            font={font}
            color={color}
        />
    )
};

const source = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;

uniform int is_touched;
uniform vec2 pointer;

vec4 main(vec2 pos) {
    vec2 n = pos/resolution;
    vec2 n_p = pointer/resolution;

    vec4 color = vec4(n.x, n.y*abs(cos(time/1000)), 1, 1);

    float rectircle_border = smoothstep(0.05, 0.06, pow(n.x - 0.5, 4) + pow(n.y - 0.5, 4));
    color = mix(color, vec4(0), rectircle_border);

    if (is_touched == 1) {
        vec4 touched_overlay = vec4(sin(n_p.x), 1, 1, 1);
        color = mix(color, touched_overlay, 0.2 * (1 - rectircle_border));
    }

    return color;
}

`)!;

export type ShaderButtonProps = {
    onPress: () => void

    text?: string
    fontSize?: number

    paddingLeft?: number
    paddingRight?: number
    paddingTop?: number
    paddingBottom?: number,

    icon?: React.ReactNode | string
    iconSize?: number
};

const fontData = require("../../assets/Roboto/Roboto-Medium.ttf");

const ShaderButton = ({
    onPress,

    text = "", 
    fontSize = 15, 

    paddingLeft = 15, 
    paddingRight = 25,
    paddingTop = 13,
    paddingBottom = 17,

    icon,
    iconSize = 20
}: ShaderButtonProps) => {
    const clock = useClockValue();

    const font = useFont(fontData, fontSize);
    
    const textWidth = font?.getTextWidth(text);
    const buttonWidth = textWidth + paddingLeft + paddingRight + (icon ? iconSize : 0);
    const buttonHeight = fontSize + paddingTop + paddingBottom;

    const isTouched = useValue(false);
    const pointer = useValue(vec(0, 0));
    const onTouch = useTouchHandler({
        onStart: () => {
            isTouched.current = true;
        },
        onEnd: () => {
            isTouched.current = false;
            onPress();
        },
        onActive: (info) => {
            pointer.current = info;
        }
    }, [pointer, isTouched]);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(buttonWidth, buttonHeight),
            time: clock.current,
            is_touched: isTouched.current ? 1 : 0,
            pointer: pointer.current
        }
    ), [clock, buttonWidth, buttonHeight, isTouched, pointer]);

    const canvasStyles = useMemo(() => (
        { width: buttonWidth, height: buttonHeight }
    ), [buttonWidth, buttonHeight]);
    
    if (!font) return <></>;
    return (
        <View style={{width: buttonWidth, height: buttonHeight}}>
            <Canvas style={canvasStyles} onTouch={onTouch}>
                <Fill>
                    <Shader source={source} uniforms={uniforms} />
                </Fill>
                {
                    ((array: string[]) => {
                        let offset = 0;
                        let acc = [];

                        /* each letter is a separate element */
                        array.forEach((c, index) => {
                            acc.push(
                                <JumpingLetter
                                    key={`${c}_${index}`}
                                    index={index}
                                    x={offset + paddingLeft + (icon ? iconSize : 0) + 5}
                                    y={paddingTop + fontSize}
                                    text={c}
                                    font={font}
                                    color={"white"}
                                />
                            );

                            offset += font.getTextWidth(c);
                        });

                        return acc;
                    })([...text])
                }
            </Canvas>
            <View style={[styles.iconView, {paddingLeft: paddingLeft}]}>
                {typeof icon === "string" ? <Icon source={icon} size={iconSize} color="white" /> : icon}
            </View>
        </View>
      );
};

const styles = StyleSheet.create({
    iconView: {
        position: "absolute",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%"
    }
});

export default ShaderButton;