
import React, { useImperativeHandle, useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

import ConfettiCannon from 'react-native-confetti-cannon';

const Confetti = (_props, ref) => {
    const fadeAnim = useRef(new Animated.Value(100)).current;
    const confettiRef = useRef<ConfettiCannon>(null); 
    const confettiWrapperRef = useRef<View>(null);

    const [display, setDisplay] = useState(false);

    const start = () => {
        setDisplay(true);
        confettiRef.current.start();
    };

    useImperativeHandle(ref, () => ({
        start
    }));

    const confettiStart = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
            delay: 100
        }).start();
    };

    const confettiStop = () => {
        setDisplay(false);

        Animated.timing(fadeAnim, {
            toValue: 100,
            duration: 0,
            useNativeDriver: true
        }).start();
    };

    return (
        <Animated.View style={[styles.confettiView, {opacity: fadeAnim, display: display ? "flex" : "none"}]} ref={confettiWrapperRef}>
            <ConfettiCannon count={50} origin={{x: 0, y: 0}} autoStart={false} ref={confettiRef} onAnimationStart={confettiStart} onAnimationEnd={confettiStop} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    confettiView: {
        zIndex: 99999,
        position: "absolute",
        height: "100%",
        display: "none"
    }
});

export type ConfettiHandle = {
    start: () => void;
};

export default React.forwardRef<ConfettiHandle, any>(Confetti);
