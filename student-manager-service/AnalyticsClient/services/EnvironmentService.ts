/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Environment } from '../models/Environment';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EnvironmentService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get Environment
     * @param teamName
     * @param username
     * @returns Environment Successful Response
     * @throws ApiError
     */
    public environmentGetEnvironment(
        teamName: string,
        username: string,
    ): CancelablePromise<Environment> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/environment/{team_name}/{username}',
            path: {
                'team_name': teamName,
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Env
     * @param teamName
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public environmentDeleteEnv(
        teamName: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/environment/{team_name}/{username}',
            path: {
                'team_name': teamName,
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Report Active Environment
     * Endpoint for frontend to report active status of environment
     * If not reported within a time limit, env automatically deleted
     * On active reports, time limit is reset and env is saved
     * @param teamName
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public environmentReportActiveEnvironment(
        teamName: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/environment/{team_name}/{username}/active',
            path: {
                'team_name': teamName,
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
