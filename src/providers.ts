import assert from 'assert';

import type { Provider } from './types';

export const providers: Provider[] = [
	{
		name: 'anycoin',
		label: 'Anycoin',
		url: 'https://www.anycoin.cz/api/compact_rates',
		parseResponseBody: (body, currencies) => {
			const data = JSON.parse(body) as { data: { coin_code: string; value: string }[] };
			const { FROM, TO } = currencies;
			const coinCode = `${FROM}${TO}`;
			const rate = data.data.find(item => item.coin_code === coinCode)?.value;
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
	{
		name: 'binance',
		label: 'Binance',
		url: 'https://api.binance.com/api/v3/ticker/price?symbol={{FROM}}{{TO}}',
		convertSymbols: {
			USD: 'USDT',
		},
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { code?: number; msg?: string; price?: string };
			assert.ok(!data.code, data.msg);
			return data.price;
		},
	},
	{
		name: 'bitfinex',
		label: 'Bitfinex',
		url: 'https://api.bitfinex.com/v1/pubticker/{{from}}{{to}}',
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { message?: string; last_price?: string };
			assert.ok(!data.message, data.message);
			return data.last_price;
		},
	},
	{
		name: 'bitflyer',
		label: 'bitFlyer',
		url: 'https://api.bitflyer.com/v1/ticker?product_code={{FROM}}_{{TO}}',
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { error_message?: string; ltp?: number };
			assert.ok(!data.error_message, data.error_message);
			return data.ltp;
		},
	},
	{
		name: 'bitstamp',
		label: 'Bitstamp',
		url: 'https://www.bitstamp.net/api/v2/ticker/{{from}}{{to}}/',
		parseResponseBody: (body) => {
			assert.ok(!/not found/i.test(body), 'Unsupported currency pair');
			const data = JSON.parse(body) as { message?: string; last?: string };
			assert.ok(!data.message, data.message);
			return data.last;
		},
	},
	{
		name: 'coinbase',
		label: 'Coinbase',
		url: 'https://api.coinbase.com/v2/exchange-rates?currency={{FROM}}',
		parseResponseBody: (body, currencies) => {
			const data = JSON.parse(body) as {
				errors?: unknown;
				data?: { rates?: Record<string, string> };
			};
			assert.ok(!data.errors, JSON.stringify(data.errors));
			const { TO } = currencies;
			const rate = data.data && data.data.rates && data.data.rates[TO];
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
	{
		name: 'coinmate',
		label: 'CoinMate.io',
		url: 'https://coinmate.io/api/ticker?currencyPair={{FROM}}_{{TO}}',
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { errorMessage?: string; data?: { last?: number } };
			assert.ok(!data.errorMessage, data.errorMessage);
			return data.data && data.data.last;
		},
	},
	{
		name: 'ibexmercado',
		label: 'IBEX',
		url: 'https://ibexhub.ibexmercado.com/currency/rate/{{to}}',
		convertSymbols: {
			'USD': '3',
			'GTQ': '4',
			'MXN': '5',
			'PLN': '6',
			'HNL': '7',
			'EUR': '8',
			'ARS': '9',
			'ARS_PA': '10',
			'BRL': '11',
			'KES': '12',
			'CHF': '13',
			'COP': '14',
			'NGN': '15',
			'SEK': '16',
			'AUD': '17',
			'CAD': '18',
			'DKK': '19',
			'GBP': '21',
			'HTG': '20',
			'ZAR': '22',
			'PHP': '23',
		},
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { amount?: number };
			const rate = data.amount;
			assert.ok(rate, 'Unsupported currency');
			return rate;
		},
	},
	{
		name: 'kraken',
		label: 'Kraken',
		url: 'https://api.kraken.com/0/public/Ticker?pair={{FROM}}{{TO}}',
		convertSymbols: {
			BTC: 'XBT',
		},
		parseResponseBody: (body, currencies) => {
			const data = JSON.parse(body) as {
				error?: string[];
				result?: Record<string, { c?: string[] }>;
			};
			assert.deepStrictEqual(data.error, [], (data.error || []).join(', ') || 'Unexpected response body');
			const { FROM, TO } = currencies;
			const pair = data.result && data.result[`X${FROM}Z${TO}`];
			return pair && pair['c'] && pair['c'][0];
		},
	},
	{
		name: 'okx',
		label: 'OKX',
		url: 'https://www.okx.com/api/v5/market/index-tickers?instId={{FROM}}-{{TO}}',
		parseResponseBody: (body) => {
			const data = JSON.parse(body) as { code?: string; msg?: string; data?: { idxPx?: string }[] };
			assert.ok(data.code === '0', data.msg);
			const rate = data.data && data.data[0] && data.data[0].idxPx;
			assert.ok(rate, 'Unsupported currency pair');
			return rate;
		},
	},
];
