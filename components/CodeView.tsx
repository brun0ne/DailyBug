import { memo } from "react";
import { StyleSheet } from "react-native";

import CodeHighlighter, { type LineToHighlight } from "./CodeHighlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type CodeViewProps = {
    codeString: string;
    wrapLines: boolean;
    linesToHighlight?: Array<LineToHighlight>;
    callback: (lineIndex: number) => any;
};

const CodeView = (props: CodeViewProps) => {
    return (
        <CodeHighlighter
            hljsStyle={atomOneDarkReasonable}
            horizontalScrollViewProps={{ contentContainerStyle: styles(props.wrapLines).codeContainer }}
            textStyle={styles(props.wrapLines).text}
            language="typescript"
            showLineNumbers={true}
            wrapLines={props.wrapLines ? true : undefined}
            selectedLines={props.linesToHighlight}
            onLinePress={props.callback}
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

export default memo(CodeView);
