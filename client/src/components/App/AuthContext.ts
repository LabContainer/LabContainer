import { createContext } from "react";

interface User {
    username: string,
    email: string,
    is_student: string
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
        is_student: ""
    },
    setUser: (user: User) => { }
})