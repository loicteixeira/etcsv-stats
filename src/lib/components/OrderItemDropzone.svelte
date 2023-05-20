<script lang="ts">
	import CSVFileDropzone from './CSVFileDropzone.svelte';
	import { orderItemCSVs } from '$lib/stores';
	import { orderItemCsvLineSchema } from '$lib/entities/orderItem/model';
</script>

<CSVFileDropzone
	name="order-item-csvs"
	files={orderItemCSVs}
	recordSchema={orderItemCsvLineSchema}
/>
