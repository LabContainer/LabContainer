/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class RootService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Root
     * @returns any Successful Response
     * @throws ApiError
     */
    public rootRoot(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/',
        });
    }

}
