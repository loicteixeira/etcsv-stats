import type { TOrderItem, TOrderItemCsvLine, TOrderItemTotal } from './model';

export function aggregateOrderItemsBySku(orderItems: TOrderItem[]) {
	return orderItems.reduce<Record<string, TOrderItemTotal>>((accumulator, currentValue) => {
		accumulator[currentValue.sku] ||= {
			itemName: currentValue.itemName,
			sku: currentValue.sku,
			totalDiscounts: 0.0,
			totalGrossAfterDiscounts: 0.0,
			totalGrossBeforeDiscounts: 0.0,
			totalNet: 0.0,
			totalQuantity: 0,
			variations: {},
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

export function aggregateOrderItemBySkuAndVariant(orderItems: TOrderItem[]) {
	return orderItems.reduce<Record<string, TOrderItemTotal>>((accumulator, currentValue) => {
		const key = `${currentValue.sku} / ${currentValue.variationsKey}`;
		accumulator[key] ||= {
			itemName: currentValue.itemName,
			sku: currentValue.sku,
			totalDiscounts: 0.0,
			totalGrossAfterDiscounts: 0.0,
			totalGrossBeforeDiscounts: 0.0,
			totalNet: 0.0,
			totalQuantity: 0,
			variations: currentValue.variations,
		};
		accumulator[key].totalDiscounts += currentValue.computedTotals.totalDiscounts ?? 0;
		accumulator[key].totalGrossAfterDiscounts +=
			currentValue.computedTotals.totalGrossAfterDiscounts ?? 0;
		accumulator[key].totalGrossBeforeDiscounts +=
			currentValue.computedTotals.totalGrossBeforeDiscounts;
		accumulator[key].totalNet += currentValue.computedTotals.totalNet ?? 0;
		accumulator[key].totalQuantity += currentValue.computedTotals.quantity;
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
