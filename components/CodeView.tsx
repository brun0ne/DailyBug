import { memo } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import CodeHighlighter, { type LineToHighlight } from "./CodeHighlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

export type CodeViewProps = {
    codeString: string;
    codeLanguage: string

    wrapLines: boolean;
    linesToHighlight?: Array<LineToHighlight>;
    callback: (lineIndex: number) => any;
};

const CodeView = (props: CodeViewProps) => {
    const styles = stylesGen(props.wrapLines);

    const prettyLanguage = (lang: string) => {
        const m = {
            "javascript": "JavaScript",
            "typescript": "TypeScript",
            "cpp": "C++",
            "c": "C",
            "ocaml": "OCaml",
            "java": "Java"
        };

        return m[lang.toLowerCase()] ?? lang;
    };

    return (
        <View>
            <View style={styles.languageView}><Text style={{color: "gray"}}>{prettyLanguage(props.codeLanguage)}</Text></View>
            <CodeHighlighter
                hljsStyle={atomOneDarkReasonable}
                horizontalScrollViewProps={{ contentContainerStyle: styles.codeContainer }}
                textStyle={styles.text}
                language={props.codeLanguage}
                showLineNumbers={true}
                wrapLines={props.wrapLines ? true : undefined}
                selectedLines={props.linesToHighlight}
                onLinePress={props.callback}
            >
                {props.codeString.replaceAll("\t", "  ")}
            </CodeHighlighter>
        </View>
    );
};

const stylesGen = (wrapLines: boolean) => StyleSheet.create({
    languageView: {
        padding: 10,
        backgroundColor: "hsl(220, 13%, 18%)"
    },
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
