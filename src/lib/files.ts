import type { TParseError } from '$lib/entities/file/model';
import { parse } from 'csv-parse/browser/esm/sync';
import type { ZodType, z } from 'zod';

async function readFileContent(file: File): Promise<string | ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = function (e) {
			const fileContent = e.target?.result;
			if (!fileContent) {
				reject(e);
				return;
			}
			resolve(fileContent);
		};
		reader.onerror = function (e) {
			reject(e);
		};
		reader.readAsText(file);
	});
}

function parseCSV(fileContent: string | ArrayBuffer, recordSchema: ZodType) {
	const validRecords: z.infer<typeof recordSchema>[] = []; // TODO: Can we use generic to type the return type as well?
	const errors: TParseError[] = [];

	const rows = parse(fileContent, { columns: true, skip_empty_lines: true }); // TODO: Use async?
	rows.forEach((row: any, idx: number) => {
		const result = recordSchema.safeParse(row);
		if (result.success) {
			validRecords.push(result.data);
		} else {
			errors.push({ line: idx + 1, error: result.error.issues });
		}
	});

	return { errors, validRecords };
}

export async function readCSV(fileHandle: File, recordSchema: ZodType) {
	const fileContent = await readFileContent(fileHandle); // TODO: Handle error
	const { errors, validRecords } = parseCSV(fileContent, recordSchema);
	return { errors, validRecords };
}
