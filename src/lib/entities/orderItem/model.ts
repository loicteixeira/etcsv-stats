import { z } from 'zod';

export const orderItemCsvLine = z
	.object({
		'Discount Amount': z.coerce.number().nonnegative().optional().default(0),
		'Item Name': z.string(),
		'Item Total': z.coerce.number().nonnegative(),
		'Listing ID': z.coerce.number(),
		'Order ID': z.string(),
		'Order Sales Tax': z.coerce.number().nonnegative().optional().default(0),
		'Order Shipping': z.coerce.number().nonnegative().optional().default(0),
		Price: z.coerce.number().nonnegative(),
		Quantity: z.coerce.number().int().nonnegative(),
		'Shipping Discount': z.coerce.number().nonnegative().optional().default(0),
		SKU: z.string(),
		'Transaction ID': z.coerce.number()
	})
	.transform((orderItem) => ({
		discount: orderItem['Discount Amount'],
		itemName: orderItem['Item Name'],
		totalPrice: orderItem['Item Total'],
		listingID: orderItem['Listing ID'],
		orderId: orderItem['Order ID'],
		orderSalesTax: orderItem['Order Sales Tax'],
		shipping: orderItem['Order Shipping'],
		unitPrice: orderItem['Price'],
		quantity: orderItem['Quantity'],
		shippingDiscount: orderItem['Shipping Discount'],
		sku: orderItem['SKU'],
		transactionID: orderItem['Transaction ID']
	}));

export type TOrderItemCsvLine = z.infer<typeof orderItemCsvLine>;
