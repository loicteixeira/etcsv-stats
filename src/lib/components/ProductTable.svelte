<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import Table from '$lib/components/Table.svelte';
	import {
		aggregateOrderItemsBySku,
		aggregateOrderItemBySkuAndVariant,
	} from '$lib/entities/orderItem/transforms';
	import { currencyFormatter } from '$lib/formatters';
	import { orderItems } from '$lib/stores';

	let rows: any[][] = [];
	let sort = 'grossAfterDiscount--desc';
	let grouping: 'sku' | 'variant' = 'sku';
	let columns = [
		{
			id: 'key', // Will stay the same, regardless of grouping
			text: '', // Will be updated depending on grouping
			sortable: true,
		},
		{
			id: 'quantity',
			text: 'Quantity',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'grossBeforeDiscount',
			text: 'Gross Pre Discounts',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'discount',
			text: 'Discounts',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'grossAfterDiscount',
			text: 'Gross After Discounts',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
	];

	$: columns[0].text = grouping === 'sku' ? 'SKU' : 'SKU & Variant';

	$: {
		const [column, direction] = sort.split('--');
		const directionModifier = direction == 'asc' ? 1 : -1;
		const groupingFunction =
			grouping === 'sku' ? aggregateOrderItemsBySku : aggregateOrderItemBySkuAndVariant;
		const groupedOrderItems = groupingFunction($orderItems);
		rows = Object.entries(groupedOrderItems)
			.map(([key, value]) => ({ key: key, ...value }))
			.sort((a, b) => {
				let comp;
				switch (column) {
					case 'key':
						comp = a.key.localeCompare(b.key);
						break;
					case 'name': // Name with tie on key
						comp = a.itemName.localeCompare(b.itemName) || a.key.localeCompare(b.key);
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
					totalGrossAfterDiscounts,
					totalGrossBeforeDiscounts,
					totalQuantity,
					variations,
				}) => {
					const joinedVariations = Object.entries(variations)
						.map(([key, value]) => `${key}: ${value}`)
						.sort();
					const title = { description: sku, extraDescription: itemName, badges: joinedVariations };
					return [
						title,
						totalQuantity,
						currencyFormatter(totalGrossBeforeDiscounts),
						currencyFormatter(totalDiscounts),
						currencyFormatter(totalGrossAfterDiscounts),
					];
				},
			);
	}
</script>

<Table {columns} {rows} bind:sort>
	<slot />
	<svelte:fragment slot="extra-actions">
		<slot name="extra-actions" />
		<RadioGroup>
			<RadioItem bind:group={grouping} name="grouping" value="sku">By SKU</RadioItem>
			<RadioItem bind:group={grouping} name="grouping" value="variant">By SKU & Variant</RadioItem>
		</RadioGroup>
	</svelte:fragment>
</Table>
