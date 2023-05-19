import { z } from 'zod';

export const orderCsvLineSchema = z
	.object({
		'Coupon Code': z.string().optional(),
		'Coupon Details': z.string().optional(),
		'Discount Amount': z.coerce.number().nonnegative().default(0),
		'Order ID': z.coerce.number().nonnegative(),
		'Order Net': z.coerce.number().nonnegative().default(0),
		'Order Value': z.coerce.number().nonnegative().default(0),
		'Order Total': z.coerce.number().nonnegative().default(0),
		'Shipping Discount': z.coerce.number().nonnegative().default(0),
		Shipping: z.coerce.number().nonnegative().default(0),
	})
	.transform((line) => ({
		id: line['Order ID'],
		couponCode: line['Coupon Code'],
		couponDetails: line['Coupon Details'],
		itemsDiscount: line['Discount Amount'],
		netAmount: line['Order Net'],
		shipping: line['Shipping'],
		shippingDiscount: line['Shipping Discount'],
		totalAmount: line['Order Total'],
		valueAmount: line['Order Value'],
	}));

export type TOrderCsvLine = z.infer<typeof orderCsvLineSchema>;

export type TOrder = TOrderCsvLine & {
	computedTotals: {
		orderValue: number;
		orderTotal: number;
		orderNet: number;
		// TODO: Dynamically pull from TTotalKey?
		fees: number;
		item: number;
		itemsDiscount: number;
		refund: number;
		shipping: number;
		shippingDiscount: number;
		taxCollected: number;
		taxPaid: number;
		vat: number;
	};
	etsyTotals: {
		orderValue: number;
		orderTotal: number;
		orderNet: number;
	};
	lines: TOrderLine[];
};

export type TOrderLine =
	| {
			description: string;
			type: 'warning';
	  }
	| {
			badge?: string;
			description: string;
			extraDescription?: string;
			unitPrice?: number;
			quantity?: number;
			total: number;
			type:
				| 'fees'
				| 'item'
				| 'itemsDiscount'
				| 'refund'
				| 'shipping'
				| 'shippingDiscount'
				| 'taxCollected'
				| 'taxPaid'
				| 'vat';
	  };
