import { Canvas, RoundedRect, Shader, useComputedValue, useValue, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text as RNText, View } from 'react-native';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSkiaRuntimeEffect } from '../../util/SkiaRuntimeEffect';

const shaderSource = `
uniform vec2 resolution;
uniform float time;

uniform float progress;

vec4 main(vec2 pos) {
    vec2 n = pos/resolution.xy;
    vec4 color = vec4(n.x, n.y + sin(n.x * 5 - time/1000) * 0.3 - 0.3, 1, 1);

    float progressPx = progress * resolution.x;
    float waveOffsetPx =
        sin(n.y * 5 + time / 1000) * 3.0 +
        cos(n.y * 15 + time / 100) * 0.3 +
        sin(n.y * 15 + time / 100) * 0.3;
    float wave = pos.x - progressPx - waveOffsetPx;

    if (wave > 0.0)
    {
        color = vec4(0, 0, n.x, 1);
    }

    return color;
}
`;

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
    const time = useValue(0);
    const source = useSkiaRuntimeEffect(shaderSource);
    
    const [layoutSize, setLayoutSize] = useState({ width: 0, height: 25 });

    const interpolatedProgress = useSharedValue(0);

    useEffect(() => {
        interpolatedProgress.value = withTiming(progress, {
            duration: 1000
        });
    }, [progress]);

    useEffect(() => {
        let frameId = 0;
        const startTime = Date.now();

        const tick = () => {
            time.current = Date.now() - startTime;
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [time]);

    const uniforms = useComputedValue(() => (
        {
            resolution: vec(layoutSize.width || 1, layoutSize.height || 1),
            time: time.current,
            progress: interpolatedProgress.value
        }
    ), [time, layoutSize.width, layoutSize.height, interpolatedProgress]);

    const onLayout = useCallback((event: any) => {
        const { width, height } = event.nativeEvent.layout;

        setLayoutSize((current) => {
            if (current.width === width && current.height === height) {
                return current;
            }

            return { width, height };
        });
    }, []);

    return (
        <View style={styles.view} onLayout={onLayout}>
            <Canvas style={styles.canvas}>
                {
                    source ? (
                        <RoundedRect x={0} y={0} width={layoutSize.width} height={layoutSize.height} r={10}>
                            <Shader source={source} uniforms={uniforms} />
                        </RoundedRect>
                    ) : (
                        <RoundedRect x={0} y={0} width={layoutSize.width} height={layoutSize.height} r={10} color={'#2E3A57'} />
                    )
                }
            </Canvas>
            {
                text !== "" ? (
                    <View pointerEvents="none" style={styles.webTextOverlay}>
                        <RNText style={{color: 'white', fontSize, fontFamily: "Roboto-Medium"}}>{text}</RNText>
                    </View>
                ) : null
            }
        </View>
    )
};

const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: 25,
        flexShrink: 0,
        position: 'relative',
        overflow: 'hidden'
    },
    canvas: {
        width: '100%',
        height: '100%'
    },
    webTextOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 15,
        right: 0,
        justifyContent: 'center'
    }
});

export default ShaderProgressBar;
