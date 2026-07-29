import * as cache from './cache.js';
import { fetchRate } from './fetch.js';

import type { GetOptions, Rate } from './types.js';

export const getRate = async (options: GetOptions): Promise<Rate> => {
	options = options || ({} as GetOptions);
	const { provider, currencies } = options;
	const key = JSON.stringify({ provider, currencies });
	const fromCache = await cache.get(key, options.cache);
	if (fromCache) return fromCache;
	const fromProvider = await fetchRate(options);
	return cache.set(key, fromProvider);
};
