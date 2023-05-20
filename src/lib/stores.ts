import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrder, TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessOrderItemCsvLine } from '$lib/entities/orderItem/transforms';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';
import { fakeOrderCSVs, fakeOrderItemCSVs, fakeStatementCSVs } from './mocks'; // TODO: Remove

// CSV stores
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>(fakeOrderItemCSVs);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>(fakeOrderCSVs);
export const statementCSVs = writable<TFileInfo<TStatementCsvLine>[]>(fakeStatementCSVs);

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

export const customers = derived(orders, ($orders) => {
	type TCustomer = {
		key: string;
		id: string;
		fullName: string;
		orders: TOrder[];
	};
	const customersByKey = $orders.reduce<Record<string, TCustomer>>((accumulator, currentValue) => {
		const key = currentValue.buyerID || currentValue.buyerFullName;
		accumulator[key] ||= {
			key,
			id: currentValue.buyerID,
			fullName: currentValue.buyerFullName,
			orders: [],
		};
		accumulator[key].orders.push(currentValue);
		return accumulator;
	}, {});
	return Object.values(customersByKey);
});
