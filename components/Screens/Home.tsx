import React, { useRef, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";

import { Avatar, Card, IconButton, Button, useTheme } from "react-native-paper";

import CodeView, { CodeViewHandle } from "../CodeView";
import Confetti, { ConfettiHandle } from "../Confetti"

const Home = () => {
    const theme = useTheme();

    const [selected, markAsSelected] = useState(false);

    const confettiRef = useRef<ConfettiHandle>(null);
    const codeViewRef = useRef<CodeViewHandle>(null);

    /** placeholder -- syntax highlighting test */

    let codeString = "const x = () => {return 1}; // test of some loooooooong line\n/* Second line */\n";

    for (let i = 0; i < 30; i++)
    {
        codeString += "/* abcd " + i + " */\n";
    }

    return (
        <View style={styles.mainWrapper}>
            <Confetti ref={confettiRef} />

            <Card.Title
                title="Where is the Bug?"
                subtitle="Select a line of code and submit!"
                left={(props) => <Avatar.Icon {...props} icon="nintendo-game-boy" style={{backgroundColor: theme.colors.secondary}} />}
                right={(props) => 
                    <View style={{flexDirection: "row"}}>
                        {/* hint button */}
                        <IconButton {...props} icon="head-question-outline" onPress={() => {}} />
                    </View>
                }
            />

            <View style={styles.topWrapper}>
                <CodeView codeString={codeString} wrapLines={false} ref={codeViewRef} callback={(_lineIndex: number) => {
                    if (!selected)
                        markAsSelected(true);
                }} />
            </View>
            
            <View style={styles.bottomWrapper}>
                <Button
                    icon="check-circle"
                    mode="contained"
                    style={{backgroundColor: !selected ? theme.colors.backdrop : theme.colors.secondary}}
                    disabled={!selected}
                    onPress={() => { confettiRef.current.submit(); console.log(codeViewRef.current.getSelectedLine()) }}
                >
                    Submit
                </Button>

                <Button
                    icon="skip-next-circle-outline"
                    mode="contained"
                    style={{backgroundColor: theme.colors.error}}
                    onPress={() => {}}
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
