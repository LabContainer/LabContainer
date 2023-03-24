/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Milestone } from '../models/Milestone';
import type { MilestoneCreate } from '../models/MilestoneCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class MilestonesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Create Milestone
     * @param requestBody
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public milestonesCreateMilestone(
        requestBody: MilestoneCreate,
    ): CancelablePromise<Milestone> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/milestones/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Milestones
     * @param labId
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public milestonesGetMilestones(
        labId: string,
    ): CancelablePromise<Array<Milestone>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/milestones',
            query: {
                'lab_id': labId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Milestone
     * @param milestoneId
     * @returns Milestone Successful Response
     * @throws ApiError
     */
    public milestonesGetMilestone(
        milestoneId: string,
    ): CancelablePromise<Milestone> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/milestones/{milestone_id}',
            path: {
                'milestone_id': milestoneId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Milestone
     * @param milestoneId
     * @returns any Successful Response
     * @throws ApiError
     */
    public milestonesDeleteMilestone(
        milestoneId: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/milestones/{milestone_id}',
            path: {
                'milestone_id': milestoneId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Patch Milestone
     * @param milestoneId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public milestonesPatchMilestone(
        milestoneId: string,
        requestBody: MilestoneCreate,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/milestones/{milestone_id}',
            path: {
                'milestone_id': milestoneId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
