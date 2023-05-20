<script lang="ts">
	import { Accordion } from '@skeletonlabs/skeleton';
	import OrderDetails from '$lib/components/OrderDetails.svelte';
	import { orders } from '$lib/stores';

	let collapseOrderLines = false;
	let collapseFeesLines = true;
</script>

{#if $orders.length}
	<div class="flex justify-end items-center gap-12 mb-12 px-4">
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={collapseOrderLines} />
			<p>Collapse Order Lines</p>
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={collapseFeesLines} />
			<p>Collapse Fees Lines</p>
		</label>
	</div>

	<Accordion>
		{#each $orders as order, index (order.id)}
			<OrderDetails {order} {collapseOrderLines} {collapseFeesLines} initialOpen={index === 0} />
		{/each}
	</Accordion>
{:else}
	<div class="grid place-items-center mt-12">
		<p class="h3">There does not seem to be any orders information.</p>
		<p class="h3">Did you <a href="/files" class="anchor">upload an orders CSV</a>?</p>
	</div>
{/if}
