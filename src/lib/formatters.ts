export const currencyFormatter = Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'EUR'
}).format;
