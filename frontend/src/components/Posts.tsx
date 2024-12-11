import { Post } from "../schema";
import { PostCard } from "./PostCard";
import { PostHeader } from "./PostHeader";

interface PostProps {
    posts: Post[]
    privileged: boolean
}

export const Posts = ({posts, privileged}: PostProps) => {
    return (
        <div className="flex flex-col items-center gap-y-5 my-5">
            {posts.map(p => <PostCard link privileged={privileged} key={p.id} post={p} />)}
        </div>
    )
}