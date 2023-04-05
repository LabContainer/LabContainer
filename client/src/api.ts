// api file

import { AnalyticsService, CancelablePromise } from "./clients/AnalyticsClient";
import { AuthService, LoginAccess, WebappService } from "./clients/AuthClient";
import useToken from "./components/App/useToken";
import { AuthServiceAPI, AnalyticsServiceAPI } from "./constants";
import axios, { RawAxiosRequestHeaders } from "axios";
import React from "react";
import { AuthContext } from "./components/App/AuthContext";

export default function useAPI() {

    const { token, refresh_token, setToken } = React.useContext(AuthContext);

    // State for refresh status
    const [refreshing, setRefreshing] = React.useState(false);

    // States for API
    const [auth, setAuth] = React.useState<AuthService>(new AuthService({
        BASE: AuthServiceAPI,
        TOKEN: token
    }));
    const [analytics, setAnalytics] = React.useState<AnalyticsService>(new AnalyticsService({
        BASE: AnalyticsServiceAPI,
        TOKEN: token,
    }));

    React.useEffect(() => {

        // AUTH
        const auth = new AuthService({
            BASE: AuthServiceAPI,
            TOKEN: token
        });

        // Analytics
        const analytics = new AnalyticsService({
            BASE: AnalyticsServiceAPI,
            TOKEN: token,
        });

        setAuth(auth);
        setAnalytics(analytics);
    }, [token])


    const UserApi = auth.users;
    const WebappApi = auth.webapp;
    const TeamsApi = analytics.teams;
    const LabsApi = analytics.labs;
    const EnvironmentApi = analytics.environment;
    const MilestonesApi = analytics.milestones

    React.useEffect(() => {
        let refreshEvent: RefreshEvent | null = null;

        // use interceptors to add token to request, change retry for refresh requests
        const reqIn = axios.interceptors.request.use(
            request => {
                if (request.url?.includes('/webapp/refresh')) {
                    (request as any)._retry = true;
                    return request;
                }

                //@ts-ignore
                if (refreshEvent && !request._retry) {
                    // non retry requests to wait until refresh is done
                    return refreshEvent.subscribe((token) => {
                        request.headers['Authorization'] = `Bearer ${token}`;
                        //@ts-ignore
                        request.headers = JSON.parse(JSON.stringify(request.headers || {})) as RawAxiosRequestHeaders
                        return Promise.resolve(request);
                    })
                }
                // add token to request if it doesn't already exist in headers
                if (token && !request.headers.Authorization) {
                    console.log("adding token to request")
                    request.headers['Authorization'] = `Bearer ${token}`;
                    //@ts-ignore
                    request.headers = JSON.parse(JSON.stringify(request.headers || {})) as RawAxiosRequestHeaders
                }

                return request;
            },
            error => error
        )

        // Add refresh token interceptor in axios
        const resIn = axios.interceptors.response.use(
            response => response,
            error => {
                const status = error.response ? error.response.status : null
                const originalRequest = error.config;
                if (status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/webapp/login')) {
                    originalRequest._retry = true;

                    // If new token not requested, create new refresh event
                    if (!refreshEvent) {
                        refreshEvent = new RefreshEvent(refresh_token, WebappApi);
                        console.log("creating refresh event")
                        refreshEvent.subscribe((token) => {
                            // set new token
                            setToken(token);
                            return Promise.resolve();
                        }).catch(err => {
                            console.error(err)
                            // Logout
                            setToken("");
                        })
                    }

                    // Add request retry to refresh event queue
                    return refreshEvent.subscribe((token) => {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {})) as RawAxiosRequestHeaders
                        return axios(originalRequest);
                    }).catch(err => {
                        console.error(err)
                        return Promise.reject(err);
                    })
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(reqIn);
            axios.interceptors.response.eject(resIn);
        }
    }, [token, refresh_token])


    return {
        UserApi,
        WebappApi,
        TeamsApi,
        LabsApi,
        EnvironmentApi,
        MilestonesApi
    }
}

class RefreshEvent {
    is_refreshing: boolean;
    token: string;
    refreshPromise: Promise<void> | null;

    constructor(refresh_token: string, WebappApi: WebappService) {
        this.is_refreshing = true;
        this.token = "";
        WebappApi.httpRequest.config.TOKEN = refresh_token;
        this.refreshPromise = WebappApi.webappRefresh().then(res => {
            // Set token to access token
            WebappApi.httpRequest.config.TOKEN = res.access_token;
            this.token = res.access_token || "";
            this.is_refreshing = false;

            // trigger events
            this.trigger();
        })
    }

    trigger() {
        // trigger events
        // Maybe not needed ? currently polling every 100ms in subscription
        // not perfect but works (i think)
    }

    subscribe(executor: (token: string) => Promise<any>) {
        // subscribe to this event
        if (this.is_refreshing) {
            return new Promise((resolve, reject) => {

                const interval = setInterval(() => {
                    if (!this.is_refreshing) {
                        clearInterval(interval);
                        executor(this.token).then(res => {
                            resolve(res);
                        }).catch(err => {
                            reject(err);
                        })
                    }
                }, 100);
            })
        } else
            return executor(this.token);
    }
}