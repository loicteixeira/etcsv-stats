import type { TStatement, TStatementCsvLine } from './model';

export function postProcessStatementCsvLine({
	amount,
	info,
	type,
	title,
}: TStatementCsvLine): TStatement {
	// Try to find the order ID
	const orderIdTextCandidate =
		(info.toLowerCase().includes('order') && info) ||
		(title.toLowerCase().includes('order') && title) ||
		'';
	const orderIdMatch = orderIdTextCandidate.match(/[0-9]+/)?.[0];
	const orderId = orderIdMatch ? parseInt(orderIdMatch) : null;

	// Cleanup info and title
	const orderTextPattern = /order(?: #|: )\d+/i;
	const cleanedInfo = info.replace(orderTextPattern, '').trim();
	const cleanedTitle = title.replace(orderTextPattern, '').trim();

	// Parse amount
	let cleanedAmount = parseFloat(amount.replace(/[^-.,0-9]/g, '')) || 0;

	// Make the buyer's sales tax positive,
	// because it contributes to the order total (before fees)
	cleanedAmount = type.toLocaleLowerCase() === 'tax' ? Math.abs(cleanedAmount) : cleanedAmount;

	return {
		amount: cleanedAmount,
		info: cleanedInfo,
		orderId,
		type: type.toLocaleLowerCase(),
		title: cleanedTitle,
	};
}

export function getStatementsByOrderId(statements: TStatement[]) {
	return statements.reduce<Record<number, TStatement[]>>((accumulator, currentValue) => {
		if (currentValue.orderId) {
			accumulator[currentValue.orderId] ||= [];
			accumulator[currentValue.orderId].push(currentValue);
		}
		return accumulator;
	}, {});
}
