<script lang="ts">
	import { Paginator, Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import { currencyFormatter } from '$lib/formatters';
	import { customers } from '$lib/stores';
	import type { PaginationSettings } from '@skeletonlabs/skeleton/dist/components/Paginator/types';

	const sortedCustomers = $customers
		.map((customer) => ({
			...customer,
			ordersCount: customer.orders.length,
			ordersTotalValue:
				Math.round(
					customer.orders.reduce(
						(acc, { computedTotals: { orderValue } }) => (acc += orderValue),
						0,
					) * 100,
				) / 100,
		}))
		.sort((a, b) => b.ordersTotalValue - a.ordersTotalValue)
		.map((entry) => ({ ...entry, ordersTotalValue: currencyFormatter(entry.ordersTotalValue) }));

	const tableHead = ['Name', 'Orders Count', 'Orders Total Value'];
	const tableBody = tableMapperValues(sortedCustomers, [
		'fullName',
		'ordersCount',
		'ordersTotalValue',
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

<Table source={{ head: tableHead, body: tableBodySliced }} class="my-3" />
<Paginator bind:settings={page} />
