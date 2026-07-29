# coin-rates

![Build Status](https://github.com/bleskomat/coin-rates-node/actions/workflows/tests.yml/badge.svg)

Fetch currency exchange rate for a coin/fiat currency pair in nodejs.

* [Requirements](#requirements)
* [Installation](#installation)
* [Usage](#usage)
* [Development](#development)
* [Tests](#tests)
* [Changelog](#changelog)
* [License](#license)


## Requirements

* nodejs >= 20.19

The package is written in TypeScript, published as ESM with type declarations, and has no runtime dependencies.


## Installation

Add to your application via `npm`:
```
npm install coin-rates --save
```
This will install `coin-rates` and add it to your application's `package.json` file.


## Usage

```js
import coinRates from 'coin-rates';

const rate = await coinRates.get({
	provider: 'kraken',
	currencies: {
		from: 'BTC',
		to: 'EUR',
	},
});
console.log(rate);
```

Named exports are available as well:
```ts
import { get, fetch, providers } from 'coin-rates';
import type { GetOptions, Provider } from 'coin-rates';
```

CommonJS applications can `require` the package from nodejs 20.19 onwards:
```js
const coinRates = require('coin-rates');
```

`get` caches the rate for a currency pair - by default for 5 minutes. Pass `cache: { maxAge }` to change that, or use `fetch` to always hit the provider.


## Development

Build the package to `dist/`:
```bash
npm run build
```

Check types without emitting:
```bash
npm run type-check
```


## Tests

Run automated tests as follows:
```bash
npm test
```
Note that the tests query the live provider APIs.


## Changelog

See [CHANGELOG.md](https://github.com/bleskomat/coin-rates-node/blob/master/CHANGELOG.md)


## License

This software is [MIT licensed](https://tldrlegal.com/license/mit-license):
> A short, permissive software license. Basically, you can do whatever you want as long as you include the original copyright and license notice in any copy of the software/source.  There are many variations of this license in use.
