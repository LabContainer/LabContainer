export const NO_ADDITIONAL_SESSIONS = 'no_additional';
export const NO_USER_TEAMS = 'no_user_team'
export const NO_TOKEN = 'no_token'
export const INVALID_TOKEN = 'invalid_token'
export const AnalyticsServiceAPI = process.env.ENVIRONMENT === 'production' ? "https://api.labcontainer.dev/analytics" : "http://localhost:8000"; 