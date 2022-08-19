
export default async function fetchData(
  base_url: string,
  api_url: string,
  token: string,
  refresh_token: string,
  setToken: (new_token: string) => void,
  init?: RequestInit | undefined
) {
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
      await refresh(base_url, refresh_token, setToken)
    }
    return undefined
  }

}

export async function refresh(base_url: string, refresh_token: string, setToken: (new_token: string) => void) {
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