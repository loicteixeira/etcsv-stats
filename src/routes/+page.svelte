<script lang="ts">
	import OrderItemDropzone from '$lib/components/OrderItemDropzone.svelte';
	import OrderDropzone from '$lib/components/OrderDropzone.svelte';
	import OrderItemTable from '$lib/components/OrderItemTable.svelte';
	import OrderAccordion from '$lib/components/OrderAccordion.svelte';
	import StatementDropzone from '$lib/components/StatementDropzone.svelte';
</script>

<div class="container h-full mx-auto p-6">
	<div class="mb-12 flex gap-8">
		<OrderItemDropzone />
		<OrderDropzone />
		<StatementDropzone />
	</div>

	<div class="mb-12">
		<!-- aaa -->
	</div>

	<!-- <OrderItemTable /> -->
	<OrderAccordion />
</div>
