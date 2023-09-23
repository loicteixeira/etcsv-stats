<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { currencyFormatter } from '$lib/formatters';
	import { customers } from '$lib/stores';

	let rows: any[][] = [];
	let sort = 'gross--desc';

	const columns = [
		{
			id: 'name',
			text: 'Last Name',
			sortable: true,
		},
		{
			id: 'count',
			text: 'Orders Count',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'gross',
			text: 'Orders Gross Value',
			headerClasses: 'text-right lg:text-left lg:table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
	];

	$: {
		const [column, direction] = sort.split('--');
		const directionModifier = direction == 'asc' ? 1 : -1;
		rows = $customers
			.sort((a, b) => {
				let comp;
				switch (column) {
					case 'name':
						comp = a.lastName.localeCompare(b.lastName);
						break;
					case 'count': // Orders count with tie on orders total value
						comp = a.ordersCount - b.ordersCount || a.ordersTotalValue - b.ordersTotalValue;
						break;
					case 'gross': // Orders total value with tie on orders count
						comp = a.ordersTotalValue - b.ordersTotalValue || a.ordersCount - b.ordersCount;
						break;
					default:
						comp = 0;
				}
				return comp * directionModifier;
			})
			.map(({ fullName, ordersCount, ordersTotalValue }) => [
				fullName,
				ordersCount,
				currencyFormatter(ordersTotalValue),
			]);
	}
</script>

<Table {columns} {rows} bind:sort>
	<slot />
	<slot name="extra-actions" slot="extra-actions" />
</Table>
