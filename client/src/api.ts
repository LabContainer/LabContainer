// api file

import { AnalyticsService } from "./clients/AnalyticsClient";
import { AuthService } from "./clients/AuthClient";
import useToken from "./components/App/useToken";
import { AuthServiceAPI, AnalyticsServiceAPI } from "./constants";
import axios, { RawAxiosRequestHeaders } from "axios";

export default function useAPI() {

    const { token, refresh_token, setToken } = useToken();

    // AUTH
    const auth = new AuthService({
        BASE: AuthServiceAPI,
        TOKEN: token
    });

    const UserApi = auth.users;
    const WebappApi = auth.webapp;

    // Add refresh token interceptor in axios
    axios.interceptors.response.use(
        response => response,
        error => {
            const status = error.response ? error.response.status : null
            const originalRequest = error.config;
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                // Set token to refresh token
                WebappApi.httpRequest.config.TOKEN = refresh_token;
                return WebappApi.webappRefresh().then(res => {
                    console.log("Refreshed token")

                    // Set token to access token
                    WebappApi.httpRequest.config.TOKEN = res.access_token;
                    setToken(res.access_token || "");

                    // Set token to access token
                    originalRequest.headers['Authorization'] = `Bearer ${res.access_token}`;
                    originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {})) as RawAxiosRequestHeaders
                    console.log("Sending request with new token")
                    // axios.request(originalRequest);
                    return axios(originalRequest);
                    // return axios.request(originalRequest);
                })
            }
            return Promise.reject(error);
        });


    // Analytics
    const analytics = new AnalyticsService({
        BASE: AnalyticsServiceAPI,
        TOKEN: token,

    });
    // use interceptors to add token to request
    const TeamsApi = analytics.teams;
    const LabsApi = analytics.labs;
    const EnvironmentApi = analytics.environment;

    return {
        UserApi,
        WebappApi,
        TeamsApi,
        LabsApi,
        EnvironmentApi
    }
}