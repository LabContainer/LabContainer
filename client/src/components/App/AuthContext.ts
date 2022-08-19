import { createContext } from "react";

// Default Auth Context
export const AuthContext = createContext({
    token: "",
    refresh_token: "",
    setToken: (new_token: string) => { },
    setRefreshToken: (new_token: string) => { }
})