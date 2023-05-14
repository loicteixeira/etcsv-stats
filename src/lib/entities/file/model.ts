import type { ZodIssue } from 'zod';

export type TParseError = { line: number; error: ZodIssue[] };
export type TFileInfo = {
	fileHandle: File;
	filename: string;
	lineCount: number | undefined;
	errors: TParseError[];
};
