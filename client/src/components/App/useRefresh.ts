import { useState, useEffect, useContext } from "react"
import { AuthServiceAPI } from "../../constants"
import { AuthContext } from "./AuthContext"

export default function useRefresh() {
    const { refresh_token, setToken } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(() => () => { })
    useEffect(() => {
        async function refresh(base_url: string, refresh_token: string, setToken: (new_token: string) => void) {
            const response = await fetch(`${base_url}/webapp/refresh`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${refresh_token}`
                }
            })
            if (response.ok) {
                const json = await response.json()
                setToken(json.access_token)
            } else {
                if (Math.floor(response.status / 100) === 4) {
                    // Logout
                    setToken("")
                }
                return undefined
            }
        }
        const caller = () => {
            refresh(AuthServiceAPI, refresh_token, setToken)
        }
        setRefresh(() => caller)
    }, [refresh_token, setToken, setRefresh])
    return refresh
}