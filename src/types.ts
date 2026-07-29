export type CurrencyPair = {
	from: string;
	to: string;
};

/**
 * A currency pair expanded into the lower- and upper-case forms used when
 * building a provider's request URL - e.g. `{{from}}` and `{{FROM}}`.
 */
export type FormattedCurrencies = {
	from: string;
	FROM: string;
	to: string;
	TO: string;
};

export type ParseResponseBody = (body: string, currencies: FormattedCurrencies) => string | number | null | undefined;

export type Provider = {
	name: string;
	label: string;
	url: string;
	/**
	 * Maps a standard currency symbol to the symbol used by the provider.
	 */
	convertSymbols?: Record<string, string>;
	parseResponseBody?: ParseResponseBody;
};

export type RetryOptions = {
	/**
	 * Return `true` to retry the failed request, `false` to fail immediately.
	 */
	errorFilter: (error: unknown) => boolean;
	/**
	 * Milliseconds to wait between attempts.
	 */
	interval: number;
	/**
	 * Maximum number of attempts - including the first one.
	 */
	times: number;
};

export type CacheOptions = {
	/**
	 * Milliseconds before a cached rate is considered stale. Set to `0` to
	 * never expire cached rates.
	 */
	maxAge?: number;
};

export type FetchOptions = {
	currencies: CurrencyPair;
	provider: string;
	retry?: Partial<RetryOptions>;
};

export type GetOptions = FetchOptions & {
	cache?: CacheOptions;
};

export type Rate = string | null;
