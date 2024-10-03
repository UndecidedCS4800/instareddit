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
            <div className="px-4 py-4 justify-start items-center gap-5 flex">
                <div className="text-white text-xl font-bold font-sans">{user}</div>
                {image && <img className="h-[350px] w-full object-cover"src={image} />}
                <div className="ml-auto">{datetime}</div>
            </div>
            <div className="px-4 py-2 text-pink-800 flex">{text}</div>
        </Elem>
    )
}
