import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";

import { Avatar, Card, IconButton, Button, useTheme, ActivityIndicator } from "react-native-paper";

import CodeView, { CodeViewHandle } from "../CodeView";
import Confetti, { ConfettiHandle } from "../Confetti";
import HintModal, { HintModalHandle } from "../HintModal";
import SubmitButton, { SubmitButtonHandle } from "../SubmitButton";

import AppConfig from "../../util/AppConfig";
import { Bug } from "../../util/Bug";
import HomeHeader from "../HomeHeader";

const Home = () => {
    const theme = useTheme();

    const [bug, setBug] = useState<Bug>(null);
    const [isLoading, setLoading] = useState(false);

    const confettiRef = useRef<ConfettiHandle>(null);
    const codeViewRef = useRef<CodeViewHandle>(null);
    const hintModalRef = useRef<HintModalHandle>(null);
    const submitButtonRef = useRef<SubmitButtonHandle>(null);

    const loadBugFromAPI = async () => {
        try {
            const response = await fetch(AppConfig.api("requestBug"));
            const json = await response.json();
            setBug(json);
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
            console.log("BUG from API loaded");
        }
    };

    useEffect(() => {
        if (!bug && !isLoading) {
            setLoading(true);
            loadBugFromAPI();
        }
    });

    const isAnswerCorrect = () => (
        bug && submitButtonRef && !submitButtonRef.current.getIsDisabled() && (bug.answer - 1) == codeViewRef.current.getSelectedLine()
    );

    const codeViewCallback = useCallback((_lineIndex: number) => {
        submitButtonRef.current.setDisabled(false);
    }, [submitButtonRef])

    const submitButtonCallback = useCallback(() => {
        if (isAnswerCorrect()) {
            confettiRef.current.start();
            setBug(null);
            console.log("test")
        }
        else {
            // ...
        }
    }, [confettiRef, submitButtonRef, codeViewRef, bug]);

    const hintCallback = useCallback(() => {
        hintModalRef.current.showModal()
    }, [hintModalRef]);

    const getHintTextCallback = useCallback(() => (
        bug ? bug.hint : "Error"
    ), [bug]);

    const isLoadingCallback = useCallback(() => (
        !bug || isLoading
    ), [bug, isLoading]);

    return (
        <View style={styles.mainWrapper}>
            <HintModal ref={hintModalRef} getHintText={getHintTextCallback} isLoading={isLoadingCallback} />
            
            <Confetti ref={confettiRef} />

            <HomeHeader hintCallback={hintCallback} />

            <View style={styles.topWrapper}>
                { (!bug || isLoading) ? (
                    <ActivityIndicator />
                ) : (
                <CodeView codeString={bug.body} wrapLines={false} ref={codeViewRef} callback={codeViewCallback} />)}
            </View>
            
            <View style={styles.bottomWrapper}>
                <SubmitButton ref={submitButtonRef} onPress={submitButtonCallback} />

                <Button
                    icon="skip-next-circle-outline"
                    mode="contained"
                    style={{backgroundColor: theme.colors.error}}
                    // onPress={() => {}}
                >
                    Skip
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingTop: 10,
        flex: 1
    },
    topWrapper: {
        marginTop: 15,
        flex: 6
    },
    bottomWrapper: {
        margin: 10,
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        flexDirection: "row"
    }
});

export default Home;
