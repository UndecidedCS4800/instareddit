import { LoaderFunction, useLoaderData } from "react-router-dom"
import { getPostComments, getPostComments2, ResponseOrError } from "../remote"
import { isError, Post as PostType } from "../schema"
import { PostCard } from "./PostCard"
import { Comments } from "./Comments"
export const loader: LoaderFunction<{ communityid?: string, postid: string, username?: string }> = async (args) => {
    const { communityid, postid, username } = args.params;

    const pid = Number(postid);
    if (isNaN(pid)) {
        throw { error: "Invalid post ID" };
    }

    try {
        let post;

        if (communityid) {
            // Call community API
            const cid = Number(communityid);
            if (isNaN(cid)) {
                throw { error: "Invalid community ID" };
            }
            post = await getPostComments(cid, pid);
        } else if (username) {
            // Call user API
            post = await getPostComments2(username, pid);
        } else {
            throw { error: "Route parameters are missing or invalid" };
        }

        return post;
    } catch (error) {
        console.error("Error fetching post:", error);
        throw { error: "Failed to fetch post data" };
    }
};



export const Post = () => {
    const data = useLoaderData() as ResponseOrError<PostType>;
    // fix me, see Community.tsx
    if (isError(data)) {
        return <p>{data.error}</p>
    }

    const { comments, ...post } = data
    return (
        <div className="h-screen overflow-y-auto flex-1 border border-[#514350] bg-[#342c33] overflow-hidden shadow-lg transition-transform transform">
            <PostCard privileged={false} post={post} />          
            {comments && <Comments comments={comments} />}
        </div>
    )

}