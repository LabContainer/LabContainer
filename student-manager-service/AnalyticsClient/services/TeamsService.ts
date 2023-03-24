/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LabCreate } from '../models/LabCreate';
import type { Team } from '../models/Team';
import type { TeamCreate } from '../models/TeamCreate';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class TeamsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * Get Team
     * @param teamName
     * @returns Team Successful Response
     * @throws ApiError
     */
    public teamsGetTeam(
        teamName: string,
    ): CancelablePromise<Team> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{team_name}',
            path: {
                'team_name': teamName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User Teams
     * @param username
     * @returns TeamCreate Successful Response
     * @throws ApiError
     */
    public teamsGetUserTeams(
        username: string,
    ): CancelablePromise<Array<TeamCreate>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/',
            query: {
                'username': username,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create New Team
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public teamsCreateNewTeam(
        requestBody: TeamCreate,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/teams/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Join Team
     * @param teamName
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public teamsJoinTeam(
        teamName: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/teams/{team_name}/join',
            path: {
                'team_name': teamName,
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
     * Leave Team
     * @param teamName
     * @param username
     * @returns any Successful Response
     * @throws ApiError
     */
    public teamsLeaveTeam(
        teamName: string,
        username: string,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/teams/{team_name}/leave',
            path: {
                'team_name': teamName,
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
     * Get Team Lab
     * @param teamName
     * @returns LabCreate Successful Response
     * @throws ApiError
     */
    public teamsGetTeamLab(
        teamName: string,
    ): CancelablePromise<LabCreate> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/teams/{team_name}/lab',
            path: {
                'team_name': teamName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Next Milestone
     * @param teamName
     * @returns Team Successful Response
     * @throws ApiError
     */
    public teamsNextMilestone(
        teamName: string,
    ): CancelablePromise<Team> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/teams/{team_name}/next',
            path: {
                'team_name': teamName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
