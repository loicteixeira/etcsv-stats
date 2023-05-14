import { z } from 'zod';

export const OrderCsvLineSchema = z
	.object({
		// 'Adjusted Card Processing Fees': z.coerce.number().nonnegative().default(0),  // What is it?
		// 'Adjusted Net Order Amount': z.coerce.number().nonnegative().default(0),  // What is it?
		// 'Adjusted Order Total': z.coerce.number().nonnegative().default(0),  // What is it?
		'Card Processing Fees': z.coerce.number().nonnegative().default(0),
		// 'Coupon Code': z.string().optional(),
		'Discount Amount': z.coerce.number().nonnegative().default(0),
		'Number of Items': z.coerce.number(),
		'Order ID': z.coerce.number().nonnegative(),
		'Order Net': z.coerce.number().nonnegative().default(0),
		'Order Total': z.coerce.number().nonnegative().default(0),
		'Order Value': z.coerce.number().nonnegative().default(0),
		'Shipping Discount': z.coerce.number().nonnegative().default(0),
		Shipping: z.coerce.number().nonnegative().default(0)
		// 'Sale Date': z.string(), // Date (always in american format?)
		// 'Sales Tax': z.coerce.number().nonnegative().default(0),  // Always 0
	})
	.transform((rawOrder) => ({
		id: rawOrder['Order ID'],
		itemCount: rawOrder['Number of Items'],
		cardProcessingFees: rawOrder['Card Processing Fees'],
		orderNet: rawOrder['Order Net'],
		orderTotal: rawOrder['Order Total'],
		orderAmount: rawOrder['Order Value'],
		orderDiscount: rawOrder['Discount Amount'],
		shipping: rawOrder['Shipping'],
		shippingDiscount: rawOrder['Shipping Discount']
	}));

export type TOrderCsvLine = z.infer<typeof OrderCsvLineSchema>;
