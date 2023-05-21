import type { TOrder } from '../order/model';
import type { TCustomer } from './model';

export function getCustomers(orders: TOrder[]) {
	const customersByKey = orders.reduce<Record<string, TCustomer>>((accumulator, currentValue) => {
		const key = currentValue.buyerID || currentValue.buyerFullName;
		accumulator[key] ||= {
			key,
			id: currentValue.buyerID,
			fullName: currentValue.buyerFullName,
			lastName: currentValue.buyerLastName,
			orders: [],
			ordersCount: 0,
			ordersTotalValue: 0,
		};
		accumulator[key].orders.push(currentValue);
		accumulator[key].ordersCount += 1;
		accumulator[key].ordersTotalValue += currentValue.computedTotals.orderValue;
		return accumulator;
	}, {});
	return Object.values(customersByKey).map((customer) => ({
		...customer,
		ordersTotalValue: Math.round(customer.ordersTotalValue * 100) / 100,
	}));
}
