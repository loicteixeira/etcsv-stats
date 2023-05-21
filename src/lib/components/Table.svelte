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
				{#each row as cell, idx (cell)}
					<td class={columns[idx].cellClasses}>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<div class="flex justify-end">
	{#if sortOptions.length}
		<div class="w-[50%]">
			<label>
				Sort by
				<select bind:value={sort} class="select max-w-[200px] ml-2">
					{#each sortOptions as [value, text] (value)}
						<option value="{value}--asc">↑ {text}</option>
						<option value="{value}--desc">↓ {text}</option>
					{/each}
				</select>
			</label>
		</div>
	{/if}
	<Paginator bind:settings={page} class="w-[50%]" />
</div>

<style>
	table.interactive tbody tr:hover {
		cursor: pointer;
	}
</style>
