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
        return (
            /*<div className="flex flex-wrap justify-center gap-4 p-4">
                <CommunityCard community={sampleCommunity} />
            
            </div> */
            //comment out below and un comment above to view sample post
            <p>Loading</p>
        ); 
        //
    }

    const { results } = data;
    return (
        <div>
            {results.map(com => <CommunityCard key={com.id} community={com} />)}
        </div>
    )
}

const sampleCommunity = {
    id: 1,
    name: "Mark",
    description: "I am Adam.",
    picture: "./public/Frame35.png" // Placeholder image URL
};