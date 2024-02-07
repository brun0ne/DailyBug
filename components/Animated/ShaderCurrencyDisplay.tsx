import { Canvas, Text, RoundedRect, Shader, SkSize, Skia, useClockValue, useComputedValue, vec, useFont } from "@shopify/react-native-skia";
import { View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

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

const ShaderCurrencyDisplay = () => {
    const clock = useClockValue();
    const canvasSize = useSharedValue<SkSize>(null);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(canvasSize.value?.width ?? 0, canvasSize.value?.height ?? 0),
            time: clock.current
        }
    ), [clock, canvasSize]);

    const text = "STORY POINTS";
    const pointsText = "123";
    const fontSize = 20;
    const font = useFont(fontData, fontSize);

    const fontHeight = font?.measureText(text).height ?? 0;
    const numbersWidth = font?.measureText(pointsText).height ?? 0;

    return (
        <View style={{flexGrow: 1, height: 75}}>
            <Canvas style={{flexGrow: 1}} onSize={canvasSize}>
                <RoundedRect x={0} y={0} width={canvasSize.value?.width ?? 0} height={canvasSize.value?.height ?? 0} r={10}>
                    <Shader source={sourceMain} uniforms={uniforms} />
                </RoundedRect>
                <RoundedRect x={15} y={75/2 - 35/2} width={80} height={35} r={10}>
                    <Shader source={sourceNumberRect} uniforms={uniforms} />
                </RoundedRect>
                {
                    font ? <>
                        <Text x={120} y={75/2 + fontHeight/2} font={font} text={text} color={"white"} />
                        <Text x={15 + 80/2 - numbersWidth - 2} y={75/2 + fontHeight/2} font={font} text={pointsText} color={"white"} blendMode={"clear"} />
                    </> : null
                }
            </Canvas>
        </View>
    );
}

export default ShaderCurrencyDisplay;
