import { Box, Canvas, Fill, RoundedRect, Shader, SkSize, Skia, rect, rrect, useClockValue, useComputedValue, vec } from '@shopify/react-native-skia';
import { StyleSheet, View, Text } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

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

type ShaderProgressBarProps = {
    progress: number
};

const ShaderProgressBar = (props: ShaderProgressBarProps) => {
    const clock = useClockValue();
    const canvasSize = useSharedValue<SkSize>(null);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(canvasSize.value?.width ?? 0, canvasSize.value?.height ?? 0),
            time: clock.current,
            progress: props.progress
            // is_touched: isTouched.current ? 1 : 0,
            // pointer: pointer.current
        }
    ), [clock, canvasSize, props.progress]);

    return (
        <View style={styles.view}>
            <Canvas style={styles.canvas} onSize={canvasSize}>
                <RoundedRect x={0} y={0} width={canvasSize.value?.width ?? 0} height={canvasSize.value?.height ?? 0} r={10}>
                    <Shader source={source} uniforms={uniforms} />
                </RoundedRect>
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
