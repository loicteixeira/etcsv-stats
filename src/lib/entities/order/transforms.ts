import type { TOrderItem } from '../orderItem/model';
import { getOrderItemsByOrderId } from '../orderItem/transforms';
import type { TStatement } from '../statement/model';
import { getStatementsByOrderId } from '../statement/transforms';
import type { TOrder, TOrderCsvLine, TOrderLine } from './model';

const ORDER_LINE_TYPE_ORDER: TOrderLine['type'][] = [
	'warning',
	'item',
	'itemsDiscount',
	'shipping',
	'shippingDiscount',
	'taxCollected',
	'taxPaid',
	'refund',
	'fees',
	'vat',
];
const LISTING_FEE = 0.18; // HARDCODED: 18c per listing ignoring currency
const VAT_RATE = 0.2; // HARDCODED: 20%

export function postProcessOrderCsvLine(order: TOrderCsvLine): TOrder {
	return {
		...order,
		// When there is a shipping discount, the shipping value is `0`,
		// but we should only discount what has been counted first...
		shipping: order.shipping || order.shippingDiscount,
		lines: [],
		etsyTotals: {
			orderValue: order.valueAmount,
			orderTotal: order.totalAmount,
			orderNet: order.netAmount,
		},
		computedTotals: {
			orderValue: 0,
			orderTotal: 0,
			orderNet: 0,
			fees: 0,
			item: 0,
			itemsDiscount: 0,
			refund: 0,
			shipping: 0,
			shippingDiscount: 0,
			taxCollected: 0,
			taxPaid: 0,
			vat: 0,
		},
	};
}

