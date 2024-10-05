import { Post } from "../schema"
import { Card } from "./Card"

type PostCardProps = {
    post: Post
    link?: boolean
}

const Elem = ({link, to, children}: { link?: boolean, to: string, children: React.ReactNode }) => {
    return link ? <Card to={to}>{children}</Card> : <div>{children}</div>
}
export const PostCard = ({post, link}: PostCardProps) => {
    // TODO?: truncate post preview text
    const { datetime, image, user, text } = post

    return (
        <Elem link={link} to={`posts/${post.id}`}>
            {image && <img src={image} />}
            {text}
            {user}
            {datetime}
        </Elem>
    )
}