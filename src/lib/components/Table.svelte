<script lang="ts">
	import { Paginator } from '@skeletonlabs/skeleton';
	import type { PaginationSettings } from '@skeletonlabs/skeleton/dist/components/Paginator/types';
	import { createEventDispatcher } from 'svelte';

	export let columns: {
		id: string;
		text: string;
		headerClasses?: string;
		cellClasses?: string;
		sortable?: boolean;
	}[];
	export let rows: any[] = [];
	export let pageSize = 10;
	export let sort = '';
	export let interactive = false;

	const dispatch = createEventDispatcher();

	const sortOptions = columns.filter(({ sortable }) => sortable).map(({ id, text }) => [id, text]);
	if (!sort && sortOptions.length) sort = `${sortOptions[0][0]}--asc`;

	let page = {
		offset: 0,
		limit: pageSize > rows.length ? rows.length : pageSize,
		size: rows.length,
		amounts: [5, 10, 50, 100, rows.length, pageSize]
			.sort((a, b) => a - b)
			.filter((n) => n <= rows.length),
	} satisfies PaginationSettings;

	$: rowsSliced = rows.slice(page.offset * page.limit, page.offset * page.limit + page.limit);
</script>

<div class="flex flex-col md:flex-row items-center justify-end gap-4">
	{#if sortOptions.length}
		<div class="max-w-max">
			<select bind:value={sort} class="select max-w-max ml-2" aria-label="Sort by">
				{#each sortOptions as [value, text] (value)}
					<option value="{value}--asc">↑ {text}</option>
					<option value="{value}--desc">↓ {text}</option>
				{/each}
			</select>
		</div>
	{/if}
	<Paginator bind:settings={page} select="select" />
</div>

<table class="table table-compact table-hover my-6" class:interactive>
	<thead>
		<tr>
			{#each columns as { id, text, headerClasses, sortable } (id)}
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
