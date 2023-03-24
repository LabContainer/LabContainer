/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { AxiosHttpRequest } from './core/AxiosHttpRequest.js';

import { EnvironmentService } from './services/EnvironmentService.js';
import { LabsService } from './services/LabsService.js';
import { MilestonesService } from './services/MilestonesService.js';
import { RootService } from './services/RootService.js';
import { TeamsService } from './services/TeamsService.js';

type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;

export class AnalyticsService {

    public readonly environment: EnvironmentService;
    public readonly labs: LabsService;
    public readonly milestones: MilestonesService;
    public readonly root: RootService;
    public readonly teams: TeamsService;

    public readonly request: BaseHttpRequest;

    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = AxiosHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? '',
            VERSION: config?.VERSION ?? '0.1.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });

        this.environment = new EnvironmentService(this.request);
        this.labs = new LabsService(this.request);
        this.milestones = new MilestonesService(this.request);
        this.root = new RootService(this.request);
        this.teams = new TeamsService(this.request);
    }
}

