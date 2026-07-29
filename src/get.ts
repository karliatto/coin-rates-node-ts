import * as cache from './cache';
import { fetchRate } from './fetch';

import type { GetOptions, Rate } from './types';

export const getRate = async (options: GetOptions): Promise<Rate> => {
	options = options || ({} as GetOptions);
	const { provider, currencies } = options;
	const key = JSON.stringify({ provider, currencies });
	const fromCache = await cache.get(key, options.cache);
	if (fromCache) return fromCache;
	const fromProvider = await fetchRate(options);
	return cache.set(key, fromProvider);
};
