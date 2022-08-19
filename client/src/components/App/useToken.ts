import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        return sessionStorage.getItem('access_token') || ""
    }
    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        sessionStorage.setItem('access_token', userToken)
        setToken(userToken)
    }
    const getRefreshToken = () => {
        return localStorage.getItem('refresh_token') || ""
    }
    const [refresh_token, setRefreshToken] = useState(getRefreshToken());

    const saveRefreshToken = (userToken: string) => {
        localStorage.setItem('refresh_token', userToken)
        setRefreshToken(userToken)
    }

    return {
        token,
        refresh_token,
        setToken: saveToken,
        setRefreshToken: saveRefreshToken
    }
}