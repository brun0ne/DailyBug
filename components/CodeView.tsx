import React, { useImperativeHandle, useState, memo } from "react";
import { StyleSheet } from "react-native";

import CodeHighlighter from "./CodeHighlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type CodeViewProps = {
    codeString: string;
    wrapLines: boolean;
    callback: (lineIndex: number) => any;
};

const CodeView = (props: CodeViewProps, ref) => {
    const [selectedLine, setSelectedLine] = useState(-1);

    const getSelectedLine = () => {
        return selectedLine;
    }

    useImperativeHandle(ref, () => ({
        getSelectedLine
    }));

    return (
        <CodeHighlighter
            hljsStyle={atomOneDarkReasonable}
            horizontalScrollViewProps={{ contentContainerStyle: styles(props.wrapLines).codeContainer }}
            textStyle={styles(props.wrapLines).text}
            language="typescript"
            showLineNumbers={true}
            wrapLines={props.wrapLines ? true : undefined}

            selectedLineNumbers={[selectedLine]}
            onLinePress={(lineIndex) => {
                props.callback(lineIndex);
                setSelectedLine(lineIndex);
            }}
        >
            {props.codeString}
        </CodeHighlighter>
    );
};

const styles = (wrapLines: boolean) => StyleSheet.create({
	codeContainer: {
		padding: 16,
        ...(wrapLines ? {width: "100%"} : {}),
        ...(!wrapLines ? {minWidth: "100%"} : {}),
	},
	text: {
		fontSize: 15
	}
});

export type CodeViewHandle = {
    getSelectedLine: () => number;
};

export default memo(React.forwardRef<CodeViewHandle, CodeViewProps>(CodeView));
