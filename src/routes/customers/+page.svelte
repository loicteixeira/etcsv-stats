<script lang="ts">
	import CustomersStatsSummary from '$lib/components/CustomersStatsSummary.svelte';
	import CustomersTable from '$lib/components/CustomersTable.svelte';
	import { customers } from '$lib/stores';
</script>

{#if $customers.length}
	<h1 class="h1 mb-12">Customers</h1>
	<div class="mb-12">
		<h2 class="mb-3 h2">Summary</h2>
		<CustomersStatsSummary />
	</div>
	<div class="mb-12">
		<CustomersTable>
			<h2 class="mb-3 h2">Top Repeating</h2>
		</CustomersTable>
	</div>
{:else}
	<div class="grid place-items-center mt-12">
		<p class="h3">There does not seem to be any customers information.</p>
		<p class="h3">
			Did you <a href="/files" class="anchor">upload an order CSV</a> with customers information?
		</p>
	</div>
{/if}
