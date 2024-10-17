import { Comment as CommentType } from "../schema"
type CommentProps = {
    comment: CommentType
}

export const Comment = ({comment}: CommentProps) => {
    return (
    <li className="bg-stone-700 p-4 rounded-lg mb-4">
        <span className="font-bold text-pink-400">{comment.username}</span>
        <p className="text-gray-300 mt-2">{comment.text}</p> 
    </li>
    )
}