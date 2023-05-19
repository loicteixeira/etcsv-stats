import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessOrderItemCsvLine } from '$lib/entities/orderItem/transforms';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';

// CSV stores
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>([]);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>([]);
export const statementCSVs = writable<TFileInfo<TStatementCsvLine>[]>([]);

// Cleaned up data
export const orderItems = derived(orderItemCSVs, ($orderItemCSVs) =>
	$orderItemCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessOrderItemCsvLine)),
);

export const statements = derived(statementCSVs, ($statementCSVs) =>
	$statementCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessStatementCsvLine)),
);

export const orders = derived(
	[orderCSVs, orderItems, statements],
	([$orderCSVs, $orderItems, $statements]) => {
		const orders = $orderCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessOrderCsvLine));
		return computeOrderDetails(orders, $orderItems, $statements);
	},
);
