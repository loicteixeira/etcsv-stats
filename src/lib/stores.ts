import { derived, writable } from 'svelte/store';
import type { TOrderItem, TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrder, TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';
import type { TStatementCsvLine } from '$lib/entities/statement/model';
import { postProcessStatementCsvLine } from './entities/statement/transforms';
import { computeOrderDetails, postProcessOrderCsvLine } from './entities/order/transforms';
import { getCustomers } from './entities/customer/transforms';

function fileStore<T>() {
	const store = writable<TFileInfo<T>[]>([]);

	return {
		...store,
		addFile: (newFileInfo: TFileInfo<T>) =>
			store.update((value) => {
				const existingFilenames = value.map((fileInfo) => fileInfo.filename);
				if (existingFilenames.includes(newFileInfo.filename)) {
					const conflictingFilenames = existingFilenames.filter((filename) =>
						filename.startsWith(newFileInfo.filename),
					);
					const counter = conflictingFilenames.length + 1;
					newFileInfo.filename = `${newFileInfo.filename}_${counter}`;
				}
				return [...value, newFileInfo].sort((a, b) => a.filename.localeCompare(b.filename));
			}),
		removeFile: (filename: string) =>
			store.update((value) => value.filter((file) => file.filename != filename)),
	};
}
export type FileStoreType = ReturnType<typeof fileStore<any>>;

// Base: CSV files
export const orderItemCSVs = fileStore<TOrderItemCsvLine>();
export const orderCSVs = fileStore<TOrderCsvLine>();
export const statementCSVs = fileStore<TStatementCsvLine>();

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

		const { itemName, listingID, orderID, sku, variations, variationsKey } = orderItem;

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
