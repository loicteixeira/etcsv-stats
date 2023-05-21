<script lang="ts">
	import { currencyFormatter, numberFormatter } from '$lib/formatters';
	import { customers } from '$lib/stores';

	const totalGrossValue = $customers.reduce(
		(acc, { ordersTotalValue }) => (acc += ordersTotalValue),
		0,
	);
	const averageGrossValue = totalGrossValue / $customers.length;

	const totalOrdersCount = $customers.reduce((acc, { ordersCount }) => (acc += ordersCount), 0);
	const averageOrdersCount = totalOrdersCount / $customers.length;
</script>

<div class="flex gap-6">
	<div class="card w-[14em]">
		<header class="card-header text-center min-h-[4em]">Number of<br />Customers</header>
		<section class="p-4 text-center text-4xl text-primary-500">{$customers.length}</section>
	</div>

	<div class="card w-[14em]">
		<header class="card-header text-center min-h-[4em]">
			Average number of Orders<br />per Customer
		</header>
		<section class="p-4 text-center text-4xl text-primary-500">
			{numberFormatter(averageOrdersCount)}
		</section>
	</div>

	<div class="card w-[14em]">
		<header class="card-header text-center min-h-[4em]">
			Average Gross Value<br />per Customer
		</header>
		<section class="p-4 text-center text-4xl text-primary-500">
			{currencyFormatter(averageGrossValue)}
		</section>
	</div>
</div>
