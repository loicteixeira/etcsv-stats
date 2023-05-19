import { z } from 'zod';

export const orderCsvLineSchema = z
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
		'Sale Date': z.string(), // Date (as `MM/DD/YY`, always?)
		// 'Sales Tax': z.coerce.number().nonnegative().default(0),  // Always 0
	})
	.transform((line) => ({
		id: line['Order ID'],
		itemCount: line['Number of Items'],
		cardProcessingFees: line['Card Processing Fees'],
		couponCode: line['Coupon Code'],
		couponDetails: line['Coupon Details'],
		date: line['Sale Date'],
		itemsAmount: line['Order Value'],
		itemsDiscount: line['Discount Amount'],
		netAmount: line['Order Net'],
		// When there is a shipping discount, the shipping value is `0`,
		// but we should only discount what has been counted first...
		shipping: line['Shipping'] || line['Shipping Discount'],
		shippingDiscount: line['Shipping Discount'],
		totalAmount: line['Order Total'],
	}));

export type TOrderCsvLine = z.infer<typeof orderCsvLineSchema>;
