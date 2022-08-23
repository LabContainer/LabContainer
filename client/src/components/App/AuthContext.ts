import { createContext } from "react";

export interface IUser {
    username: string,
    email: string,
    is_student: boolean
}

export interface IAuthContext {
    token: string,
    refresh_token: string,
    setToken: (new_token: string) => void,
    setRefreshToken: (new_token: string) => void,
    user?: IUser
}


// Default Auth Context
export const AuthContext = createContext<IAuthContext>({
    token: "",
    refresh_token: "",
    setToken: (new_token: string) => { },
    setRefreshToken: (new_token: string) => { },
    user: undefined
})

