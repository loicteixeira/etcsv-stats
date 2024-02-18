import type { Writable } from 'svelte/store';
import type { ZodType } from 'zod';

import type { TFileInfo } from '$lib/entities/file/model';
import { orderCsvLineSchema } from '$lib/entities/order/model';
import { orderItemCsvLineSchema } from '$lib/entities/orderItem/model';
import { statementCsvLineSchema } from '$lib/entities/statement/model';
import { readCSVContent } from '$lib/files';
import { orderCSVs, orderItemCSVs, statementCSVs } from '$lib/stores';

import demoOrdersCSV from './demo-orders.csv?raw';
import demoOrderItemsCSV from './demo-order-items.csv?raw';
import demoStatementsCSV from './demo-statements.csv?raw';

export function loadDemoData() {
	loadFile({
		filename: 'DemoOrders.csv',
		data: demoOrdersCSV,
		validationSchema: orderCsvLineSchema,
		store: orderCSVs,
	});
	loadFile({
		filename: 'DemoOrderItems.csv',
		data: demoOrderItemsCSV,
		validationSchema: orderItemCsvLineSchema,
		store: orderItemCSVs,
	});
	loadFile({
		filename: 'DemoStatements.csv',
		data: demoStatementsCSV,
		validationSchema: statementCsvLineSchema,
		store: statementCSVs,
	});
}

async function loadFile(args: {
	filename: string;
	data: string;
	validationSchema: ZodType;
	store: Writable<TFileInfo<any>[]>;
}) {
	const { filename, data, validationSchema, store } = args;
	const { errors, records } = await readCSVContent(data, validationSchema);
	const ordersDemoFileHandle = {
		fileHandle: null,
		filename: filename,
		records: records,
		errors: errors,
	};
	store.update((value) =>
		[...value, ordersDemoFileHandle].sort((a, b) => a.filename.localeCompare(b.filename)),
	);
}
