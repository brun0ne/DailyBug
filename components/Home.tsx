import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

import CodeHighlighter from "./CodeHighlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

const WRAP_LINES = false;

const Home = () => {

    /** placeholder -- syntax highlighting test */

    let codeString = "const x = () => {return 1}; // test of some loooooooong line\n/* Second line */\n";

    for (let i = 0; i < 30; i++)
    {
        codeString += "/* abcd " + i + " */\n";
    }

    return (
        <View style={styles.mainWrapper}>
            <CodeHighlighter
                hljsStyle={atomOneDarkReasonable}
                scrollViewProps={{contentContainerStyle: styles.codeContainer}}
                textStyle={styles.text}
                language="typescript"
                showLineNumbers={true}
                wrapLines={WRAP_LINES ? true : undefined}
            >
                {codeString}
            </CodeHighlighter>
        </View>
    );
};

const styles = StyleSheet.create({
	codeContainer: {
		padding: 16,
        ...(WRAP_LINES ? {width: "100%"} : {}),
        ...(!WRAP_LINES ? {minWidth: "100%"} : {})
	},
	text: {
		fontSize: 15
	},
    mainWrapper: {
        paddingTop: 50,
        paddingBottom: 50
    }
});

export default Home;
