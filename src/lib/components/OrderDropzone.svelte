<script lang="ts">
	import CSVFileDropzone from './CSVFileDropzone.svelte';
	import { orderCSVs } from '$lib/stores';
	import { orderCsvLineSchema } from '$lib/entities/order/model';
</script>

<CSVFileDropzone
	name="order-csv"
	title="Order CSVs"
	files={orderCSVs}
	recordSchema={orderCsvLineSchema}
/>
