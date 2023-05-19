import type { TOrderItemCsvLine } from './model';

type TOrderItemTotal = {
	itemName: string;
	totalPrice: number;
	totalQuantity: number;
};
type TOrderItemBySku = Record<string, TOrderItemTotal>;

export function aggregateOrderItemsBySku(orderItems: TOrderItemCsvLine[]) {
	return orderItems.reduce<TOrderItemBySku>((accumulator, currentValue) => {
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

export function getOrderItemsByOrderId(orderItems: TOrderItemCsvLine[]) {
	return orderItems.reduce<Record<number, TOrderItemCsvLine[]>>((accumulator, currentValue) => {
		accumulator[currentValue.orderId] ||= [];
		accumulator[currentValue.orderId].push(currentValue);
		return accumulator;
	}, {});
}
