<script lang="ts">
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import type { ZodType } from 'zod';
	import Icon from '@iconify/svelte';
	import fileDescription from '@iconify/icons-tabler/file-description';
	import trashX from '@iconify/icons-tabler/trash-x';
	import { readCSVFile } from '$lib/files';
	import { nGetText } from '$lib/translations';
	import type { FileStoreType } from '$lib/stores';

	export let name: string;
	export let files: FileStoreType;
	export let recordSchema: ZodType;

	async function onChangeHandler(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target || !target.files) return;

		Array.from(target.files).forEach(async (fileHandle) => {
			const { errors, records } = await readCSVFile(fileHandle, recordSchema);
			files.addFile({
				fileHandle: fileHandle,
				filename: fileHandle.name,
				records: records,
				errors: errors,
			});
		});
	}

	async function onRemoveFile(filename: string) {
		files.removeFile(filename);
	}
</script>

<div class="flex flex-col sm:flex-row gap-6">
	<FileDropzone
		{name}
		accept=".csv"
		multiple
		on:change={onChangeHandler}
		class="my-3 grow-0 max-w-xs"
		slotLead="mb-4 flex justify-center"
	>
		<svelte:fragment slot="lead">
			<Icon icon={fileDescription} style="font-size: 36px;" />
		</svelte:fragment>
		<svelte:fragment slot="message"><b>Upload files</b> or drag and drop</svelte:fragment>
		<svelte:fragment slot="meta">CSV allowed</svelte:fragment>
	</FileDropzone>

	{#if $files.length}
		<ul class="list my-3">
			{#each $files as { filename, records, errors } (filename)}
				<li>
					<Icon icon={fileDescription} />
					<span>{filename}</span>
					{#if records.length}
						<span class="badge variant-filled-success">
							{records.length}
							{nGetText(records.length, 'line', 'lines')}
						</span>
					{/if}
					{#if errors.length}
						<span class="badge variant-filled-warning">
							{errors.length}
							{nGetText(errors.length, 'error', 'errors')}
						</span>
					{/if}
					<button
						class="group flex flex-nowrap items-center gap-1 rounded-xl px-2 hover:text-error-900 hover:bg-error-100"
						on:click={() => onRemoveFile(filename)}
					>
						<Icon icon={trashX} />
						<span class="text-base text-elipsis overflow-hidden sr-only group-hover:not-sr-only"
							>Remove&nbsp;file</span
						>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
