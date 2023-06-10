import type { TOrderItem, TOrderItemCsvLine, TOrderItemTotal } from './model';

export function aggregateOrderItemsBySku(orderItems: TOrderItem[]) {
	return orderItems.reduce<Record<string, TOrderItemTotal>>((accumulator, currentValue) => {
		accumulator[currentValue.sku] ||= {
			itemName: currentValue.itemName,
			totalDiscounts: 0.0,
			totalGrossAfterDiscounts: 0.0,
			totalGrossBeforeDiscounts: 0.0,
			totalNet: 0.0,
			totalQuantity: 0,
		};
		accumulator[currentValue.sku].totalDiscounts += currentValue.computedTotals.totalDiscounts ?? 0;
		accumulator[currentValue.sku].totalGrossAfterDiscounts +=
			currentValue.computedTotals.totalGrossAfterDiscounts ?? 0;
		accumulator[currentValue.sku].totalGrossBeforeDiscounts +=
			currentValue.computedTotals.totalGrossBeforeDiscounts;
		accumulator[currentValue.sku].totalNet += currentValue.computedTotals.totalNet ?? 0;
		accumulator[currentValue.sku].totalQuantity += currentValue.computedTotals.quantity;
		return accumulator;
	}, {});
}

export function getOrderItemCsvLinesByOrderID(orderItems: TOrderItemCsvLine[]) {
	return orderItems.reduce<Record<number, TOrderItemCsvLine[]>>((accumulator, currentValue) => {
		accumulator[currentValue.orderID] ||= [];
		accumulator[currentValue.orderID].push(currentValue);
		return accumulator;
	}, {});
}
