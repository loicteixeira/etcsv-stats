<script lang="ts">
	import Icon from '@iconify/svelte';
	import alertCircle from '@iconify/icons-tabler/alert-circle';
	import type { TOrder } from '$lib/entities/order/model';
	import { collapseOrderDetails } from '$lib/entities/order/transforms';
	import { currencyFormatter } from '$lib/formatters';

	export let order: TOrder;
	export let collapseOrderLines = false;
	export let collapseFeesLines = true;

	$: orderDisplay = collapseOrderDetails(order, { collapseOrderLines, collapseFeesLines });
</script>

<table class="table table-compact table-hover">
	<thead>
		<tr>
			<th>Name</th>
			<th class="table-cell-fit">Unit Price</th>
			<th class="table-cell-fit">Quantity</th>
			<th class="table-cell-fit">Total</th>
		</tr>
	</thead>
	<tbody>
		{#each orderDisplay.lines as line (line)}
			<tr>
				{#if line.type === 'warning'}
					<td colspan="4" class="flex items-center gap-2">
						<Icon icon={alertCircle} class="text-warning-500" />
						<span>{line.description}</span>
					</td>
				{:else}
					<td class="flex items-center gap-2 justify-between">
						<span>
							{line.description}
							{#if line.extraDescription}
								<span class="text-xs italic text-secondary-300">{line.extraDescription}</span>
							{/if}
						</span>
						{#if line.badge}<span class="badge variant-soft">{line.badge}</span>{/if}
					</td>

					<td class="text-right">
						{#if line.unitPrice}{currencyFormatter(line.unitPrice)}{/if}
					</td>

					<td class="text-right">
						{#if line.quantity}{line.quantity}{/if}
					</td>

					<td class="text-right">{currencyFormatter(line.total)}</td>
				{/if}
			</tr>
		{/each}
	</tbody>
	<tfoot>
		<tr>
			<th colspan="3" class="text-right">
				Total Order<br />
				Total Net<br />
			</th>
			<td>
				{currencyFormatter(orderDisplay.computedTotals.orderTotal)}<br />
				{currencyFormatter(orderDisplay.computedTotals.orderNet)}
			</td>
		</tr>
	</tfoot>
</table>
