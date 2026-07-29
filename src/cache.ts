import type { CacheOptions, Rate } from './types.js';

type CacheItem = {
	data: Rate;
	timestamp: number;
};

const map = new Map<string, string>();

const defaultOptions: Required<CacheOptions> = {
	maxAge: 5 * 60 * 1000,
};

export const get = async (key: string, options?: CacheOptions): Promise<Rate> => {
	const { maxAge } = { ...defaultOptions, ...(options || {}) };
	const value = map.get(key);
	if (!value) return null;
	const item = JSON.parse(value) as CacheItem;
	if (maxAge) {
		const expired = item.timestamp < Date.now() - maxAge;
		if (expired) {
			map.delete(key);
			return null;
		}
	}
	return item.data;
};

export const set = async (key: string, data: Rate): Promise<Rate> => {
	const item: CacheItem = { data, timestamp: Date.now() };
	map.set(key, JSON.stringify(item));
	return data;
};
