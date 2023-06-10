import { z } from 'zod';

export const statementCsvLineSchema = z
	.object({
		Info: z.string(),
		Net: z.string(),
		Title: z.string(),
		Type: z.string(),
	})
	.transform((line) => ({
		amount: line['Net'],
		info: line['Info'],
		type: line['Type'],
		title: line['Title'],
	}));

export type TStatementCsvLine = z.infer<typeof statementCsvLineSchema>;

export type TStatement = {
	amount: number;
	info: string;
	orderID: number | null;
	type: string;
	title: string;
};
