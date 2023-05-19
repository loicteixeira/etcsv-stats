import type { TStatement, TStatementCsvLine } from './model';

export function postProcessStatementCsvLine({
	amount,
	info,
	type,
	title,
}: TStatementCsvLine): TStatement {
	const orderIdTextCandidate =
		(info.toLowerCase().includes('order') && info) ||
		(title.toLowerCase().includes('order') && title) ||
		'';
	const orderIdMatch = orderIdTextCandidate.match(/[0-9]+/)?.[0];
	const orderId = orderIdMatch ? parseInt(orderIdMatch) : null;

	return {
		amount,
		info,
		orderId,
		type: type.toLocaleLowerCase(),
		title,
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
