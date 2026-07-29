import assert from 'node:assert';

import { formatText } from './formatText.js';
import { providers } from './providers.js';

import type { FetchOptions, FormattedCurrencies, ParseResponseBody, Rate, RetryOptions } from './types.js';

const noop: ParseResponseBody = () => undefined;

const defaultRetryOptions: RetryOptions = {
	errorFilter: (error: unknown): boolean => {
		if (error instanceof Error) return false;
		const { status } = (error || {}) as { status?: unknown };
		if (typeof status !== 'undefined') {
			if (status === 0) return false;
			if (typeof status === 'number' && status >= 400 && status <= 499) return false;
		}
		return true;
	},
	interval: 5000,
	times: 3,
};

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Runs the given task until it succeeds - up to `times` attempts, waiting
 * `interval` milliseconds between them. A failure for which `errorFilter`
 * returns `false` is not retried.
 */
const retry = async <T>(options: RetryOptions, task: () => Promise<T>): Promise<T> => {
	const times = Math.max(1, options.times);
	let lastError: unknown;
	for (let attempt = 1; attempt <= times; attempt++) {
		try {
			return await task();
		} catch (error) {
			lastError = error;
			if (attempt === times || !options.errorFilter(error)) break;
			if (options.interval > 0) {
				await sleep(options.interval);
			}
		}
	}
	throw lastError;
};

/**
 * Non-OK responses are handed to the provider as-is - several providers
 * describe an unsupported currency pair in the body of a 4xx response.
 */
const requestRate = async (uri: string, parseResponseBody: ParseResponseBody, currencies: FormattedCurrencies): Promise<Rate> => {
	const response = await fetch(uri);
	const body = await response.text();
	const result = parseResponseBody(body, currencies) || null;
	return typeof result === 'number' ? result.toString() : result;
};

export const fetchRate = async (options: FetchOptions): Promise<Rate> => {
	const { currencies: currencyPair, provider: providerName } = options || ({} as FetchOptions);
	const retryOptions: RetryOptions = { ...defaultRetryOptions, ...((options && options.retry) || {}) };
	assert.ok(currencyPair, 'Missing required option: "currencies"');
	assert.strictEqual(typeof currencyPair, 'object', 'Invalid option ("currencies"): Object expected');
	assert.ok(currencyPair.from, 'Missing required option: "currencies.from"');
	assert.ok(currencyPair.to, 'Missing required option: "currencies.to"');
	assert.strictEqual(typeof currencyPair.from, 'string', 'Invalid option ("currencies.from"): String expected');
	assert.strictEqual(typeof currencyPair.to, 'string', 'Invalid option ("currencies.to"): String expected');
	assert.ok(providerName, 'Missing required option: "provider"');
	const provider = providers.find(provider => provider.name === providerName);
	assert.ok(provider, `Unknown provider: "${providerName}"`);
	assert.ok(provider.url, 'Missing provider config: "url"');
	assert.ok(typeof provider.convertSymbols === 'undefined' || typeof provider.convertSymbols === 'object', 'Invalid provider config ("convertSymbols"): Object expected');
	const parseResponseBody = typeof provider.parseResponseBody === 'undefined' ? noop : provider.parseResponseBody;
	assert.strictEqual(typeof parseResponseBody, 'function', 'Invalid provider config ("parseResponseBody"): Function expected');
	const convertSymbol = (symbol: string): string => (provider.convertSymbols && provider.convertSymbols[symbol]) || symbol;
	const from = convertSymbol(currencyPair.from);
	const to = convertSymbol(currencyPair.to);
	const currencies: FormattedCurrencies = {
		from: from.toLowerCase(),
		FROM: from.toUpperCase(),
		to: to.toLowerCase(),
		TO: to.toUpperCase(),
	};
	const uri = formatText(provider.url, currencies);
	return retry(retryOptions, () => requestRate(uri, parseResponseBody, currencies));
};
