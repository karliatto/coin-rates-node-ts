import type { FormattedCurrencies } from './types.js';

export const formatText = (text: string, data: FormattedCurrencies): string => {
	const { from, to, FROM, TO } = data;
	return text
		.replace(`{{from}}`, from)
		.replace(`{{to}}`, to)
		.replace(`{{FROM}}`, FROM)
		.replace(`{{TO}}`, TO);
};
