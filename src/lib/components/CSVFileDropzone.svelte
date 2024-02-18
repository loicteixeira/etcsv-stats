<script lang="ts">
	import type { TFileInfo } from '$lib/entities/file/model';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import type { Writable } from 'svelte/store';
	import type { ZodType } from 'zod';
	import Icon from '@iconify/svelte';
	import fileDescription from '@iconify/icons-tabler/file-description';
	import trashX from '@iconify/icons-tabler/trash-x';
	import { readCSVFile } from '$lib/files';
	import { nGetText } from '$lib/translations';

	export let name: string;
	export let files: Writable<TFileInfo<any>[]>;
	export let recordSchema: ZodType;

	async function onChangeHandler(e: Event) {
		const target = e.target as HTMLInputElement;
		if (!target || !target.files) return;

		Array.from(target.files).forEach(async (fileHandle) => {
			const { errors, records } = await readCSVFile(fileHandle, recordSchema);
			const fileInfo = {
				fileHandle: fileHandle,
				filename: fileHandle.name, // TODO: Bail or update if duplicated name?
				records: records,
				errors: errors,
			};
			$files = [...$files, fileInfo].sort((a, b) => a.filename.localeCompare(b.filename));
		});
	}

	async function onRemoveFile(filename: string) {
		$files = $files.filter((file) => file.filename != filename);
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
					<button class="delete-action" title="Remove file" on:click={() => onRemoveFile(filename)}>
						<Icon icon={trashX} />
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.delete-action {
		padding: 0.25rem;
	}

	.delete-action:hover {
		color: black;
		background-color: white;
		border-radius: var(--theme-rounded-base);
	}
</style>
