
import React, { useImperativeHandle, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

import ConfettiCannon from 'react-native-confetti-cannon';

const Confetti = (_props, ref) => {
    const fadeAnim = useRef(new Animated.Value(100)).current;
    const confettiRef = useRef<ConfettiCannon>(null); 
    const confettiWrapperRef = useRef<View>(null);

    const submit = () => {
        confettiWrapperRef.current.setNativeProps({style: {display: "flex"}});
        confettiRef.current.start();
    };

    useImperativeHandle(ref, () => ({
        submit
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
        confettiWrapperRef.current.setNativeProps({style: {display: "none"}});

        Animated.timing(fadeAnim, {
            toValue: 100,
            duration: 0,
            useNativeDriver: true
        }).start();
    };

    return (
        <Animated.View style={[styles.confettiView, {opacity: fadeAnim}]} ref={confettiWrapperRef}>
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
    submit: () => void;
};

export default React.forwardRef<ConfettiHandle, any>(Confetti);
