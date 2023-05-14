<script lang="ts">
	import CSVFileDropzone from './CSVFileDropzone.svelte';
	import { orders, orderCSVs } from '$lib/stores';
	import { OrderCsvLineSchema } from '$lib/entities/order/model';
</script>

<CSVFileDropzone
	name="order"
	title="Order CSVs"
	files={orderCSVs}
	records={orders}
	recordSchema={OrderCsvLineSchema}
/>
