import { useEffect, useState } from "react"
import { Community, isError, PaginationResponse} from "../schema"
import { getCommunities } from "../remote"
import { CommunityCard } from "./CommunityCard"

export const CommunityFeed = () => {
    const [data, setData] = useState<PaginationResponse<Community> | null>(null)

    useEffect(() => {
        let ignore = false;
        setData(null)
        const get = async () => {
            if (!ignore) {
                const json = await getCommunities()
                if (!isError(json)) {
                    setData(json)
                }
            }
        }
        get()
        return () => {
            ignore = true
        }
    }, [])

    if (!data) {
        return <p>Loading</p>
    }

    const { results } = data;
    return (
        <div>
            {results.map(com => <CommunityCard key={com.id} community={com} />)}
        </div>
    )
}