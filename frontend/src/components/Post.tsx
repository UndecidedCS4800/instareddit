import { LoaderFunction, useLoaderData } from "react-router-dom"
import { getPostComments, ResponseOrError } from "../remote"
import { isError, Post as PostType } from "../schema.ts"
import { PostCard } from "./PostCard"
import { Comments } from "./Comments.tsx"
export const loader: LoaderFunction<{ communityid: string, postid: string }> = async (args) => {
    const { communityid, postid } = args.params
    const cid = Number(communityid as string)
    const pid = Number(postid as string)

    if (isNaN(cid) || isNaN(pid)) {
        throw { error: "Invalid community id or invalid post id"}
    }

    const post = await getPostComments(cid, pid)

    return post;

}

export const Post = () => {
    const data = useLoaderData() as ResponseOrError<PostType>;
    // fix me, see Community.tsx
    if (isError(data)) {
        return <p>{data.error}</p>
    }

    const { comments, ...post } = data
    return (
        <div>
            <PostCard post={post} />
            {comments && <Comments comments={comments} />}
        </div>
    )

}