<script lang="ts">
	import CSVFileDropzone from './CSVFileDropzone.svelte';
	import { statementCSVs } from '$lib/stores';
	import { statementCsvLineSchema } from '$lib/entities/statement/model';
</script>

<CSVFileDropzone
	name="statement-csv"
	title="Statements CSVs"
	files={statementCSVs}
	recordSchema={statementCsvLineSchema}
/>
