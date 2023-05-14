<script lang="ts">
	import type { TFileInfo, TParseError } from '$lib/entities/file/model';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import type { ZodType } from 'zod';
	import Icon from '@iconify/svelte';
	import fileDescription from '@iconify/icons-tabler/file-description';
	import { readCSV } from '$lib/files';

	export let name: string;
	export let title: string = 'Dropzone';
	export let files: Writable<TFileInfo<any>[]>;
	export let recordSchema: ZodType;

	async function onChangeHandler(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target || !target.files) return;

		Array.from(target.files).forEach(async (fileHandle) => {
			const { errors, records } = await readCSV(fileHandle, recordSchema);
			const fileInfo = {
				fileHandle: fileHandle,
				filename: fileHandle.name, // TODO: Bail or update if duplicated name?
				records: records,
				errors: errors,
			};
			$files = [...$files, fileInfo].sort((a, b) => a.filename.localeCompare(b.filename));
		});
	}
</script>

<div class="grow">
	<p class="mb-3 h3">{title}</p>

	<FileDropzone
		{name}
		accept=".csv"
		multiple
		on:change={onChangeHandler}
		class="my-3"
		slotLead="mb-4 flex justify-center"
	>
		<svelte:fragment slot="lead">
			<Icon icon={fileDescription} style="font-size: 36px;" />
		</svelte:fragment>
		<svelte:fragment slot="message"><b>Upload files</b> or drag and drop</svelte:fragment>
		<svelte:fragment slot="meta">CSV allowed</svelte:fragment>
	</FileDropzone>

	{#if $files}
		<ul class="list my-3">
			{#each $files as { filename, records, errors } (filename)}
				<li>
					<Icon icon={fileDescription} />
					<span>{filename}</span>
					{#if records}
						<span class="badge variant-filled-success">{records.length} lines(s)</span>
					{/if}
					{#if errors.length}
						<span class="badge variant-filled-warning">{errors.length} error(s)</span>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>
