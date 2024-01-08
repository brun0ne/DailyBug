import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";

import { ActivityIndicator } from "react-native-paper";

import CodeView from "../CodeView";
import Confetti, { ConfettiHandle } from "../Confetti";
import HintModal from "../HintModal";

import { LineToHighlight } from "../CodeHighlighter";
import { Bug } from "../../util/Bug";

import AppConfig from "../../util/AppConfig";

import HomeHeader from "../HomeHeader";
import HomeButtons from "../HomeButtons";
import IncorrectPopup from "../IncorrectPopup";

const Home = () => {
    const [bug, setBug] = useState<Bug>(null);
    const [isLoading, setLoading] = useState(false);
    
    const [hintModalShown, setHintModalShown] = useState(false); 
    const [incorrectPopupShown, setIncorrectPopupShown] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [selectedLine, setSelectedLine] = useState<LineToHighlight | null>(null);

    /* Confetti is fired imperatively */
    const confettiRef = useRef<ConfettiHandle>(null);

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

    /* Core callbacks */
    const isAnswerCorrect = useCallback(() => (
        bug && selectedLine && !submitButtonDisabled && (bug.answer - 1) == selectedLine.index
    ), [bug, submitButtonDisabled, selectedLine]);

    const codeViewCallback = useCallback((lineIndex: number) => {
        setSubmitButtonDisabled(false);
        setSelectedLine(
            {
                index: lineIndex,
                color: "#555"
            }
        );
    }, []);

    const linesToHighlight = useMemo(() => (
        selectedLine ? [selectedLine] : []
    ), [selectedLine]);

    const submitButtonCallback = useCallback(() => {
        if (!selectedLine)
            return;

        if (isAnswerCorrect()) {
            /* Correct answer */
            confettiRef.current.start();

            setIncorrectPopupShown(false)
            setBug(null);
            setSelectedLine(null);
        }
        else {
            /* Incorrect answer */
            setIncorrectPopupShown(true);
            setSubmitButtonDisabled(true);
            
            setSelectedLine({
                index: selectedLine.index,
                color: "#a13e28"
            });
        }
    }, [confettiRef, isAnswerCorrect]);

    const hideIncorrectCallback = useCallback(() => {
        setIncorrectPopupShown(false)
    }, []);

    /* Hint callbacks */
    const hideHindModal = useCallback(() => {
        setHintModalShown(false);
    }, []);

    const hintCallback = useCallback(() => {
        setHintModalShown(true);
    }, []);

    const getHintTextCallback = useCallback(() => (
        bug ? bug.hint : "Error"
    ), [bug]);

    /* Loading callback */
    const isLoadingCallback = useCallback(() => (
        !bug || isLoading
    ), [bug, isLoading]);

    return (
        <View style={styles.mainWrapper}>
            <HintModal visible={hintModalShown} hide={hideHindModal} getHintText={getHintTextCallback} isLoading={isLoadingCallback} />
            
            <Confetti ref={confettiRef} />

            <IncorrectPopup visible={incorrectPopupShown} hideCallback={hideIncorrectCallback} />

            <HomeHeader hintCallback={hintCallback} />

            <View style={styles.topWrapper}>
                { (!bug || isLoading) ? (
                    <ActivityIndicator />
                ) : (
                <CodeView codeString={bug.body} wrapLines={false} callback={codeViewCallback} linesToHighlight={linesToHighlight} />)}
            </View>
            
            <View style={styles.bottomWrapper}>
                <HomeButtons submitButtonDisabled={submitButtonDisabled} submitButtonCallback={submitButtonCallback} />
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
