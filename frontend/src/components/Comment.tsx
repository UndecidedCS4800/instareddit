import { Comment as CommentType } from "../schema"
type CommentProps = {
    comment: CommentType
}

export const Comment = ({comment}: CommentProps) => {
    return <li>{comment.user}: {comment.text}</li>
}