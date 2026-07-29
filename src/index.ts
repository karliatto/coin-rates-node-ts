import { fetchRate } from './fetch';
import { getRate } from './get';
import { providers } from './providers';

export { fetchRate as fetch, getRate as get, providers };
export * from './types';

export default { fetch: fetchRate, get: getRate, providers };
