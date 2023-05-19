import type { TOrderItem } from '../orderItem/model';
import { getOrderItemsByOrderId } from '../orderItem/transforms';
import type { TStatement } from '../statement/model';
import { getStatementsByOrderId } from '../statement/transforms';
import type { TOrder, TOrderCsvLine } from './model';

export function postProcessOrderCsvLine(order: TOrderCsvLine): TOrder {
	return {
		...order,
		computedNetAmount: 0,
		items: [],
		// When there is a shipping discount, the shipping value is `0`,
		// but we should only discount what has been counted first...
		shipping: order.shipping || order.shippingDiscount,
		statement: [],
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

			const orderItemsTotal = orderItems.reduce(
				(accumulator, currentValue) => (accumulator += currentValue.totalPrice),
				0,
			);
			const statementLinesTotal = statementLines.reduce(
				(accumulator, currentValue) => (accumulator += currentValue.amount),
				0,
			);
			const total =
				orderItemsTotal -
				order.itemsDiscount +
				order.shipping -
				order.shippingDiscount +
				statementLinesTotal;

			return {
				...order,
				items: orderItems,
				statements: statementLines,
				computedNetAmount: total,
			};
		})
		.sort((a, b) => ([2631904461, 2524411094, 2609238799, 2356475894].includes(a.id) ? -1 : 1)); // TODO: Remove after testing

	return results;
}
