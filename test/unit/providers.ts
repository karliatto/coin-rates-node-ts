import assert from 'assert';

import * as coinRates from '../../src';

import type { GetOptions } from '../../src';

describe('providers', () => {

	const supportedTo: Record<string, string> = {
		okx: 'USD',
	};

	coinRates.providers.forEach(provider => {

		const { name } = provider;

		describe(name, () => {

			describe('get([options])', () => {

				it('supported fiat currency', async () => {
					const from = 'BTC';
					const to = supportedTo[name] || 'EUR';
					const options: GetOptions = {
						provider: name,
						currencies: { from, to },
					};
					const rate = await coinRates.get(options);
					assert.ok(rate);
					assert.strictEqual(typeof rate, 'string');
					const asNumber = parseFloat(rate);
					assert.strictEqual(typeof asNumber, 'number');
					assert.ok(!Number.isNaN(asNumber));
					assert.ok(asNumber > 0);
					// A second call for the same pair is served from the cache.
					const cachedRate = await coinRates.get(options);
					assert.strictEqual(cachedRate, rate);
				});

				it('unsupported fiat currency', async () => {
					const from = 'BTC';
					const to = 'XXX';
					const options: GetOptions = {
						provider: name,
						currencies: { from, to },
					};
					let thrownError: unknown;
					try {
						await coinRates.get(options);
					} catch (error) {
						thrownError = error;
					}
					assert.ok(thrownError, 'Expected an error');
					const message = thrownError instanceof Error ? thrownError.message : String(thrownError);
					assert.ok(new RegExp([
						'invalid symbol',// binance
						'unknown symbol',// bitfinex
						'invalid product',// bitflyer
						'unsupported currency pair',// bitstamp, coinbase
						`currency pair ${from}_${to} not found`,// coinmate
						'unsupported currency',// ibexmercado
						'unknown asset pair',// kraken
						'instrument ID does not exist',// okx
					].join('|'), 'i').test(message), message);
				});
			});
		});
	});
});
