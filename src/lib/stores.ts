import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessOrderItemCsvLine } from '$lib/entities/orderItem/transforms';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';
import { fakeOrderCSVs, fakeOrderItemCSVs, fakeStatementCSVs } from './mocks'; // TODO: Remove
import { getCustomers } from './entities/customer/transforms';

// Base: CSV files
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>(fakeOrderItemCSVs);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>(fakeOrderCSVs);
export const statementCSVs = writable<TFileInfo<TStatementCsvLine>[]>(fakeStatementCSVs);

// Derived: CSV lines
export const orderItemCSVLines = derived(orderItemCSVs, ($orderItemCSVs) =>
	$orderItemCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessOrderItemCsvLine)),
);

export const statementCSVLines = derived(statementCSVs, ($statementCSVs) =>
	$statementCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessStatementCsvLine)),
);

export const orderCSVLines = derived(orderCSVs, ($orderCSVs) =>
	$orderCSVs.flatMap((fileInfo) => fileInfo.records.map(postProcessOrderCsvLine)),
);

// Derived: Cleaned up data
export const orders = derived(
	[orderCSVLines, orderItemCSVLines, statementCSVLines],
	([$orderCSVLines, $orderItemCSVLines, $statementCSVLines]) => {
		return computeOrderDetails($orderCSVLines, $orderItemCSVLines, $statementCSVLines);
	},
);

export const customers = derived(orders, ($orders) => {
	return getCustomers($orders);
});
