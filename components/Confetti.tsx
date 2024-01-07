
import React, { useImperativeHandle, useRef, memo } from "react";
import { View, StyleSheet, Animated } from "react-native";

import ConfettiCannon from 'react-native-confetti-cannon';

const Confetti = (_props, ref) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const confettiRef = useRef<ConfettiCannon>(null); 
    const confettiWrapperRef = useRef<View>(null);

    const start = () => {
        confettiRef.current.start();
    };

    useImperativeHandle(ref, () => ({
        start
    }));

    const confettiStart = () => {
        const fadeOut = () => {
            Animated.timing(fadeAnim, {
                toValue: 0.01,
                duration: 1000,
                useNativeDriver: true,
                delay: 2000
            }).start();
        }

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 10,
            useNativeDriver: true
        }).start(fadeOut);
    };

    const confettiStop = () => {};

    return (
        <Animated.View style={[styles.confettiView, {opacity: fadeAnim}]} ref={confettiWrapperRef}>
            <ConfettiCannon count={20} origin={{x: -50, y: 0}} autoStart={false} ref={confettiRef} onAnimationStart={confettiStart} onAnimationEnd={confettiStop} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    confettiView: {
        zIndex: 99999,
        position: "absolute",
        height: "100%"
    }
});

export type ConfettiHandle = {
    start: () => void;
};

export default memo(React.forwardRef<ConfettiHandle, any>(Confetti));
