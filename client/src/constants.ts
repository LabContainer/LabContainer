// File to contain any constants needed

// export const AuthServiceAPI = "http://localhost:5000"
// export const AnalyticsServiceAPI = "http://localhost:8000"
// export const StudentServiceAPI = "ws://localhost:8080"
export const AuthServiceAPI = process.env.NODE_ENV === 'production' ? "https://api.labcontainer.dev/auth" : "http://localhost:5000";
export const AnalyticsServiceAPI = process.env.NODE_ENV === 'production' ? "https://api.labcontainer.dev/analytics" : "http://localhost:8000";