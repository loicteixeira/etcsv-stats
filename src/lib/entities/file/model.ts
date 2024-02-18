import type { ZodIssue } from 'zod';

export type TParseError = { line: number; error: ZodIssue[] };
export type TFileInfo<T> = {
	fileHandle: File | null;
	filename: string;
	records: T[];
	errors: TParseError[];
};
