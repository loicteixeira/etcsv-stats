<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { aggregateOrderItemsBySku } from '$lib/entities/orderItem/transforms';
	import { currencyFormatter } from '$lib/formatters';
	import { orderItems } from '$lib/stores';

	let rows: any[][] = [];
	let sort = 'gross--desc';

	const columns = [
		{
			id: 'sku',
			text: 'SKU',
			sortable: true,
		},
		{
			id: 'name',
			text: 'Product Name',
			sortable: true,
		},
		{
			id: 'quantity',
			text: 'Total Quantity',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'gross',
			text: 'Total Gross Value',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
	];

	$: {
		const [column, direction] = sort.split('--');
		const directionModifier = direction == 'asc' ? 1 : -1;
		const orderItemsBySku = aggregateOrderItemsBySku($orderItems);
		rows = Object.entries(orderItemsBySku)
			.map(([key, value]) => ({ sku: key, ...value }))
			.sort((a, b) => {
				let comp;
				switch (column) {
					case 'sku':
						comp = a.sku.localeCompare(b.sku);
						break;
					case 'name': // Name with tie on SKU
						comp = a.itemName.localeCompare(b.itemName) || a.sku.localeCompare(b.sku);
						break;
					case 'quantity': // Quantity with tie on total gross value
						comp = a.totalQuantity - b.totalQuantity || a.totalPrice - b.totalPrice;
						break;
					case 'gross': // Total gross value with tie on quantity
						comp = a.totalPrice - b.totalPrice || a.totalQuantity - b.totalQuantity;
						break;
					default:
						comp = 0;
				}
				return comp * directionModifier;
			})
			.map(({ sku, itemName, totalQuantity, totalPrice }) => [
				sku,
				itemName,
				totalQuantity,
				currencyFormatter(totalPrice),
			]);
	}
</script>

<Table {columns} {rows} bind:sort />
