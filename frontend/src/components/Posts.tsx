import { Post } from "../schema";
import { PostCard } from "./PostCard";

interface PostProps {
    posts: Post[]
    privileged: boolean
}

export const Posts = ({posts, privileged}: PostProps) => {
    return (
        <div>
            {posts.map(p => <PostCard link privileged={privileged} key={p.id} post={p} />)}
        </div>
    )
}