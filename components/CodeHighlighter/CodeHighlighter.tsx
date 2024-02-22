import { type FunctionComponent, type ReactNode, useMemo } from "react";

import {
	ScrollView,
	type ScrollViewProps,
	type StyleProp,
	StyleSheet,
	type TextStyle,
	View,
} from "react-native";

import SyntaxHighlighter, { SyntaxHighlighterProps } from "react-syntax-highlighter";
import { trimNewlines } from "trim-newlines";

import {
	type HighlighterStyleSheet,
	type ReactStyle,
	getRNStylesFromHljsStyle,
	styles
} from "./styles";

import { TouchableRipple, Text } from "react-native-paper";

export type LineToHighlight = {
    index: number,
    color: string
}

export interface CodeHighlighterProps extends SyntaxHighlighterProps {
	hljsStyle: ReactStyle;
	textStyle?: StyleProp<TextStyle>;
	verticalScrollViewProps?: ScrollViewProps;
	horizontalScrollViewProps?: ScrollViewProps;
	selectedLines?: Array<LineToHighlight>;
	onLinePress?: (lineIndex: number) => any
}

export const CodeHighlighter: FunctionComponent<CodeHighlighterProps> = ({
	children,
	textStyle,
	hljsStyle,
	horizontalScrollViewProps,
	verticalScrollViewProps,
	selectedLines,
	onLinePress,
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

			const nodeStyles = StyleSheet.flatten([
				textStyle,
				{ color: stylesheet.hljs?.color },
				getStylesForNode(node)
			]);

			if (node.children) {
				if (rest.showLineNumbers && index == 0 && node.children[0].value) {
					acc.push(
						<Text variant="bodyMedium" style={[nodeStyles, styles.lineNumberStyles]} key={`${keyPrefixWithIndex}_line_number_${node.children[0].value}`}>
							{node.children[0].value + "\t" + "\t".repeat(4 - node.children[0].value.toString().length)}
						</Text>
					);
				}
				else {
					const isLine = !(keyPrefixWithIndex.includes("child"));

					if (isLine) {
						const isSelected = selectedLines ? selectedLines.map((e => e.index)).includes(index) : false;
						const selectedBackgroundColor = isSelected ? (selectedLines.find(e => e.index == index).color) : "";

						acc.push(
							<TouchableRipple rippleColor={"white"} key={`${keyPrefixWithIndex}_view`} onPress={() => { onLinePress(index) }}>
								<Text
									style={[isSelected ? {backgroundColor: selectedBackgroundColor} : styles.line, nodeStyles]}
									key={keyPrefixWithIndex}
									variant="bodyMedium"
								>
									{renderNode(node.children, `${keyPrefixWithIndex}_child`)}
								</Text>
							</TouchableRipple >
						);
					}
					else {
						acc.push(
							<Text
								style={[nodeStyles]}
								key={keyPrefixWithIndex}
								variant="bodyMedium"
							>
								{renderNode(node.children, `${keyPrefixWithIndex}_child`)}
							</Text>
						);
					}
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
					<View style={{width: "100%"}}>{renderNode(rows)}</View>
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
