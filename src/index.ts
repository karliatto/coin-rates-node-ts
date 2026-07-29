import { fetchRate } from './fetch.js';
import { getRate } from './get.js';
import { providers } from './providers.js';

export { fetchRate as fetch, getRate as get, providers };
export * from './types.js';

export default { fetch: fetchRate, get: getRate, providers };
