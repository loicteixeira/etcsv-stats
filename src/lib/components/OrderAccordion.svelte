<script lang="ts">
	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { orders } from '$lib/stores';
	import { currencyFormatter } from '$lib/formatters';
	import Icon from '@iconify/svelte';
	import alertCircle from '@iconify/icons-tabler/alert-circle';
</script>

{#if $orders.length}
	<Accordion>
		{#each $orders as order, index (order.id)}
			<AccordionItem open={index < 4}>
				<svelte:fragment slot="summary">
					<p>
						<span class="font-bold">Order #{order.id}</span> for {currencyFormatter(
							order.totalAmount,
						)}<span class="font-bold" />
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
							{#each order.items as item (item)}
								<tr>
									<td class="flex items-center gap-2 justify-between">
										<span>{item.itemName}</span>
										<span class="badge variant-soft">{item.sku}</span>
									</td>
									<td class="text-right">{currencyFormatter(item.unitPrice)}</td>
									<td class="text-right">{item.quantity}</td>
									<td class="text-right">{currencyFormatter(item.totalPrice)}</td>
								</tr>
							{:else}
								<tr>
									<td colspan="4" class="flex items-center gap-2">
										<Icon icon={alertCircle} class="text-warning-500" />
										<p>
											Missing order items information. Did you upload an order items CSV for the
											same period as this order?
										</p>
									</td>
								</tr>
							{/each}
							{#if order.itemsDiscount}
								<tr>
									<td class="flex items-center gap-2 justify-between">
										<span>Order Discount</span>
										{#if order.couponCode && !order.couponDetails?.includes('shipping')}
											<span class="badge variant-soft">{order.couponCode}</span>
										{/if}
									</td>
									<td colspan="3" class="text-right">{currencyFormatter(-order.itemsDiscount)}</td>
								</tr>
							{/if}
							{#if order.shipping}
								<tr>
									<td colspan="3"> Shipping </td>
									<td class="text-right">{currencyFormatter(order.shipping)}</td>
								</tr>
							{/if}
							{#if order.shippingDiscount}
								<tr>
									<td class="flex items-center gap-2 justify-between">
										<span>Shipping Discount</span>
										{#if order.couponCode && order.couponDetails?.includes('shipping')}
											<span class="badge variant-soft">{order.couponCode}</span>
										{/if}
									</td>
									<td colspan="3" class="text-right"
										>{currencyFormatter(-order.shippingDiscount)}</td
									>
								</tr>
							{/if}
							<tr>
								<td colspan="3">
									<span class="badge variant-filled-warning">TODO</span> Etsy fees + Sales tax
								</td>
								<td class="text-right">...</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th colspan="3">
									<span class="badge variant-filled-warning">TODO</span> Total
								</th>
								<td class="text-right">...</td>
							</tr>
						</tfoot>
					</table>
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>
{/if}
