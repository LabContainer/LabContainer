import { useState } from "react";
import { IUser } from "./AuthContext";

export default function useToken() {
    const getAuth = () => {
        const token = sessionStorage.getItem('access_token') || ""
        if (token === "")
            return { token, undefined }
        let payload = jwtPayload(token)
        const user = {
            username: payload.user,
            is_student: payload.is_student,
            email: payload.email
        }
        return { token, user }
    }
    const [token, setToken] = useState(getAuth().token);
    const [user, setUser] = useState<IUser | undefined>(getAuth().user);

    const saveToken = (userToken: string) => {
        sessionStorage.setItem('access_token', userToken)
        setToken(userToken)
        if (userToken !== "") {
            let payload = jwtPayload(userToken)
            setUser({
                username: payload.user,
                is_student: payload.is_student,
                email: payload.email
            })
        } else {
            setUser(undefined)
        }
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