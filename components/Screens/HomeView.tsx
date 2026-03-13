import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
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
import SkipModal from "../SkipModal";
import { webScreenContentStyle } from "../../util/Layout";

import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const correctSound = require("../../assets/correct.mp3") as AVPlaybackSource;
const wrongSound = require("../../assets/wrong.mp3") as AVPlaybackSource;
const gaveUpSound = require("../../assets/gave_up.mp3") as AVPlaybackSource;

const HomeView = () => {
    const isFocused = useIsFocused();

    const [bug, setBug] = useState<Bug>(null);
    const [isLoading, setLoading] = useState(false);
    const [firstTimeLoaded, setFirstTimeLoaded] = useState(false);

    const [sound, setSound] = useState<Audio.Sound>();
    
    const [hintModalShown, setHintModalShown] = useState(false); 
    const [skipModalShown, setSkipModalShown] = useState(false);
    const [incorrectPopupShown, setIncorrectPopupShown] = useState(false);

    const [nextAfterWrongUnlocked, setNextAfterWrongUnlocked] = useState(false);
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);

    const [selectedLine, setSelectedLine] = useState<LineToHighlight | null>(null);

    const [resultScreenState, setResultScreenState] = useState(false);
    const [gaveUpState, setGaveUpState] = useState(false);

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

    const loadBugFromAPI = async () => {
        console.log("LOADING");
        if (isLoading)
            return;

        setLoading(true);

        try {
            const json = await UserAPI.getBug(userContext.user);

            if (json.success !== false) {
                setBug(json);
                await AsyncStorage.setItem("previous-bug", JSON.stringify(json));

                console.log("BUG from API loaded");
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    /* Effects */
    useEffect(() => {
        if (!firstTimeLoaded && !bug && !isLoading) {
            /* Serving Bugs */            
            setLoading(true);

            (async () => {
                const previous = await AsyncStorage.getItem("previous-bug");

                if (previous) {
                    setBug(JSON.parse(previous));
                    setLoading(false);
                }
                else {
                    await loadBugFromAPI();
                }

                setFirstTimeLoaded(true);
            })();
        }
        else if (firstTimeLoaded && !bug && !isLoading) {
            loadBugFromAPI();
        }
    }, [firstTimeLoaded, bug, isLoading]);

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
        if (resultScreenState)
            return; /* disable line select */

        setSubmitButtonDisabled(false);
        setSelectedLine({
            index: lineIndex,
            color: "#555"
        });
    }, [resultScreenState]);

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
            setResultScreenState(true);
            setSelectedLine({
                index: selectedLine.index,
                color: "#20612c"
            });

            playSound(correctSound);

            /* remove the bug from local storage */
            AsyncStorage.removeItem("previous-bug");

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
            setNextAfterWrongUnlocked(true);
            
            setSelectedLine({
                index: selectedLine.index,
                color: "#a13e28"
            });

            UserAPI.wrong(userContext);

            playSound(wrongSound);

        }
    }, [confettiRef, isAnswerCorrect]);

    const hideIncorrectCallback = useCallback(() => {
        setIncorrectPopupShown(false);
    }, []);

    const nextButtonCallback = useCallback(() => {
        setGaveUpState(false);
        setResultScreenState(false);
        setBug(null);
        setSelectedLine(null);
        setRewardText(null);
        setNextAfterWrongUnlocked(false);
    }, []);

    /* Hint callbacks */
    const hideHindModal = useCallback(() => {
        setHintModalShown(false);
    }, []);

    const hintModalCallback = useCallback(() => {
        setHintModalShown(true);
    }, []);

    const getHintTextCallback = useCallback(() => (
        bug ? bug.hint : "Error"
    ), [bug]);

    /* Skip callbacks */

    const hideSkipModal = useCallback(() => {
        setSkipModalShown(false);
    }, []);

    const skipModalCallback = useCallback(() => {
        setSkipModalShown(true);
    }, []);

    const doSkipCallback = useCallback(() => {
        setGaveUpState(false);
        setResultScreenState(false);
        setBug(null);
        setSelectedLine(null);
        setRewardText(null);

        UserAPI.doSkip(userContext);

    }, []);

    const giveUpCallback = useCallback(() => {
        setGaveUpState(true);
        setIncorrectPopupShown(false);
        setResultScreenState(true);
        setSelectedLine({
            index: bug.answer - 1,
            color: "#20612c"
        });

        /* remove the bug from local storage */
        AsyncStorage.removeItem("previous-bug");

        playSound(gaveUpSound);

    }, [selectedLine]);

    /* Loading callback */
    const isLoadingCallback = useCallback(() => (
        !bug || isLoading
    ), [bug, isLoading]);

    if (!isFocused)
        return <></>;

    return (
        <View style={styles.mainWrapper}>
            <HintModal visible={hintModalShown} hide={hideHindModal} getHintText={getHintTextCallback} isLoading={isLoadingCallback} />

            <SkipModal visible={skipModalShown} hide={hideSkipModal} skip={doSkipCallback} />
            
            <Confetti ref={confettiRef} />

            <IncorrectPopup visible={incorrectPopupShown} hideCallback={hideIncorrectCallback} />

            <HomeHeader
                hintCallback={hintModalCallback}
                explanation={(!bug || isLoading) ? "..." : bug.explanation}
                rewardText={rewardText}
                showExplanation={resultScreenState}
                showReward={resultScreenState}
                gaveUp={gaveUpState}
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
                    scrollToFirstHighlighted={gaveUpState}
                />)}
            </View>
            
            <View style={styles.bottomWrapper}>
                <View style={styles.buttonWrapper}>
                    { resultScreenState ? 
                        <NextBugButton onPress={nextButtonCallback}></NextBugButton> :
                        <AnswerButtons
                            submitButtonDisabled={submitButtonDisabled}
                            submitButtonCallback={submitButtonCallback}

                            nextAfterWrongUnlocked={nextAfterWrongUnlocked}

                            skipButtonCallback={skipModalCallback}
                            giveUpButtonCallback={giveUpCallback}
                        />
                    }
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainWrapper: {
        paddingTop: 20,
        flex: 1,
        ...webScreenContentStyle,
    },
    topWrapper: {
        flex: 6,
        marginTop: 20,
        maxHeight: "50%"
    },
    bottomWrapper: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: "100%"
    },
    buttonWrapper: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        ...(Platform.OS === "web" ? { width: "100%" } : {})
    }
});

export default HomeView;
