<script lang="ts">
	import { Paginator, Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import { currencyFormatter } from '$lib/formatters';
	import { orderItems } from '$lib/stores';
	import { aggregateOrderItemsBySku } from '$lib/entities/orderItem/transforms';
	import type { PaginationSettings } from '@skeletonlabs/skeleton/dist/components/Paginator/types';

	const orderItemsBySku = aggregateOrderItemsBySku($orderItems);
	const orderItemsRows = Object.entries(orderItemsBySku)
		.map(([key, value]) => ({ sku: key, ...value }))
		.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1))
		.map((entry) => ({ ...entry, totalPrice: currencyFormatter(entry.totalPrice) }));

	const tableHead = ['SKU', 'Item Name', 'Total Quantity', 'Total Price'];
	const tableBody = tableMapperValues(orderItemsRows, [
		'sku',
		'itemName',
		'totalQuantity',
		'totalPrice',
	]);

	let page = {
		offset: 0,
		limit: 10,
		size: tableBody.length,
		amounts: [5, 10, 50, 100, tableBody.length]
			.sort((a, b) => a - b)
			.filter((n) => n <= tableBody.length),
	} satisfies PaginationSettings;
	$: tableBodySliced = tableBody.slice(
		page.offset * page.limit,
		page.offset * page.limit + page.limit,
	);
</script>

{#if $orderItems.length}
	<Table source={{ head: tableHead, body: tableBodySliced }} class="my-3" />
	<Paginator bind:settings={page} />
{/if}
