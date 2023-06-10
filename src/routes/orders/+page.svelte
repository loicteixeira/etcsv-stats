<script lang="ts">
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import OrderDetails from '$lib/components/OrderDetails.svelte';
	import OrdersTable from '$lib/components/OrdersTable.svelte';
	import { orders } from '$lib/stores';
	import { dev } from '$app/environment';

	let collapseOrderLines = false;
	let collapseFeesLines = true;

	function onSelected(event: CustomEvent) {
		const selectedOrderID = event.detail[0];
		const selectedOrder = $orders.find(({ id }) => id === selectedOrderID);
		if (!selectedOrder) return;

		drawerStore.open({ id: selectedOrderID, meta: { order: selectedOrder } });
	}
</script>

{#if $orders.length}
	<h1 class="h1 mb-6">Orders</h1>
	<div class="mb-6">
		<h2 class="mb-3 h2">Summary</h2>
		...
		<!-- Orders Count ; Orders Gross ; Orders Net -->
	</div>
	<div class="mb-6">
		<h2 class="mb-3 h2">Details</h2>
		<OrdersTable on:selected={onSelected} interactive={true} />
	</div>

	<Drawer position="right" width="w-[75%]">
		<div class="h-full p-6 bg-surface-600">
			<button
				class="mb-12 anchor"
				on:click={() => {
					drawerStore.close();
				}}
			>
				Close
			</button>

			{#if dev}
				<button
					class="mb-12 ml-4 anchor"
					on:click={() => {
						console.group(`Order ID: ${$drawerStore.meta.order.id}`);
						console.table($drawerStore.meta.order.lines);
						console.table($drawerStore.meta.order.computedTotals);
						console.log($drawerStore.meta.order);
						console.groupEnd();
					}}
				>
					Debug
				</button>
			{/if}

			<h3 class="h1 mb-6">Order #{$drawerStore.id}</h3>

			<div class="flex justify-end items-center gap-12 mb-6 px-4">
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" bind:checked={collapseOrderLines} />
					<p>Collapse Order Lines</p>
				</label>
				<label class="flex items-center space-x-2">
					<input class="checkbox" type="checkbox" bind:checked={collapseFeesLines} />
					<p>Collapse Fees Lines</p>
				</label>
			</div>

			<OrderDetails order={$drawerStore.meta.order} {collapseOrderLines} {collapseFeesLines} />
		</div>
	</Drawer>
{:else}
	<div class="grid place-items-center mt-12">
		<p class="h3">There does not seem to be any orders information.</p>
		<p class="h3">Did you <a href="/files" class="anchor">upload an orders CSV</a>?</p>
	</div>
{/if}
