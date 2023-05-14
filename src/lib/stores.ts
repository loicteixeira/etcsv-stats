import { derived, writable } from 'svelte/store';
import type { TOrderItemCsvLine } from '$lib/entities/orderItem/model';
import type { TOrderCsvLine } from '$lib/entities/order/model';
import type { TFileInfo } from '$lib/entities/file/model';

// CSV stores
export const orderItemCSVs = writable<TFileInfo<TOrderItemCsvLine>[]>([]);
export const orderCSVs = writable<TFileInfo<TOrderCsvLine>[]>([]);

// Combined data
export const orderItems = derived(orderItemCSVs, ($orderItemCSVs) =>
	$orderItemCSVs.flatMap((fileInfo) => fileInfo.records),
);

export const orders = derived([orderCSVs, orderItems], ([$orderCSVs, $orderItems]) => {
	const orderItemsByOrderId = $orderItems.reduce<Record<string, TOrderItemCsvLine[]>>(
		(accumulator, currentValue) => {
			accumulator[currentValue.orderId] ||= [];
			accumulator[currentValue.orderId].push(currentValue);
			return accumulator;
		},
		{},
	);
	return $orderCSVs
		.flatMap((fileInfo) => fileInfo.records)
		.map((order) => {
			const orderItems = orderItemsByOrderId[order.id] || [];

			return { ...order, items: orderItems };
		})
		.sort((a, b) => ([2631904461, 2524411094, 2609238799, 2356475894].includes(a.id) ? -1 : 1)); // TODO: Remove after testing
});
