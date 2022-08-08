import { useState } from "react";

export default function useToken() {
    const getToken = () => {
        return sessionStorage.getItem('access_token')
    }
    const [token, setToken] = useState(getToken());

    const saveToken = (userToken: string) => {
        sessionStorage.setItem('access_token', userToken)
        setToken(userToken)
    }

    return {
        token,
        setToken: saveToken
    }
}