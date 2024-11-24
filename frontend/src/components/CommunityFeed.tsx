import { useEffect, useState } from "react"
import { Community, isError, PaginationResponse, SearchResultResponse} from "../schema"
import { getCommunities, searchUsersAndCommunities } from "../remote"
import { CommunityCard } from "./CommunityCard"

export const CommunityFeed = () => {
    const [data, setData] = useState<PaginationResponse<Community> | null>(null)
    const [filter, setFilter] = useState<string>("")
    const [filterResults, setFilterResults] = useState<SearchResultResponse>()

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

    const handleFilterSubmit = async () => {
        const search = await searchUsersAndCommunities(filter)
        if (isError(search)) {
            console.error("server error:", search)
        } else {
            setFilterResults(search)
        }

    }

    const { results } = data;
    const users = filterResults ? () => (filterResults.users.map(user => <div key={user}>{user}</div>)) : () => ([])
    const communities = filterResults ? () => (filterResults.communities.map(comm => <div key={comm.id}>{comm.name}</div>)) : () => results.map(com => <CommunityCard key={com.id} community={com} />)

    return (
        <>
        <form onSubmit={handleFilterSubmit}>
            <input type="text" value={filter} placeholder="search" onChange={e => setFilter(e.currentTarget.value)}></input>
        </form>
        <div>
            {users.length > 0 ? <><h2>Users</h2>{users()}</> : <></>}
            {filterResults && <h2>Communities</h2>}
            {communities()}
        </div>
        </>
    )
}
