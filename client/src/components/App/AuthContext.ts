import { createContext } from "react";

// Default Auth Context
export const AuthContext = createContext({
    token: "",
    setToken: (new_token: string) => { },
    username: "",
    setUsername: (new_username: string) => { }
})