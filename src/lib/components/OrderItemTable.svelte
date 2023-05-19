<script lang="ts">
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import { currencyFormatter } from '$lib/formatters';
	import { orderItems } from '$lib/stores';
	import { aggregateOrderItemsBySku } from '$lib/entities/orderItem/transforms';

	$: orderItemsBySku = aggregateOrderItemsBySku($orderItems);

	$: orderItemsRows = Object.keys(orderItemsBySku)
		.map((key) => ({ sku: key, ...orderItemsBySku[key] }))
		.sort((a, b) => (a.totalPrice < b.totalPrice ? 1 : -1))
		.map((entry) => ({ ...entry, totalPrice: currencyFormatter(entry.totalPrice) }));

	$: orderItemsTableSource = {
		head: ['Item Name', 'Total Quantity', 'Total Price'],
		body: tableMapperValues(orderItemsRows, ['itemName', 'totalQuantity', 'totalPrice']),
	} satisfies TableSource;
</script>

{#if $orderItems.length}
	<Table source={orderItemsTableSource} class="my-3" />
{/if}
