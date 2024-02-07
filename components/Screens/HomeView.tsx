import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { AVPlaybackSource, Audio } from 'expo-av';

import CodeView from "../CodeView";
import Confetti, { ConfettiHandle } from "../Confetti";
import HintModal from "../HintModal";

import { LineToHighlight } from "../CodeHighlighter";
import { Bug } from "../../util/Bug";

import HomeHeader from "../HomeHeader";
import AnswerButtons from "../AnswerButton";
import IncorrectPopup from "../IncorrectPopup";

import { UserAPI, UserContext } from "../../util/UserContext";
import NextBugButton from "../NextBugButtons";

const correctSound = require("../../assets/correct.mp3") as AVPlaybackSource;
const wrongSound = require("../../assets/wrong.mp3") as AVPlaybackSource;

const HomeView = () => {
    const [bug, setBug] = useState<Bug>(null);
    const [isLoading, setLoading] = useState(false);

    const [sound, setSound] = useState<Audio.Sound>();
    
    const [hintModalShown, setHintModalShown] = useState(false); 
    const [incorrectPopupShown, setIncorrectPopupShown] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
    const [selectedLine, setSelectedLine] = useState<LineToHighlight | null>(null);
    const [correctAnswerState, setCorrectAnswerState] = useState(false);
    const [rewardText, setRewardText] = useState<string>(null);

    const userContext = useContext(UserContext);

    /* Sound */
    const playSound = useCallback(async (s: AVPlaybackSource) => {
        const { sound } = await Audio.Sound.createAsync(s);
        setSound(sound);

        await sound.playAsync();
    }, [sound]);

    /* Confetti is fired imperatively */
    const confettiRef = useRef<ConfettiHandle>(null);

    let timeout = null;
    const loadBugFromAPI = async () => {
        try {
            const json = await UserAPI.getBug(userContext.user);

            if (json.success === false) {
                console.log("Trying again...");
                if (timeout)
                    clearTimeout(timeout);
                timeout = setTimeout(loadBugFromAPI, 1000);
            }
            else {
                setBug(json);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
            console.log("BUG from API loaded");
        }
    };

    /* Effects */
    useEffect(() => {
        /* Serving Bugs */
        if (!bug && !isLoading) {
            setLoading(true);
            loadBugFromAPI();
        }
    });

    useEffect(() => {
        /* Cleanup */
        if (sound) {
            return () => {
                sound.unloadAsync();
            }
        }
    }, [sound]);

    /* Core callbacks */
    const isAnswerCorrect = useCallback(() => (
        bug && selectedLine && !submitButtonDisabled && (bug.answer - 1) == selectedLine.index
    ), [bug, submitButtonDisabled, selectedLine]);

    const codeViewPressCallback = useCallback((lineIndex: number) => {
        if (correctAnswerState)
            return; /* disable line select */

        setSubmitButtonDisabled(false);
        setSelectedLine({
            index: lineIndex,
            color: "#555"
        });
    }, [correctAnswerState]);

    const linesToHighlight = useMemo(() => (
        selectedLine ? [selectedLine] : []
    ), [selectedLine]);

    const submitButtonCallback = useCallback(async () => {
        if (!selectedLine)
            return;

        setSubmitButtonDisabled(true);

        if (isAnswerCorrect()) {
            /* Correct answer */
            confettiRef.current.start();

            setIncorrectPopupShown(false);
            setCorrectAnswerState(true);
            setSelectedLine({
                index: selectedLine.index,
                color: "#20612c"
            });

            playSound(correctSound);

            const {reward} = await UserAPI.correct(userContext);
            if (reward && reward.type !== 'none') {
                switch(reward.type) { 
                    case 'exp': {
                        setRewardText(`+ ${reward.value} EXP`);
                        break;
                    }
                    case 'currency': {
                        setRewardText(`+ ${reward.value} SP`);
                        break;
                    }
                }
            }
        }
        else {
            /* Incorrect answer */
            setIncorrectPopupShown(true);
            
            setSelectedLine({
                index: selectedLine.index,
                color: "#a13e28"
            });

            UserAPI.wrong(userContext);

            playSound(wrongSound);
        }
    }, [confettiRef, isAnswerCorrect]);

    const hideIncorrectCallback = useCallback(() => {
        setIncorrectPopupShown(false)
    }, []);

    const nextButtonCallback = useCallback(() => {
        setCorrectAnswerState(false);
        setBug(null);
        setSelectedLine(null);
        setRewardText(null);
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

            <HomeHeader
                hintCallback={hintCallback}
                explanation={(!bug || isLoading) ? "..." : bug.explanation}
                rewardText={rewardText}
                showExplanation={correctAnswerState}
                showReward={correctAnswerState}
            />

            <View style={styles.topWrapper}>
                { (!bug || isLoading) ? (
                    <ActivityIndicator />
                ) : (
                <CodeView
                    codeString={bug.body}
                    codeLanguage={bug.language?.toLowerCase()}
                    wrapLines={false}
                    callback={codeViewPressCallback}
                    linesToHighlight={linesToHighlight}
                />)}
            </View>
            
            <View style={styles.bottomWrapper}>
                <View style={styles.buttonWrapper}>
                    { correctAnswerState ? 
                        <NextBugButton onPress={nextButtonCallback}></NextBugButton> :
                        <AnswerButtons submitButtonDisabled={submitButtonDisabled} submitButtonCallback={submitButtonCallback} />
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingTop: 20,
        flex: 1
    },
    topWrapper: {
        flex: 6,
        marginTop: 20,
        // justifyContent: "center"
    },
    bottomWrapper: {
        margin: 10,
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        flexDirection: "row"
    },
    buttonWrapper: {
        justifyContent: "space-around",
        alignItems: "center",
        flex: 1,
        flexDirection: "row"
    }
});

export default HomeView;
