import { useEffect, useState } from "react"
import { Community, isError, PaginationResponse, SearchResultResponse} from "../schema"
import { getCommunities, searchUsersAndCommunities } from "../remote"
import { CommunityCard } from "./CommunityCard"
import { Link } from "react-router-dom"

export const CommunityFeed = () => {
    const [data, setData] = useState<PaginationResponse<Community> | null>(null);
    const [filter, setFilter] = useState<string>("");
    const [filterResults, setFilterResults] = useState<SearchResultResponse>();

    useEffect(() => {
        let ignore = false;
        setData(null);
        const get = async () => {
            if (!ignore) {
                const json = await getCommunities();
                if (!isError(json)) {
                    setData(json);
                }
            }
        };
        get();
        return () => {
            ignore = true;
        };
    }, []);

    if (!data) {
        return <p>Loading...</p>;
    }

    const handleFilterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const search = await searchUsersAndCommunities(filter);
        if (isError(search)) {
            console.error("server error:", search);
        } else {
            setFilterResults(search);
        }
    };

    const { results } = data;
    const users = filterResults?.users
        ? filterResults.users.map((user) => <Link to={`/user/${user.username}`} className="text-white hover:text-pink-300">{user.username}</Link>)
        : [];
    const communities = filterResults?.communities
        ? filterResults.communities.map((comm) => (
            //   <div key={comm.id}>{comm.name}</div>
              <Link to={`/community/${comm.id}`} className="text-white hover:text-pink-300">{comm.name}</Link>
          ))
        : results.map((com) => <CommunityCard key={com.id} community={com} />);

    return (
        <div className="flex-col h-screen bg-[#342c33]">
            {/* Search Bar */}
            <div className="flex items-center p-4 gap-2.5">
                <form
                    onSubmit={handleFilterSubmit}
                    className="flex-grow"
                >
                    <input
                        type="text"
                        value={filter}
                        placeholder="Search"
                        onChange={(e) => setFilter(e.currentTarget.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
                    />
                </form>

                <Link
                    to="/community/create"
                    className="ml-auto text-white h-10 py-2.5 px-5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex hover:text-white hover:bg-[#d07db0]"
                >
                    Create Community
                </Link>
            </div>


            {/* Content Section (Make this scrollable) */}
            <div className="flex-1 p-4 overflow-y-auto">

                {users.length > 0 && (
                    <>
                        <h2 className="text-xl text-[#e78fcb] font-bold mb-2">
                            Users
                        </h2>
                        <div className="mb-4 flex flex-col gap-y-4">{users}</div>
                    </>
                )}

                {filterResults?.communities && (
                    <h2 className="text-xl text-[#e78fcb] font-bold mb-2">
                        Communities
                    </h2>
                )}
                {
                (filterResults?.communities && <div className="mb-4 flex flex-col gap-y-4">{communities}</div>) || 
                <div className="mb-4 flex flex-col gap-y-4">{communities}</div>}
            </div>
        </div>
    );
};
