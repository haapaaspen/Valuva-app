/**
 * Chat domain types
 */

export type TextPart = {
	type: 'text';
	key: string;
	content: string;
};

export type ToolPart = {
	type: 'tool';
	key: string;
	toolName: string;
	state: 'call' | 'result';
	displayText: string;
	icon: string;
	result?: any;
};

export type ProcessedPart = TextPart | ToolPart;

export interface GraphicsResult {
	code: string;
	duration: number;
	title?: string;
}

