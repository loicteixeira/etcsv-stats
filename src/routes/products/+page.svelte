<script lang="ts">
	import ProductTable from '$lib/components/ProductTable.svelte';
	import { orderItems } from '$lib/stores';
</script>

{#if $orderItems.length}
	<h1 class="h1 mb-12">Products</h1>
	<div class="mb-12">
		<h2 class="mb-3 h2">Summary</h2>
		...
	</div>
	<div class="mb-12">
		<ProductTable>
			<h2 class="mb-3 h2">Details</h2>
		</ProductTable>
	</div>
{:else}
	<div class="grid place-items-center mt-12">
		<p class="h3">There does not seem to be any order items information.</p>
		<p class="h3">Did you <a href="/files" class="anchor">upload an order items CSV</a>?</p>
	</div>
{/if}
