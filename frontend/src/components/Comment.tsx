import { Comment as CommentType } from "../schema"
import ProfileLink from "./ProfileLink"
type CommentProps = {
    comment: CommentType
}

export const Comment = ({comment}: CommentProps) => {
    return (
    <li className= "p-4 px-10 rounded-lg mb-4">
        <ProfileLink user={comment.username} className="font-bold text-[#e78fcb] hover:text-white">{comment.username}</ProfileLink>
        <p className="text-gray-300 mt-2">{comment.text}</p> 
    </li>
    )
}