import React, { type FunctionComponent, type ReactNode, useMemo } from "react";
import {
	ScrollView,
	type ScrollViewProps,
	type StyleProp,
	StyleSheet,
	Text,
	type TextStyle,
	View,
	type ViewStyle,
} from "react-native";
import SyntaxHighlighter, { SyntaxHighlighterProps,
} from "react-syntax-highlighter";
import { trimNewlines } from "trim-newlines";
import {
	type HighlighterStyleSheet,
	type ReactStyle,
	getRNStylesFromHljsStyle,
	styles
} from "./styles";

export interface CodeHighlighterProps extends SyntaxHighlighterProps {
	hljsStyle: ReactStyle;
	textStyle?: StyleProp<TextStyle>;
	verticalScrollViewProps?: ScrollViewProps;
	horizontalScrollViewProps?: ScrollViewProps;
}

export const CodeHighlighter: FunctionComponent<CodeHighlighterProps> = ({
	children,
	textStyle,
	hljsStyle,
	horizontalScrollViewProps,
	verticalScrollViewProps,
	...rest
}) => {
	const stylesheet: HighlighterStyleSheet = useMemo(
		() => getRNStylesFromHljsStyle(hljsStyle),
		[hljsStyle],
	);

	const getStylesForNode = (node: rendererNode): TextStyle[] => {
		const classes: string[] = node.properties?.className ?? [];
		let mapped = classes
			.map((c: string) => stylesheet[c])
			.filter((c) => !!c) as TextStyle[];

		return mapped;
	};

	const renderNode = (nodes: rendererNode[], keyPrefix = "row") =>
		nodes.reduce<ReactNode[]>((acc, node, index) => {
			const keyPrefixWithIndex = `${keyPrefix}_${index}`;

			if (node.children) {
				const isLineNumber = rest.showLineNumbers && index == 0 && node.children[0].value;

				const nodeStyles = StyleSheet.flatten([
					textStyle,
					{ color: stylesheet.hljs?.color },
					getStylesForNode(node)
				]);

				if (isLineNumber) {
					// console.log(keyPrefix, node.children[0].value);

					acc.push(
						<View style={{ flexDirection: "row", flex: 1 }} key={`${keyPrefixWithIndex}_view`}>
							<Text style={styles.lineNumberStyles} key={`${keyPrefixWithIndex}_line_number_${node.children[0].value}`}>
								{node.children[0].value}
							</Text>
							<Text style={nodeStyles} key={keyPrefixWithIndex}>
								{renderNode(node.children.slice(1), `${keyPrefixWithIndex}_child`)}
							</Text>
						</View>
					);
				}
				else {
					acc.push(
						<View key={`${keyPrefixWithIndex}_view`}>
							<Text style={nodeStyles} key={keyPrefixWithIndex}>
								{renderNode(node.children, `${keyPrefixWithIndex}_child`)}
							</Text>
						</View>
					);
				}
			}

			if (node.value) {
				acc.push(trimNewlines(String(node.value)));
			}

			return acc;
		}, []);

	const renderer = (props: rendererProps) => {
		const { rows } = props;
		return (
			<ScrollView {...verticalScrollViewProps} contentContainerStyle={verticalScrollViewProps?.contentContainerStyle}>
				<ScrollView
					{...horizontalScrollViewProps}
					horizontal
					contentContainerStyle={[
						stylesheet.hljs,
						horizontalScrollViewProps?.contentContainerStyle
					]}
				>
					<View>{renderNode(rows)}</View>
				</ScrollView>
			</ScrollView>
		);
	};

	return (
		<SyntaxHighlighter
			{...rest}
			renderer={renderer}
			CodeTag={View}
			PreTag={View}
			style={{}}
			testID="react-native-code-highlighter"
		>
			{children}
		</SyntaxHighlighter>
	);
};

export default CodeHighlighter;
