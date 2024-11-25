import { useEffect, useState } from "react"
import { FeedNav } from "./FeedNav"
import { CommunityFeed } from "./CommunityFeed"
import { isError, JWTTokenResponse, PaginationResponse, Post } from "../schema"
import { getRecentPosts } from "../remote"
import { useAuth } from "./auth"
import { Posts } from "./Posts"

export type FeedViews = "recent" | "community" 

const getView = (s: FeedViews, auth: JWTTokenResponse | null, posts: Post[]): React.ReactNode => {
    switch (s) {
        case "recent":
            if (!auth) {
                return <div>Login to see recent posts from your communities and friends.</div>
            }
            return <Posts privileged={false} posts={posts ? posts : []}/>
        case "community":
            return <CommunityFeed />
    }
}

export const CenterPane = () => {
    const [view, setView] = useState<FeedViews>("recent")
    const [posts, setPosts] = useState<PaginationResponse<Post> | null>(null)
    const auth = useAuth()

    useEffect(() => {
        let ignore = false;
        setPosts(null)
        const get = async () => {
            if (!ignore && auth) {
                const json = await getRecentPosts(auth.token)
                if (!isError(json)) {
                    setPosts(json)
                }
            }
        }
        get()
        return () => {
            ignore = true
        }
    },[auth])

    const setViewHandler = (s: FeedViews) => {
        switch (s) {
            case "recent":
                setView("recent")
                break;
            case "community":
                setView("community")
                break;
        }
    }

    const v = getView(view, auth, posts? posts.results : [])

    return (
        <div id="centerpane" className='h-full basis-8/12'>
            <FeedNav viewSetter={setViewHandler} activeView={view} />
            <div>
                {v}
            </div>
        </div>
    )
}