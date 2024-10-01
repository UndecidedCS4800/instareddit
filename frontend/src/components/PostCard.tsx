import { Post } from "../schema"
import { Card } from "./Card"

type PostCardProps = {
    post: Post
}
export const PostCard = ({post}: PostCardProps) => {
    // TODO?: truncate post preview text
    const { datetime, image, user, text } = post
    return (
        <Card>
            {image && <img src={image} />}
            {text}
            {user}
            {datetime}
        </Card>
    )
}