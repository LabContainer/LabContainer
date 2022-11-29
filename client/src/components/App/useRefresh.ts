import { useState, useEffect, useContext } from "react"
import useAPI from "../../api"
import { AuthServiceAPI } from "../../constants"
import { AuthContext } from "./AuthContext"

export default function useRefresh(refresh_toggle: boolean) {
    const { refresh_token, setToken } = useContext(AuthContext)
    const [refresh, setRefresh] = useState(() => () => { })
    const {WebappApi} = useAPI()
    WebappApi.httpRequest.config.TOKEN = refresh_token;
    useEffect(()=>{
        const run = async () => {
            const tokens = await WebappApi.webappRefresh();
            const token = tokens.access_token || ""
            WebappApi.httpRequest.config.TOKEN = token;
            setToken(token)
        }
        run();
    }, [refresh_toggle])
}