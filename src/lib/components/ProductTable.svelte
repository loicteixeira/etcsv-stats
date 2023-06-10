<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { aggregateOrderItemsBySku } from '$lib/entities/orderItem/transforms';
	import { currencyFormatter } from '$lib/formatters';
	import { orderItems } from '$lib/stores';

	let rows: any[][] = [];
	let sort = 'grossAfterDiscount--desc';

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
			text: 'Quantity',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'grossBeforeDiscount',
			text: 'Gross Pre Discounts',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'discount',
			text: 'Discounts',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'grossAfterDiscount',
			text: 'Gross Aft Discounts',
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
						comp =
							a.totalQuantity - b.totalQuantity ||
							a.totalGrossBeforeDiscounts - b.totalGrossBeforeDiscounts;
						break;
					case 'grossBeforeDiscount': // Total gross before discounts value with tie on quantity
						comp =
							a.totalGrossBeforeDiscounts - b.totalGrossBeforeDiscounts ||
							a.totalQuantity - b.totalQuantity;
						break;
					case 'grossAfterDiscount': // Total gross after discounts value with tie on quantity
						comp =
							a.totalGrossAfterDiscounts - b.totalGrossAfterDiscounts ||
							a.totalQuantity - b.totalQuantity;
						break;
					case 'discounts': // Total discounts value with tie on quantity
						comp = a.totalDiscounts - b.totalDiscounts || a.totalQuantity - b.totalQuantity;
						break;
					default:
						comp = 0;
				}
				return comp * directionModifier;
			})
			.map(
				({
					itemName,
					sku,
					totalDiscounts,
					totalGrossBeforeDiscounts,
					totalGrossAfterDiscounts,
					totalQuantity,
				}) => [
					sku,
					itemName,
					totalQuantity,
					currencyFormatter(totalGrossBeforeDiscounts),
					currencyFormatter(totalDiscounts),
					currencyFormatter(totalGrossAfterDiscounts),
				],
			);
	}
</script>

<Table {columns} {rows} bind:sort />
