import type { TOrderItemCsvLine } from './model';

type TOrderItemTotal = {
	itemName: string;
	totalPrice: number;
	totalQuantity: number;
};
type TOrderItemBySku = Record<string, TOrderItemTotal>;

export function getRecordsBySku(orderItems: TOrderItemCsvLine[]): TOrderItemBySku {
	return orderItems.reduce<TOrderItemBySku>((accumulator, currentValue) => {
		accumulator[currentValue.sku] ||= {
			itemName: currentValue.itemName,
			totalPrice: 0.0,
			totalQuantity: 0
		};
		accumulator[currentValue.sku].totalPrice += currentValue.totalPrice;
		accumulator[currentValue.sku].totalQuantity += currentValue.quantity;
		return accumulator;
	}, {});
}
