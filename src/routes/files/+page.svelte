<script lang="ts">
	import CSVFileDropzone from '$lib/components/CSVFileDropzone.svelte';
	import { orderCSVs, orderItemCSVs, statementCSVs } from '$lib/stores';
	import { orderCsvLineSchema } from '$lib/entities/order/model';
	import { orderItemCsvLineSchema } from '$lib/entities/orderItem/model';
	import { statementCsvLineSchema } from '$lib/entities/statement/model';
</script>

<div class="mb-6">
	<h2 class="mb-3 h2">Orders CSVs</h2>
	<CSVFileDropzone name="order-csv" files={orderCSVs} recordSchema={orderCsvLineSchema} />
</div>

<hr class="mb-6" />

<div class="mb-6">
	<h2 class="mb-3 h2">Order Items CSVs</h2>
	<CSVFileDropzone
		name="order-item-csvs"
		files={orderItemCSVs}
		recordSchema={orderItemCsvLineSchema}
	/>
</div>

<hr class="mb-6" />

<div class="mb-6">
	<h2 class="mb-3 h2">Statements CSVs</h2>
	<CSVFileDropzone
		name="statement-csv"
		files={statementCSVs}
		recordSchema={statementCsvLineSchema}
	/>
</div>
