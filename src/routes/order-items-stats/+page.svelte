<script lang="ts">
	import OrderItemBySku from '$lib/components/OrderItemBySku.svelte';
	import { orderItems } from '$lib/stores';
</script>

{#if $orderItems.length}
	<div class="mb-6">
		<h2 class="mb-3 h2">Order Items by SKU</h2>
		<OrderItemBySku />
	</div>
{:else}
	<div class="grid place-items-center mt-12">
		<p class="h3">There does not seem to be any order items information.</p>
		<p class="h3">Did you <a href="/files" class="anchor">upload an order items CSV</a>?</p>
	</div>
{/if}
