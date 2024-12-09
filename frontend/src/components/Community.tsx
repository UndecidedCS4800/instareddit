import { Outlet, useLoaderData } from "react-router"
import { getCommunity, getCommunityPosts } from "../remote"
import { isError } from "../schema"
import { CommunityCard } from "./CommunityCard"
import React from "react"
import { Link, LoaderFunction, useParams } from "react-router-dom"
import { Posts } from "./Posts"

type LoaderParams = {
    communityid: string,
}

export const loader: LoaderFunction<LoaderParams> = async (args) => {
    const { communityid } = args.params;
    const cid = Number(communityid as string)
    if (isNaN(cid)) {
        // fix me
        throw { error: "Invalid community id!"}
    }
    const community = getCommunity(cid)
    const posts = getCommunityPosts(cid)
    const [c, p] = await Promise.all([community, posts])
    // fix
    return {community: c, posts: p}
}

//fix me: should be just { Community and Posts } but 
//        we haven't checked for errors yet
type LoaderData = {
    community: Awaited<ReturnType<typeof getCommunity>>
    posts: Awaited<ReturnType<typeof getCommunityPosts>>
}

export const Community = () => {
    // fixme: error should be unwrapped
    const { community, posts } = useLoaderData() as LoaderData
    const { postid }= useParams()

    //fix me: failure should be handled in loader
    if (isError(community)) {
        return <div>Error: {community.error}</div>
    }

    if (isError(posts)) {
        return <div>Error: {posts.error}</div>
    }
    
    if (postid) {
        return <Outlet />
    }

    // TODO: add pagination support
    return (
        <React.Fragment>
            <Link to="posts/create">Create Post</Link>
            <CommunityCard community={community} />
            <Posts posts={posts.results} />
            <Outlet />
        </React.Fragment>
    )
}