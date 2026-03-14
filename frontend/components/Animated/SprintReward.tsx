import { BlurMask, Canvas, Extrapolate, RoundedRect, Shader, useComputedValue, useValue, vec } from "@shopify/react-native-skia";
import { StyleSheet, View, Image } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Avatar, Button, Icon, Text } from "react-native-paper";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

import { SprintRewardType } from "../../util/UserContext";
import { itemImages } from "../../util/ItemImages";
import { useSkiaRuntimeEffect } from "../../util/SkiaRuntimeEffect";

const shaderSource = `
uniform vec2 resolution;
uniform float time;

vec4 main(vec2 pos) {
    vec2 n = pos/resolution;

    vec4 color = vec4(n.x, n.y*abs(cos(time/1000)), 1, 1);
    return color;
}

`;

type SprintRewardProps = {
    reward?: SprintRewardType

    closeCallback: () => void
};

const SprintReward = (props: SprintRewardProps) => {
    const width = 300;
    const height = 200;

    const canvasPadding = 40;
    const innerPadding = 10;

    const innerWidth = width - innerPadding;
    const innerHeight = height - innerPadding;

    const time = useValue(0);
    const source = useSkiaRuntimeEffect(shaderSource);

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
            resolution: vec(width, height),
            time: time.current,
        }
    ), [time, width, height]);

    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);

    const gesture = Gesture.Pan()
        .onBegin((event) => {
            rotateX.value = withTiming(interpolate(event.y, [0, innerHeight], [10, -10], Extrapolate.CLAMP));
            rotateY.value = withTiming(interpolate(event.x, [0, innerWidth], [-10, 10], Extrapolate.CLAMP));
        })
        .onUpdate((event) => {
            rotateX.value = interpolate(event.y, [0, innerHeight], [10, -10], Extrapolate.CLAMP);
            rotateY.value = interpolate(event.x, [0, innerWidth], [-10, 10], Extrapolate.CLAMP);
        })
        .onFinalize(() => {
            rotateX.value = withTiming(0);
            rotateY.value = withTiming(0);
        });

    const innerTransform = useAnimatedStyle(() => (
        {
            opacity: 1,
            // @ts-ignore
            transform: [
                { perspective: 300 },
                { rotateX: `${rotateX.value}deg` },
                { rotateY: `${rotateY.value}deg` }
            ]
        }
    ), [rotateX, rotateY]);

    return (
        <View style={styles.wrapper}>
            <Canvas style={{width: width + canvasPadding, height: height + canvasPadding}}>
                <RoundedRect
                    x={canvasPadding / 2}
                    y={canvasPadding / 2}
                    width={width}
                    height={height}
                    r={10}
                    color="white"
                >
                    {
                        source ? <Shader source={source} uniforms={uniforms} /> : null
                    }
                </RoundedRect>
                <BlurMask blur={10} style="solid" />
            </Canvas>
            <GestureDetector gesture={gesture}>
                <Animated.View style={[
                    styles.inner,
                    innerTransform,
                    {
                        width: innerWidth,
                        height: innerHeight,
                        zIndex: 300
                    }
                ]}>
                    <View style={styles.content}>
                        <View style={{flexDirection: "row", gap: 0}}>
                            {
                                [...Array(props.reward?.reward?.stars ?? 0)].map((_, i) => {
                                    return <Icon key={`star_${i}`} source={"star"} size={20} color={"white"} />;
                                })
                            }
                        </View>
                        {
                            itemImages[props.reward?.itemName ?? ""] ? (
                                <Avatar.Image source={itemImages[props.reward?.itemName]} size={80} />
                            ) : (
                                <Icon source={props.reward?.reward?.icon ?? "progress-question"} size={80} color={props.reward?.reward?.color ?? "white"} />
                            )
                        }
                        <Text style={styles.name}>{props.reward?.itemName ?? ""}</Text>
                    </View>
                </Animated.View>
            </GestureDetector>

            {
                props.reward?.converted ? (
                    <View style={styles.converted}>
                        <Text variant="bodyMedium" style={{color: "white"}}>Duplicate! Converted to
                            <Text variant="bodyMedium" style={{fontWeight: "bold", color: "white"}}> 500 SP</Text>.
                        </Text>
                    </View>
                ) : null
            }

            <Button style={styles.closeButton} mode={"outlined"} buttonColor="white" textColor="black" onPress={props.closeCallback}>Close</Button>
        </View>
    )
};

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",

        top: 0,
        left: 0,
        bottom: 0,
        right: 0,

        justifyContent: "center",
        alignItems: "center"
    },
    inner: {
        position: "absolute",
        borderRadius: 10,
        
        backgroundColor: "black"
    },
    content: {
        flexDirection: "column",
        gap: 10,

        padding: 10,
        height: "100%",

        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20
    },
    converted: {
        position: "absolute",
        bottom: 130
    },
    closeButton: {
        position: "absolute",
        bottom: 50
    }
});

export default SprintReward;
