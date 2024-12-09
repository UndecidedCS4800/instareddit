import { Post } from "../schema";
import { PostCard } from "./PostCard";

type PostProps = {
    posts: Post[]
}

export const Posts = ({posts}: PostProps) => {
    return (
        <div>
            {posts.map(p => <PostCard link key={p.id} post={p} />)}
        </div>
    )
}