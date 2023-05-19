import { z } from 'zod';

export const statementCsvLineSchema = z
	.object({
		Info: z.string(),
		Net: z.preprocess((input) => {
			return z
				.string()
				.transform((v) => v.replace(/[^-.,0-9]/g, ''))
				.parse(input);
		}, z.coerce.number().default(0)),
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
	orderId: number | null;
	type: string;
	title: string;
};
