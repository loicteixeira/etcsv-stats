<script lang="ts">
	import Table from '$lib/components/Table.svelte';
	import { currencyFormatter } from '$lib/formatters';
	import { orders } from '$lib/stores';

	export let interactive = false;

	let rows: any[][] = [];
	let sort = 'net--desc';

	const columns = [
		{
			id: 'id',
			text: 'Order ID',
			sortable: true,
		},
		{
			id: 'gross',
			text: 'Total Gross',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'feesAndVAT',
			text: 'Fees & VAT',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
		{
			id: 'net',
			text: 'Total Net',
			headerClasses: 'table-cell-fit',
			cellClasses: 'text-right',
			sortable: true,
		},
	];

	$: {
		const [column, direction] = sort.split('--');
		const directionModifier = direction == 'asc' ? 1 : -1;
		rows = $orders
			.sort((a, b) => {
				let comp;
				switch (column) {
					case 'id':
						comp = a.id - b.id;
						break;
					case 'gross':
						comp = a.computedTotals.orderTotal - b.computedTotals.orderTotal;
						break;
					case 'feesAndVAT':
						comp = a.computedTotals.feesAndVAT - b.computedTotals.feesAndVAT;
						comp = -comp; // Fees are negative, but we display their absolute value.
						break;
					case 'net':
						comp = a.computedTotals.orderNet - b.computedTotals.orderNet;
						break;
					default:
						comp = 0;
				}
				return comp * directionModifier;
			})
			.map(({ id, computedTotals: { feesAndVAT, orderNet, orderTotal } }) => [
				id,
				currencyFormatter(orderTotal),
				currencyFormatter(Math.abs(feesAndVAT)),
				currencyFormatter(orderNet),
			]);
	}
</script>

<Table {columns} {rows} bind:sort on:selected {interactive} />
