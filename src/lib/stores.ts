import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { getOrderItemsByOrderId } from '$lib/entities/orderItem/transforms';
import { getStatementsByOrderId } from './entities/statement/transforms';

// CSV stores
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>([]);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>([]);
export const statementCSVs = writable<TFileInfo<TStatementCsvLine>[]>([]);

// Combined data
export const orderItems = derived(orderItemCSVs, ($orderItemCSVs) =>
	$orderItemCSVs.flatMap((fileInfo) => fileInfo.records),
);

export const statements = derived(statementCSVs, ($statementCSVs) =>
	$statementCSVs.flatMap((fileInfo) => fileInfo.records),
);

export const orders = derived(
	[orderCSVs, orderItems, statements],
	([$orderCSVs, $orderItems, $statements]) => {
		const orderItemsByOrderId = getOrderItemsByOrderId($orderItems);
		const statementByOrderId = getStatementsByOrderId($statements);

		const results = $orderCSVs
			.flatMap((fileInfo) => fileInfo.records)
			.map((order) => {
				const orderItems = orderItemsByOrderId[order.id] ?? [];
				const statementLines = statementByOrderId[order.id] ?? [];

				const orderItemsTotal = orderItems.reduce(
					(accumulator, currentValue) => (accumulator += currentValue.totalPrice),
					0,
				);
				const statementLinesTotal = statementLines.reduce(
					(accumulator, currentValue) => (accumulator += currentValue.amount),
					0,
				);
				const total =
					orderItemsTotal -
					order.itemsDiscount +
					order.shipping -
					order.shippingDiscount +
					statementLinesTotal;

				return {
					...order,
					items: orderItems,
					statements: statementLines,
					computedNetAmount: total,
				};
			})
			.sort((a, b) => ([2631904461, 2524411094, 2609238799, 2356475894].includes(a.id) ? -1 : 1)); // TODO: Remove after testing

		return results;
	},
);
