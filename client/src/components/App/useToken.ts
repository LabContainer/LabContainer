import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        return sessionStorage.getItem('access_token') || ""
    }
    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState({
        username: "",
        email: "",
        is_student: false
    });

    const saveToken = (userToken: string) => {
        sessionStorage.setItem('access_token', userToken)
        setToken(userToken)
        let payload = jwtPayload(userToken)
        setUser({
            username: payload.user,
            is_student: payload.is_student,
            email: payload.email
        })
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
        setRefreshToken: saveRefreshToken,
        user
    }
}

export function jwtPayload(t: string) {
    return JSON.parse(window.atob(t.split('.')[1]));
}