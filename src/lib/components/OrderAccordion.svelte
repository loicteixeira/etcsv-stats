<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { orders } from '$lib/stores';
	import { currencyFormatter } from '$lib/formatters';
	import Icon from '@iconify/svelte';
	import alertCircle from '@iconify/icons-tabler/alert-circle';
	import { collapseOrderDetails } from '$lib/entities/order/transforms';
	import type { TOrder } from '$lib/entities/order/model';

	let collapseOrder = false;
	let collapseFees = true;
	let ordersDisplay: TOrder[] = [];

	$: ordersDisplay = collapseOrderDetails($orders, {
		collapseOrder,
		collapseFees,
	});
</script>

{#if $orders.length}
	<div class="flex justify-end items-center gap-12 mb-12">
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={collapseOrder} />
			<p>Collapse Order Details</p>
		</label>
		<label class="flex items-center space-x-2">
			<input class="checkbox" type="checkbox" bind:checked={collapseFees} />
			<p>Collapse Fees Details</p>
		</label>
	</div>

	<Accordion>
		{#each ordersDisplay as order, index (order.id)}
			<AccordionItem open={index === 0}>
				<svelte:fragment slot="summary">
					<p class="font-bold">
						Order #{order.id}
					</p>
				</svelte:fragment>
				<svelte:fragment slot="content">
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
							{#each order.lines as line (line)}
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
													<span class="text-xs italic text-secondary-300"
														>{line.extraDescription}</span
													>
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
									{currencyFormatter(order.computedTotals.orderTotal)}<br />
									{currencyFormatter(order.computedTotals.orderNet)}
								</td>
							</tr>
						</tfoot>
					</table>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
{/if}
