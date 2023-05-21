import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessOrderItemCsvLine } from '$lib/entities/orderItem/transforms';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';
import { fakeOrderCSVs, fakeOrderItemCSVs, fakeStatementCSVs } from './mocks'; // TODO: Remove
import type { TCustomer } from './entities/customer/model';

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
	const customersByKey = $orders.reduce<Record<string, TCustomer>>((accumulator, currentValue) => {
		const key = currentValue.buyerID || currentValue.buyerFullName;
		accumulator[key] ||= {
			key,
			id: currentValue.buyerID,
			fullName: currentValue.buyerFullName,
			orders: [],
			ordersCount: 0,
			ordersTotalValue: 0,
		};
		accumulator[key].orders.push(currentValue);
		accumulator[key].ordersCount += 1;
		accumulator[key].ordersTotalValue += currentValue.computedTotals.orderValue;
		return accumulator;
	}, {});
	return Object.values(customersByKey).map((customer) => ({
		...customer,
		ordersTotalValue: Math.round(customer.ordersTotalValue * 100) / 100,
	}));
});
