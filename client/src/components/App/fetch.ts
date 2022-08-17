
export default async function fetchData(
  token: string,
  setToken: (new_token: string) => void,
  input: RequestInfo | URL,
  init?: RequestInit | undefined
) {
  const response = await fetch(input, {
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
      // Logout
      setToken("")
    }
    return undefined
  }

}