export function currencyFormatter(value: number | bigint) {
	return Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'EUR',
	}).format(value);
}

export function numberFormatter(value: number | bigint) {
	return Intl.NumberFormat('en-US', {
		maximumFractionDigits: 2,
	}).format(value);
}
