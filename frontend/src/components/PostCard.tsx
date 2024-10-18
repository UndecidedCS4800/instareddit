import { Post } from "../schema"
import ProfileLink from "./ProfileLink"

type PostCardProps = {
    post: Post
    link?: boolean
}

const Elem = ({link, username, children}: { link?: boolean, username: string, children: React.ReactNode }) => {
    return link ? <ProfileLink user={username}>{children}</ProfileLink> : <div>{children}</div>
}
export const PostCard = ({post, link}: PostCardProps) => {
    // TODO?: truncate post preview text
    const { datetime, image,  username, text } = post

    return (
        <Elem link={link} username={username}>
            <div className="px-4 py-4 justify-start items-center gap-5 flex">
                <div className="text-white text-xl font-bold font-sans">{username}</div>
                {image && <img className="h-[350px] w-full object-cover"src={image} />}
                <div className="ml-auto">{datetime}</div>
            </div>
            <div className="px-4 py-2 text-pink-800 flex">{text}</div>
        </Elem>
    )
}
