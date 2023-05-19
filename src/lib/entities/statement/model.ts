import { z } from 'zod';

export const statementCsvLineSchema = z
	.object({
		// Amount: z.coerce.number().default(0), // Can be negative for refunds
		// Currency: z.string(),
		Date: z.string(), // Date as `Month DD, YYYY`
		// 'Fees & Taxes': z.coerce.number().nonpositive().default(0),
		Info: z.string(),
		// Net: z.string().regex(/\d+/).transform(Number),
		Net: z.preprocess((input) => {
			return z
				.string()
				.transform((v) => v.replace(/[^-.,0-9]/g, ''))
				.parse(input);
		}, z.coerce.number().default(0)),
		// 'Tax Details': z.string(),  // Always empty?
		Title: z.string(),
		Type: z.string(),
	})
	.transform((line) => ({
		amount: line['Net'],
		date: line['Date'],
		info: line['Info'],
		type: line['Type'],
		title: line['Title'],
	}));

export type TStatementCsvLine = z.infer<typeof statementCsvLineSchema>;