export function computeOrderDetails(
	orders: TOrder[],
	orderItems: TOrderItem[],
	statements: TStatement[],
): TOrder[] {
	const orderItemsByOrderId = getOrderItemsByOrderId(orderItems);
	const statementByOrderId = getStatementsByOrderId(
		// Exclude:
		// - Sales which are already counted in the corresponding order
		// - VAT because not all lines can be mapped to the order, so it will all be computed manually
		statements.filter(({ type }) => !['sale', 'vat'].includes(type)),
	);

	const results = orders
		.map((order) => {
			const orderItems = orderItemsByOrderId[order.id] ?? [];
			const statementLines = statementByOrderId[order.id] ?? [];

			const lines: TOrderLine[] = [];

			if (orderItems.length > 0) {
				orderItems.forEach(({ itemName, unitPrice, quantity, sku, totalPrice }, idx) => {
					lines.push({
						badge: sku,
						description: itemName,
						unitPrice,
						quantity,
						total: totalPrice,
						type: 'item',
					});
					lines.push({
						description: `Listings fee #${idx}`,
						total: -LISTING_FEE,
						type: 'fees',
					});
					lines.push({
						description: `VAT Listings fee #${idx}`,
						total: Math.round(-LISTING_FEE * VAT_RATE * 100) / 100,
						type: 'vat',
					});
				});
			} else {
				lines.push({
					description:
						'Missing order items information. ' +
						'Did you upload an order items CSV for the same period as this order?',
					type: 'warning',
				});
			}

			if (order.itemsDiscount) {
				const badge =
					order.couponCode && !order.couponDetails?.includes('shipping') ? order.couponCode : '';
				lines.push({
					badge,
					description: 'Order Discount',
					total: -order.itemsDiscount,
					type: 'itemsDiscount',
				});
			}

			if (order.shipping) {
				lines.push({
					description: 'Shipping',
					total: order.shipping,
					type: 'shipping',
				});
			}

			if (order.shippingDiscount) {
				const badge =
					order.couponCode && order.couponDetails?.includes('shipping') ? order.couponCode : '';
				lines.push({
					badge,
					description: 'Shipping Discount',
					total: -order.shippingDiscount,
					type: 'shippingDiscount',
				});
			}

			if (statementLines.length > 0) {
				statementLines.forEach(({ amount, type, title }) => {
					if (type === 'tax') {
						lines.push({
							description: 'Sales tax',
							extraDescription: 'collected by Etsy on your behalf',
							total: amount,
							type: 'taxCollected',
						});
						lines.push({
							description: 'Sales tax',
							extraDescription: 'paid by Etsy to the collector',
							total: -amount,
							type: 'taxPaid',
						});
					} else if (type === 'fee') {
						lines.push({
							description: title,
							total: amount,
							type: 'fees',
						});
						lines.push({
							description: `VAT ${title}`,
							total: amount * VAT_RATE,
							type: 'vat',
						});
						// TODO: Fee with a positive amount as "credit" (happens with refunds)
					} else if (type === 'refund') {
						lines.push({
							description: title,
							total: amount,
							type: 'refund',
						});
					} else {
						console.warn(`Invalid line of type: ${type}`);
					}
				});
			} else {
				lines.push({
					description:
						'Missing statements information. ' +
						'Did you upload a statement CSV for the same period as this order?',
					type: 'warning',
				});
			}

			type TTotalKey = Exclude<TOrderLine['type'], 'warning'>;
			const totals = lines.reduce<Record<TTotalKey, number>>(
				(acc, line) => {
					if (line.type === 'warning') return acc;
					acc[line.type] += line.total;
					return acc;
				},
				{
					item: 0,
					itemsDiscount: 0,
					refund: 0,
					shipping: 0,
					shippingDiscount: 0,
					taxCollected: 0,
					taxPaid: 0,
					fees: 0,
					vat: 0,
				},
			);
			for (const [key, value] of Object.entries(totals)) {
				totals[key as TTotalKey] = Math.round(value * 100) / 100;
			}

			const orderTotal =
				Math.round(
					(totals.item +
						totals.itemsDiscount +
						totals.shipping +
						totals.shippingDiscount +
						totals.taxCollected) *
						100,
				) / 100;

			const orderNet =
				Math.round(Object.values(totals).reduce((acc, val) => acc + val) * 100) / 100;

			return {
				...order,
				lines: sortOrderLines(lines),
				computedTotals: {
					orderValue: totals.item,
					orderTotal: orderTotal,
					orderNet: orderNet,
					...totals,
				},
			};
		})
		.sort((a, b) => ([2627560003, 2356475894].includes(a.id) ? -1 : 1)); // TODO: Remove after testing

	return results;
}

type collapseOrderDetailsOptions = {
	collapseOrder: boolean;
	collapseFees: boolean;
};
export function collapseOrderDetails(orders: TOrder[], options: collapseOrderDetailsOptions) {
	return orders.map((order) => {
		const lines = order.lines.filter(({ type }) => {
			if (
				options.collapseOrder &&
				['item', 'itemsDiscount', 'shipping', 'shippingDiscount', 'taxCollected'].includes(type)
			)
				return false;
			if (options.collapseFees && ['fees', 'vat'].includes(type)) return false;
			return true;
		});

		if (options.collapseOrder) {
			lines.push({
				description: 'Order',
				extraDescription: 'collapsed',
				total: order.computedTotals.orderTotal,
				type: 'item',
			});
		}

		if (options.collapseFees) {
			const total = Math.round((order.computedTotals.fees + order.computedTotals.vat) * 100) / 100;
			lines.push({
				description: 'Fees',
				extraDescription: 'collapsed',
				total: total,
				type: 'fees',
			});
		}

		return {
			...order,
			lines: sortOrderLines(lines),
		};
	});
}

function sortOrderLines(orderLInes: TOrderLine[]) {
	return orderLInes.sort(
		(a, b) =>
			ORDER_LINE_TYPE_ORDER.indexOf(a.type) - ORDER_LINE_TYPE_ORDER.indexOf(b.type) ||
			a.description.localeCompare(b.description),
	);
}
