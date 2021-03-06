import { denormalize } from 'normalizr';
import { ApiDataState } from '../reducer';
import { EndpointParams } from '../index';
import { getApiDataRequest } from '../selectors/getApiDataRequest';

const __DEV__ = process.env.NODE_ENV === 'development';

/**
 * Get the de-normalized result data of an endpoint, or undefined if not (yet) available. This value is automatically
 * bind when using {@link withApiData}. This selector can be useful for getting response responseBody values when a request is
 * triggered manually, like a POST after a button click.
 */
export const getResultData = (apiDataState: ApiDataState, endpointKey: string, params?: EndpointParams): any | any[] | void => {
    const config = apiDataState.endpointConfig[endpointKey];
    const request = getApiDataRequest(apiDataState, endpointKey, params);

    if (!config) {
        if (__DEV__) {
            console.warn(`apiData.getResult: configuration of endpoint ${endpointKey} not found.`);
        }
        return;
    }

    if (!request || !request.result) {
        return;
    }

    return request.result && (
        config.responseSchema
            ? denormalize(request.result, config.responseSchema, apiDataState.entities)
            : request.result
    );
};