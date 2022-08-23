import { useContext, useEffect, useState } from "react"
import { AuthContext } from "./AuthContext"
import useRefresh from "./useRefresh"


export default function useData(
  base_url: string,
  api_url: string,
  init?: RequestInit | undefined
) {
  const [data, setData] = useState()
  const refresh = useRefresh()
  const { token, refresh_token, setToken } = useContext(AuthContext)
  useEffect(() => {
    const fetchData = async (
      base_url: string,
      api_url: string,
      token: string,
      refresh_token: string,
      setToken: (new_token: string) => void,
      init?: RequestInit | undefined
    ) => {
      const url: URL = new URL(api_url, base_url)
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        ...init
      })
      if (response.ok) {
        const json = await response.json()
        return json
      } else {
        if (response.status === 401) {
          //Try refresh
          refresh()
        }
        return undefined
      }
    }
    fetchData(base_url, api_url, token, refresh_token, setToken, init).then(setData)
  }, [setData, token, refresh_token, setToken, api_url, base_url, init, refresh])
  return data
}