# Changelog

* v2.0.0:
	* Rewritten in TypeScript - type declarations are now published with the package
	* **Breaking**: Renamed the package to `coin-rates-ts`
	* **Breaking**: Removed: anycoin - its API is behind a Cloudflare bot challenge that no node HTTP client can pass
	* Fixed: bitstamp now answers an unknown currency pair with the ticker list for every market instead of an error
	* **Breaking**: The package is now ESM-only and requires node >= 20.19 (`require('coin-rates')` works from node 20.19 onwards)
	* **Breaking**: `main` now points at the compiled `dist/` output - deep imports such as `coin-rates/lib/fetch` are no longer available
	* Replaced the `async` dependency with a built-in retry helper - the package now has zero runtime dependencies
	* Replaced `http`/`https` with the native `fetch` API
* v1.2.0:
	* Added: anycoin, ibexmercado, okx
	* Removed: poloniex
	* Better handling of case where currency pair not supported
	* Upgraded dependencies
* v1.1.1:
	* Updated, removed dependencies
* v1.1.0:
	* Replace getValueAtPath with function to parse response body - improves flexibility of response parsing.
* v1.0.0:
	* Initial release
