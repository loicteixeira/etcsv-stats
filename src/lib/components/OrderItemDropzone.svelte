<script lang="ts">
	import CSVFileDropzone from './CSVFileDropzone.svelte';
	import { orderItems, orderItemCSVs } from '$lib/stores';
	import { orderItemCsvLine } from '$lib/entities/orderItem/model';
</script>

<CSVFileDropzone
	name="order-items"
	title="Order Items CSVs"
	files={orderItemCSVs}
	records={orderItems}
	recordSchema={orderItemCsvLine}
/>
