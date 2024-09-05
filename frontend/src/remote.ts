import { Teammate } from "./schema"

const URL = `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_BACKEND_PORT}`

export const getData = async (): Promise<Teammate[]> => {
    const get = await fetch(URL+"/api", {
        method: 'GET',
        headers: {
            'Content-Type': "application/json"
        },
    })

    const json = await get.json();
    return json as Teammate[]
}