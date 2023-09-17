<script context="module" lang="ts">
	export type TColumn = {
		cellClasses?: string;
		headerClasses?: string;
		id: string;
		sortable?: boolean;
		text: string;
	};
</script>

<script lang="ts">
	import { Paginator } from '@skeletonlabs/skeleton';
	import type { PaginationSettings } from '@skeletonlabs/skeleton/dist/components/Paginator/types';
	import { createEventDispatcher } from 'svelte';

	export let columns: TColumn[];
	export let interactive = false;
	export let pageSize = 10;
	export let rows: any[] = [];
	export let sort = '';

	const dispatch = createEventDispatcher();

	let sortOptions: [string, string][] = [];
	$: sortOptions = columns.filter(({ sortable }) => sortable).map(({ id, text }) => [id, text]);

	let paginationSettings = {
		page: 0,
		limit: pageSize > rows.length ? rows.length : pageSize,
		size: rows.length,
		amounts: [...new Set([5, 10, 50, 100, rows.length, pageSize])]
			.sort((a, b) => a - b)
			.filter((n) => n <= rows.length),
	} satisfies PaginationSettings;

	$: rowsSliced = rows.slice(
		paginationSettings.page * paginationSettings.limit,
		paginationSettings.page * paginationSettings.limit + paginationSettings.limit,
	);
</script>

<div class="flex flex-col md:flex-row items-center justify-between gap-4">
	<div class="self-start"><slot /></div>

	<div class="flex flex-col md:flex-row items-center justify-end gap-4">
		<slot name="extra-actions" />

		{#if sortOptions.length}
			<div class="max-w-max">
				<select bind:value={sort} class="select max-w-max" aria-label="Sort by">
					{#each sortOptions as [value, text] (value)}
						<option value="{value}--asc">↑ {text}</option>
						<option value="{value}--desc">↓ {text}</option>
					{/each}
				</select>
			</div>
		{/if}
		<Paginator bind:settings={paginationSettings} select="select" />
	</div>
</div>

<table class="table table-compact table-hover my-6" class:interactive>
	<thead>
		<tr>
			{#each columns as { id, text, headerClasses } (id)}
				<th class={headerClasses}>
					{text}
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each rowsSliced as row (row)}
			<tr
				on:click={() => {
					if (interactive) dispatch('selected', row);
				}}
			>
				{#each row as cell, idx (idx)}
					<td class={columns[idx].cellClasses}>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	table.interactive tbody tr:hover {
		cursor: pointer;
	}
</style>
