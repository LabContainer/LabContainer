import { createContext } from "react";

export interface User {
    username: string,
    email: string,
    is_student: boolean
}

// Default Auth Context
export const AuthContext = createContext({
    token: "",
    refresh_token: "",
    setToken: (new_token: string) => { },
    setRefreshToken: (new_token: string) => { },
    user: {
        username: "",
        email: "",
        is_student: false
    }
})

