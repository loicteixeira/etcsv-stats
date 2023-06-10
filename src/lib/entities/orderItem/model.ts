import { z } from 'zod';

export const orderItemCsvLineSchema = z
	.object({
		'Discount Amount': z.coerce.number().nonnegative().optional().default(0),
		'Item Name': z.string(),
		'Item Total': z.coerce.number().nonnegative(),
		'Listing ID': z.coerce.number(),
		'Order ID': z.coerce.number().nonnegative(),
		'Order Sales Tax': z.coerce.number().nonnegative().optional().default(0),
		'Order Shipping': z.coerce.number().nonnegative().optional().default(0),
		Price: z.coerce.number().nonnegative(),
		Quantity: z.coerce.number().int().nonnegative(),
		'Shipping Discount': z.coerce.number().nonnegative().optional().default(0),
		SKU: z.string(),
		'Transaction ID': z.coerce.number(),
		Variations: z.string(),
	})
	.transform((line) => {
		const variations: Record<string, string> = Object.fromEntries(
			line['Variations']
				.split(',')
				.filter(Boolean)
				.map((variation) => variation.split(':'))
				.filter((pair) => {
					if (pair.length !== 2) {
						console.warn(`Invalid variation pair: ${pair}`);
						return false;
					}
					return true;
				}),
		);
		const variationsKey = Object.entries(variations)
			.filter(([key]) => key !== 'Personalization')
			.flatMap((value) => value)
			.map((value) => value.toLowerCase().replace(/\s*/g, ''))
			.sort()
			.join('');

		return {
			discount: line['Discount Amount'],
			itemName: line['Item Name'],
			totalPrice: line['Item Total'],
			listingID: line['Listing ID'],
			orderID: line['Order ID'],
			orderSalesTax: line['Order Sales Tax'],
			shipping: line['Order Shipping'],
			unitPrice: line['Price'],
			quantity: line['Quantity'],
			shippingDiscount: line['Shipping Discount'],
			sku: line['SKU'],
			transactionID: line['Transaction ID'],
			variations: variations,
			variationsKey,
		};
	});

export type TOrderItemCsvLine = z.infer<typeof orderItemCsvLineSchema>;

export type TOrderItem = {
	itemName: string;
	listingID: number;
	orderID: number;
	sku: string;
	transactionID: number;
	variations: Record<string, string>;
	variationsKey: string;
	computedTotals: {
		quantity: number;
		unitPrice: number;
		totalDiscounts?: number;
		totalGrossBeforeDiscounts: number;
		totalGrossAfterDiscounts?: number;
		totalNet?: number;
	};
};

export type TOrderItemTotal = {
	itemName: string;
	totalDiscounts: number;
	totalGrossAfterDiscounts: number;
	totalGrossBeforeDiscounts: number;
	totalNet: number;
	totalQuantity: number;
};
