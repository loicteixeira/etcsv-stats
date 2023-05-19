import type { TOrderItemCsvLine, TOrderItem, TOrderItemTotal } from './model';

export function postProcessOrderItemCsvLine(orderItem: TOrderItemCsvLine): TOrderItem {
	return orderItem;
}

export function aggregateOrderItemsBySku(orderItems: TOrderItem[]) {
	return orderItems.reduce<Record<string, TOrderItemTotal>>((accumulator, currentValue) => {
		accumulator[currentValue.sku] ||= {
			itemName: currentValue.itemName,
			totalPrice: 0.0,
			totalQuantity: 0,
		};
		accumulator[currentValue.sku].totalPrice += currentValue.totalPrice;
		accumulator[currentValue.sku].totalQuantity += currentValue.quantity;
		return accumulator;
	}, {});
}

export function getOrderItemsByOrderId(orderItems: TOrderItem[]) {
	return orderItems.reduce<Record<number, TOrderItem[]>>((accumulator, currentValue) => {
		accumulator[currentValue.orderId] ||= [];
		accumulator[currentValue.orderId].push(currentValue);
		return accumulator;
	}, {});
}
