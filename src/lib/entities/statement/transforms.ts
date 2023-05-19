import type { TStatementCsvLine } from './model';

export function getStatementsByOrderId(statements: TStatementCsvLine[]) {
	return statements.reduce<Record<number, TStatementCsvLine[]>>((accumulator, currentValue) => {
		const { type, info, title } = currentValue;

		// Skip unrelated lines
		// - Deposits aren't related to a specific order
		// - Sale is already counted in the order
		// - VAT lines don't have Order ID information and the lines order isn't consistent
		//   so guessing which order it belongs to is tricky...
		if (['deposit', 'sale', 'vat'].includes(type.toLowerCase())) {
			return accumulator;
		}

		// Order ID
		const orderIdTextCandidate =
			(info.toLowerCase().includes('order') && info) ||
			(title.toLowerCase().includes('order') && title) ||
			'';
		const orderIdMatch = orderIdTextCandidate.match(/[0-9]+/)?.[0];
		if (orderIdMatch) {
			const orderId = parseInt(orderIdMatch);
			accumulator[orderId] ||= [];
			accumulator[orderId].push(currentValue);
		}
		return accumulator;
	}, {});
}
