import { Canvas, RoundedRect, Shader, useComputedValue, useValue, vec } from "@shopify/react-native-skia";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text as RNText, View } from "react-native";
import { useSkiaRuntimeEffect } from "../../util/SkiaRuntimeEffect";

const sourceMainShader = `
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
`;

const sourceNumberRectShader = `
uniform vec2 resolution;
uniform float time;

vec4 main(vec2 pos) {
    vec2 n = (pos/resolution.xy)*1.8;
    vec4 color = vec4(sin(-n.x + time / 1000) * 0.5, 0, n.x, 0.8);

    return color;
}
`;



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

    showBackground?: boolean
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
    horizontalOffset = -8,

    showBackground = true
}: ShaderFlatDisplayProps) => {
    const time = useValue(0);
    const sourceMain = useSkiaRuntimeEffect(sourceMainShader);
    const sourceNumberRect = useSkiaRuntimeEffect(sourceNumberRectShader);
    const [layoutWidth, setLayoutWidth] = useState(0);
    const renderHeight = displayHeight;

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
            resolution: vec(layoutWidth || 1, renderHeight || 1),
            time: time.current
        }
    ), [time, layoutWidth, renderHeight]);

    const estimatedCharWidth = fontSize * 0.6;
    const mainTextWidth = text.length * estimatedCharWidth;
    const marginLeft = (layoutWidth - leftRectWidth - gap - mainTextWidth) / 2 + horizontalOffset;

    const onLayout = useCallback((event: any) => {
        const { width } = event.nativeEvent.layout;

        setLayoutWidth((current) => {
            if (current === width) {
                return current;
            }

            return width;
        });
    }, []);

    return (
        <View style={{width: "100%", height: displayHeight, flexShrink: 0, position: "relative", overflow: "hidden"}} onLayout={onLayout}>
            <Canvas style={{width: "100%", height: "100%"}}>
                {
                    showBackground ? (
                        sourceMain ? (
                            <RoundedRect x={0} y={0} width={layoutWidth} height={renderHeight} r={borderRadius}>
                                <Shader source={sourceMain} uniforms={uniforms} />
                            </RoundedRect>
                        ) : (
                            <RoundedRect x={0} y={0} width={layoutWidth} height={renderHeight} r={borderRadius} color={"#2E3A57"} />
                        )
                    ) : null
                }
                
                {
                    sourceNumberRect ? (
                        <RoundedRect x={marginLeft} y={renderHeight / 2 - leftRectHeight / 2} width={leftRectWidth} height={leftRectHeight} r={borderRadius}>
                            <Shader source={sourceNumberRect} uniforms={uniforms} />
                        </RoundedRect>
                    ) : (
                        <RoundedRect x={marginLeft} y={renderHeight / 2 - leftRectHeight / 2} width={leftRectWidth} height={leftRectHeight} r={borderRadius} color={"#3C4A6E"} />
                    )
                }

            </Canvas>
            <View pointerEvents="none" style={styles.webTextOverlay}>
                <View style={[styles.webTextRow, {transform: [{ translateX: horizontalOffset }]}]}>
                    <View style={[styles.webLeftTextBox, {width: leftRectWidth, marginRight: gap}]}>
                        <RNText style={{color: textColor, fontSize, fontFamily: "Inter-Regular", marginLeft: "5%", width: "100%", textAlign: "center"}}>{Math.round(number).toString()}</RNText>
                    </View>
                    <RNText style={{color: textColor, fontSize, fontFamily: "Inter-Bold"}}>{text}</RNText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    webTextOverlay: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    webTextRow: {
        flexDirection: "row",
        alignItems: "center"
    },
    webLeftTextBox: {
        alignItems: "center"
    }
});

export default ShaderFlatDisplay;
