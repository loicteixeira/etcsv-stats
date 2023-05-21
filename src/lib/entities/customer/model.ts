import type { TOrder } from '../order/model';

export type TCustomer = {
	key: string;
	id: string;
	fullName: string;
	lastName: string;
	orders: TOrder[];
	ordersCount: number;
	ordersTotalValue: number;
};
