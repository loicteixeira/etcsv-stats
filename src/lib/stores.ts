import { derived, writable } from 'svelte/store';
import type { TOrderItem, TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrder, TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';
import { getCustomers } from './entities/customer/transforms';

// Base: CSV files
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>([]);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>([]);
export const statementCSVs = writable<TFileInfo<TStatementCsvLine>[]>([]);

// Derived: CSV lines
export const orderItemCSVLines = derived(orderItemCSVs, ($orderItemCSVs) =>
	$orderItemCSVs.flatMap((fileInfo) => fileInfo.records),
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

export const orderItems = derived([orderItemCSVLines, orders], ([$orderItemCSVLines, $orders]) => {
	const ordersById = Object.fromEntries($orders.map((order) => [order.id, order]));

	return $orderItemCSVLines.map((orderItem) => {
		const order = ordersById[orderItem.orderID] as TOrder | undefined;
		const orderTotals = order?.computedTotals;

		const { itemName, listingID, orderID, sku, transactionID, variations, variationsKey } =
			orderItem;

		const { quantity, unitPrice } = orderItem;
		const totalGrossBeforeDiscounts = orderItem.quantity * orderItem.unitPrice; // Composite list price

		let totalDiscounts: number | undefined;
		let totalGrossAfterDiscounts: number | undefined;
		let totalNet: number | undefined;
		if (orderTotals) {
			const percentOfOrder = orderItem.totalPrice / orderTotals.item;

			// Composite discounts applied
			totalDiscounts = Math.abs(
				Math.round((orderTotals.itemsDiscount * percentOfOrder * 100) / 100),
			);
			totalGrossAfterDiscounts = totalGrossBeforeDiscounts - totalDiscounts;

			// Composite etsy fees and vat
			// -> Maybe items fees & orders fees separated?
			// TODO

			// Composite net
			// totalNet = Math.round((orderTotals.orderNet * percentOfOrder * 100) / 100);
			// TODO
		}

		return {
			itemName,
			listingID,
			orderID,
			sku,
			transactionID,
			variations,
			variationsKey,
			computedTotals: {
				unitPrice,
				quantity,
				totalDiscounts,
				totalGrossAfterDiscounts,
				totalGrossBeforeDiscounts,
				totalNet,
			},
		} satisfies TOrderItem;
	});
});
