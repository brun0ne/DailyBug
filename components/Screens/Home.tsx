import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import CodeHighlighter from "../CodeHighlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Avatar, Card, IconButton, Button, useTheme } from "react-native-paper";

const WRAP_LINES = false;

const Home = () => {
    const theme = useTheme();
    const [selectedLine, setSelectedLine] = useState(-1);

    /** placeholder -- syntax highlighting test */

    let codeString = "const x = () => {return 1}; // test of some loooooooong line\n/* Second line */\n";

    for (let i = 0; i < 30; i++)
    {
        codeString += "/* abcd " + i + " */\n";
    }

    return (
        <View style={styles.mainWrapper}>
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
                <CodeHighlighter
                    hljsStyle={atomOneDarkReasonable}
                    horizontalScrollViewProps={{contentContainerStyle: styles.codeContainer}}
                    textStyle={styles.text}
                    language="typescript"
                    showLineNumbers={true}
                    wrapLines={WRAP_LINES ? true : undefined}

                    selectedLineNumbers={[selectedLine]}
                    onLinePress={(lineIndex) => { setSelectedLine(lineIndex) }}
                >
                    {codeString}
                </CodeHighlighter>
            </View>
            
            <View style={styles.bottomWrapper}>
                <Button
                    icon="check-circle"
                    mode="contained"
                    style={{backgroundColor: (selectedLine == -1) ? theme.colors.backdrop : theme.colors.secondary}}
                    disabled={selectedLine == -1}
                    onPress={() => {}}
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
	codeContainer: {
		padding: 16,
        ...(WRAP_LINES ? {width: "100%"} : {}),
        ...(!WRAP_LINES ? {minWidth: "100%"} : {}),
	},
    outerCodeContainer: {
        backgroundColor: "blue"
    },
	text: {
		fontSize: 15
	},
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
