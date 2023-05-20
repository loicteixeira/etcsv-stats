<script lang="ts">
	import OrderItemDropzone from '$lib/components/OrderItemDropzone.svelte';
	import OrderDropzone from '$lib/components/OrderDropzone.svelte';
	import StatementDropzone from '$lib/components/StatementDropzone.svelte';
</script>

<div class="mb-6">
	<h2 class="mb-3 h2">Orders CSVs</h2>
	<p>Those files contain...</p>
	<p>You can find them...</p>
	<OrderDropzone />
</div>
<hr />
<div class="my-6">
	<h2 class="mb-3 h2">Order Items CSVs</h2>
	<OrderItemDropzone />
</div>
<hr />
<div class="my-6">
	<h2 class="mb-3 h2">Statements CSVs</h2>
	<StatementDropzone />
</div>
