import { useRevalidator } from "react-router-dom"
import { removePost } from "../remote"
import { isError, Post } from "../schema"
import { useAuth } from "./auth"
import { Card } from "./Card"
import ProfileLink from "./ProfileLink"

type PostCardProps = {
    post: Post
    link?: boolean
    privileged: boolean
}

const Elem = ({ link, to, children }: { link?: boolean, to: string, children: React.ReactNode }) => {
    return link ? <Card to={to}>{children}</Card> : <div>{children}</div>
}

export const PostCard = ({ post, privileged = false, link }: PostCardProps) => {
    const { datetime, image, username, text, community, id } = post
    const auth = useAuth()
    const validator = useRevalidator()

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (auth) {
            const resp = await removePost(auth.token, community, id)
            if (!isError(resp)) {
                validator.revalidate()
            } else {
                console.error("server error", resp)
            }
        }
    }

    // Determine the link to use: Community or User link
    const linkTo = community
        ? `/community/${community}/posts/${id}`
        : `/user/${username}/posts/${id}`

    return (
        <Elem link={link} to={linkTo}>
            {auth && privileged && <button onClick={handleRemove}>rm</button>}
            <div className="px-4 py-4 justify-start items-center gap-5 flex">
                <ProfileLink user={username} className="font-bold text-[#e78fcb] hover:text-white text-xl">
                    {username}
                </ProfileLink>
                {image && <img className="h-[350px] w-full object-cover" src={image} />}
                <div className="ml-auto text-white">{datetime.split("T")[0]}</div>
            </div>
            <div className="px-4 py-2 text-white flex">{text}</div>
        </Elem>
    )
}
