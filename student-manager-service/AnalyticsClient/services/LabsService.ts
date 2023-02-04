/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Lab } from '../models/Lab';
import type { LabCreate } from '../models/LabCreate';
import type { MilestoneCreate } from '../models/MilestoneCreate';
import type { String } from '../models/String';
import type { TeamCreate } from '../models/TeamCreate';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class LabsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Lab
     * @param requestBody
     * @returns String Successful Response
     * @throws ApiError
     */
    public labsCreateLab(
        requestBody: LabCreate,
    ): CancelablePromise<String> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/labs/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Lab
     * @param labId
     * @returns LabCreate Successful Response
     * @throws ApiError
     */
    public labsGetLab(
        labId: string,
    ): CancelablePromise<LabCreate> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/labs/{lab_id}',
            path: {
                'lab_id': labId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Lab Users
     * @param labId
     * @returns User Successful Response
     * @throws ApiError
     */
    public labsGetLabUsers(
        labId: string,
    ): CancelablePromise<Array<User>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/labs/{lab_id}/users',
            path: {
                'lab_id': labId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Lab User
     * @param labId
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public labsAddLabUser(
        labId: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/labs/{lab_id}/users',
            path: {
                'lab_id': labId,
            },
            query: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Lab User
     * @param labId
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public labsDeleteLabUser(
        labId: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/labs/{lab_id}/users',
            path: {
                'lab_id': labId,
            },
            query: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Labs
     * @param username
     * @returns Lab Successful Response
     * @throws ApiError
     */
    public labsGetLabs(
        username?: string,
    ): CancelablePromise<Array<Lab>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/labs',
            query: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Lab Teams
     * @param labId
     * @returns TeamCreate Successful Response
     * @throws ApiError
     */
    public labsGetLabTeams(
        labId: string,
    ): CancelablePromise<Array<TeamCreate>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/labs/{lab_id}/teams',
            path: {
                'lab_id': labId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Lab Milestones
     * @param labId
     * @returns MilestoneCreate Successful Response
     * @throws ApiError
     */
    public labsGetLabMilestones(
        labId: string,
    ): CancelablePromise<Array<MilestoneCreate>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/labs/{lab_id}/milestones',
            path: {
                'lab_id': labId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
