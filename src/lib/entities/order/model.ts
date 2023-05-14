import { z } from 'zod';

export const OrderCsvLineSchema = z
	.object({
		// 'Adjusted Card Processing Fees': z.coerce.number().nonnegative().default(0),  // What is it?
		// 'Adjusted Net Order Amount': z.coerce.number().nonnegative().default(0),  // What is it?
		// 'Adjusted Order Total': z.coerce.number().nonnegative().default(0),  // What is it?
		'Card Processing Fees': z.coerce.number().nonnegative().default(0),
		'Coupon Code': z.string().optional(),
		'Coupon Details': z.string().optional(),
		'Discount Amount': z.coerce.number().nonnegative().default(0),
		'Number of Items': z.coerce.number(),
		'Order ID': z.coerce.number().nonnegative(),
		'Order Net': z.coerce.number().nonnegative().default(0),
		'Order Total': z.coerce.number().nonnegative().default(0),
		'Order Value': z.coerce.number().nonnegative().default(0),
		'Shipping Discount': z.coerce.number().nonnegative().default(0),
		Shipping: z.coerce.number().nonnegative().default(0),
		'Sale Date': z.string(), // Date (always in american format?)
		// 'Sales Tax': z.coerce.number().nonnegative().default(0),  // Always 0
	})
	.transform((rawOrder) => ({
		id: rawOrder['Order ID'],
		itemCount: rawOrder['Number of Items'],
		cardProcessingFees: rawOrder['Card Processing Fees'],
		couponCode: rawOrder['Coupon Code'],
		couponDetails: rawOrder['Coupon Details'],
		date: rawOrder['Sale Date'],
		itemsAmount: rawOrder['Order Value'],
		itemsDiscount: rawOrder['Discount Amount'],
		netAmount: rawOrder['Order Net'],
		// When there is a shipping discount, the shipping value is `0`,
		// but we should only discount what has been counted first...
		shipping: rawOrder['Shipping'] || rawOrder['Shipping Discount'],
		shippingDiscount: rawOrder['Shipping Discount'],
		totalAmount: rawOrder['Order Total'],
	}));

export type TOrderCsvLine = z.infer<typeof OrderCsvLineSchema>;
