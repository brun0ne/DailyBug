import { Canvas, RoundedRect, Shader, SkSize, Skia, Text, useClockValue, useComputedValue, useFont, vec } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const source = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;

uniform float progress;

vec4 main(vec2 pos) {
    vec2 n = pos/resolution.xy;
    vec4 color = vec4(n.x, n.y + sin(n.x * 5 - time/1000) * 0.3 - 0.3, 1, 1);

    float wave = (
        n.x + sin(n.y * 5 + time / 1000) * 0.01 + 
        cos(n.y * 15 + time / 100) * 0.001 + 
        sin(n.y * 15 + time / 100) * 0.001
    );

    if (wave > progress)
    {
        color = vec4(0, 0, n.x, 1);
    }

    return color;
}
`)!;

const fontData = require("../../assets/Roboto/Roboto-Medium.ttf");

type ShaderProgressBarProps = {
    progress: number
    text?: string
    fontSize?: number
};

const ShaderProgressBar = ({
    progress,
    text = "",
    fontSize = 12
}: ShaderProgressBarProps) => {
    const clock = useClockValue();
    
    const canvasSize = useSharedValue<SkSize>(null);
    const canvasWidth = useDerivedValue(() => canvasSize.value?.width ?? 0, [canvasSize]);
    const canvasHeight = useDerivedValue(() => canvasSize.value?.height ?? 0, [canvasSize]);

    const font = useFont(fontData, fontSize);
    const fontHeight = useDerivedValue(() => font?.measureText(text).height ?? 0, [font]);

    const interpolatedProgress = useSharedValue(0);

    useEffect(() => {
        interpolatedProgress.value = withTiming(progress, {
            duration: 1000
        });
    }, [progress]);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(canvasSize.value?.width ?? 0, canvasSize.value?.height ?? 0),
            time: clock.current,
            progress: interpolatedProgress.value
        }
    ), [clock, canvasSize, interpolatedProgress]);

    const textY = useDerivedValue(() => (canvasHeight.value + fontHeight.value) / 2, [canvasHeight, fontHeight]);

    return (
        <View style={styles.view}>
            <Canvas style={styles.canvas} onSize={canvasSize}>
                <RoundedRect x={0} y={0} width={canvasWidth} height={canvasHeight} r={10}>
                    <Shader source={source} uniforms={uniforms} />
                </RoundedRect>
                {
                    font && text !== "" ? (
                        <Text
                            x={15}
                            y={textY}
                            text={text}
                            font={font}
                            color={"white"}
                            blendMode={"screen"}
                        />
                    ) : null 
                }
            </Canvas>
        </View>
    )
};

const styles = StyleSheet.create({
    view: {
        flexGrow: 1,
        height: 25
    },
    canvas: {
        flexGrow: 1
    }
});

export default ShaderProgressBar;
