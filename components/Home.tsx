import React, { useState } from "react";
import { View } from "react-native";

import SyntaxHighlighter from 'react-native-syntax-highlighter';
import dracula from 'react-syntax-highlighter/dist/esm/styles/hljs/dracula';

const Home = () => {

    /** placeholder -- syntax highlighting test */

    const codeString = "const x = () => {return 1}; // test";

    return (
        <View style={{padding: 50}}>
            <SyntaxHighlighter
                language='javascript'
                style={dracula}
                highlighter={"hljs"}
            >
                {codeString}
            </SyntaxHighlighter>
        </View>
    );
};

export default Home;
