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
	})
	.transform((line) => ({
		discount: line['Discount Amount'],
		itemName: line['Item Name'],
		totalPrice: line['Item Total'],
		listingID: line['Listing ID'],
		orderId: line['Order ID'],
		orderSalesTax: line['Order Sales Tax'],
		shipping: line['Order Shipping'],
		unitPrice: line['Price'],
		quantity: line['Quantity'],
		shippingDiscount: line['Shipping Discount'],
		sku: line['SKU'],
		transactionID: line['Transaction ID'],
	}));

export type TOrderItemCsvLine = z.infer<typeof orderItemCsvLineSchema>;
