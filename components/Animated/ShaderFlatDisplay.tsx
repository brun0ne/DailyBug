import { Canvas, Text, RoundedRect, Shader, SkSize, Skia, useClockValue, useComputedValue, vec, useFont } from "@shopify/react-native-skia";
import { useEffect } from "react";
import { View } from "react-native";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

const sourceMain = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;

vec2 rotate(vec2 uv, float angle)
{
    return mat2(cos(angle), sin(angle), -sin(angle), cos(angle)) * uv;
}

float lines(vec2 uv)
{
    float pct = 0.2;
    return smoothstep( 0.03, pct, fract(uv.y*10. + time / 1000) ) - smoothstep( pct+0.03, pct+0.06, fract(uv.y*10. + time / 1000) );
}

vec4 main(vec2 pos)
{
    vec2 n = pos/resolution.xy;
    vec3 col = vec3(0);

    col += lines(rotate(n, -0.5)) * 0.3;

    return vec4(col, 1.0);
}
`)!;

const sourceNumberRect = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;

vec4 main(vec2 pos) {
    vec2 n = (pos/resolution.xy)*1.8;
    vec4 color = vec4(sin(-n.x + time / 1000) * 0.5, 0, n.x, 0.8);

    return color;
}
`)!;


const fontData = require("../../assets/Roboto/Roboto-Medium.ttf");

type ShaderFlatDisplayProps = {
    text: string,
    number: number,

    fontSize?: number,
    textColor?: string,

    displayHeight?: number

    leftRectWidth?: number
    leftRectHeight?: number
    gap?: number

    borderRadius?: number
    horizontalOffset?: number
};

const ShaderFlatDisplay = ({
    text,
    number,
    fontSize = 20,
    textColor = "white",
    displayHeight = 75,
    leftRectWidth = 80,
    leftRectHeight = 35,
    gap = 25,
    borderRadius = 10,
    horizontalOffset = -8
}: ShaderFlatDisplayProps) => {
    const clock = useClockValue();
    const canvasSize = useSharedValue<SkSize>(null);
    const displayedNumber = useSharedValue(0);

    const canvasWidth = useDerivedValue(() => canvasSize.value?.width ?? 0, [canvasSize]);
    const canvasHeight = useDerivedValue(() => canvasSize.value?.height ?? 0, [canvasSize]);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(canvasSize.value?.width ?? 0, canvasSize.value?.height ?? 0),
            time: clock.current
        }
    ), [clock, canvasSize]);

    const leftText = useDerivedValue(() => (
        Math.round(displayedNumber.value).toString()
    ), [displayedNumber]);
    const font = useFont(fontData, fontSize);

    const fontHeight = font?.measureText(text).height ?? 0;
    const mainTextWidth = font?.measureText(text).width ?? 0;

    const numbersWidth = useDerivedValue(() => (
        font?.measureText(leftText.value).width ?? 0
    ), [font, leftText]);;

    const marginLeft = useDerivedValue(() => (
        (canvasWidth.value - leftRectWidth - gap - mainTextWidth) / 2 + horizontalOffset
    ), [canvasWidth, mainTextWidth, text, number]);

    const mainTextX = useDerivedValue(() => marginLeft.value + leftRectWidth + gap, [marginLeft, text, number]);
    const leftTextX = useDerivedValue(() => marginLeft.value + leftRectWidth/2 - numbersWidth.value / 2, [marginLeft, numbersWidth, text, number]);

    useEffect(() => {
        displayedNumber.value = withTiming(number, {
            duration: 500
        });
    });

    return (
        <View style={{flexGrow: 1, height: displayHeight}}>
            <Canvas style={{flexGrow: 1}} onSize={canvasSize}>
                <RoundedRect x={0} y={0} width={canvasWidth} height={canvasHeight} r={borderRadius}>
                    <Shader source={sourceMain} uniforms={uniforms} />
                </RoundedRect>
                {
                    font ? <>
                        <RoundedRect x={marginLeft} y={displayHeight/2 - leftRectHeight/2} width={leftRectWidth} height={leftRectHeight} r={borderRadius}>
                            <Shader source={sourceNumberRect} uniforms={uniforms} />
                        </RoundedRect>

                        <Text
                            x={mainTextX}
                            y={displayHeight/2 + fontHeight/2}
                            font={font}
                            text={text}
                            color={textColor}
                        />

                        <Text
                            x={leftTextX}
                            y={displayHeight/2 + fontHeight/2}
                            font={font}
                            text={leftText}
                            color={textColor}
                            blendMode={"clear"}
                        />
                    </> : null
                }
            </Canvas>
        </View>
    );
}

export default ShaderFlatDisplay;
