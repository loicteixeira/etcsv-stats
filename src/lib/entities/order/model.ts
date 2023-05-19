import { z } from 'zod';
import type { TOrderItem } from '../orderItem/model';
import type { TStatement } from '../statement/model';

export const orderCsvLineSchema = z
	.object({
		'Coupon Code': z.string().optional(),
		'Coupon Details': z.string().optional(),
		'Discount Amount': z.coerce.number().nonnegative().default(0),
		'Order ID': z.coerce.number().nonnegative(),
		'Order Net': z.coerce.number().nonnegative().default(0),
		'Order Total': z.coerce.number().nonnegative().default(0),
		'Shipping Discount': z.coerce.number().nonnegative().default(0),
		Shipping: z.coerce.number().nonnegative().default(0),
	})
	.transform((line) => ({
		id: line['Order ID'],
		couponCode: line['Coupon Code'],
		couponDetails: line['Coupon Details'],
		itemsDiscount: line['Discount Amount'],
		etsyNetAmount: line['Order Net'],
		shipping: line['Shipping'],
		shippingDiscount: line['Shipping Discount'],
		totalAmount: line['Order Total'],
	}));

export type TOrderCsvLine = z.infer<typeof orderCsvLineSchema>;

export type TOrder = TOrderCsvLine & {
	items: TOrderItem[];
	statement: TStatement[];
	computedNetAmount: number;
};
