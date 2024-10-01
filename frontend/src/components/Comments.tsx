import { Comment } from "./Comment"
import { Comment as CommentType } from "../schema"

type CommentsProps = {
    comments: CommentType[]
}

export const Comments = ({comments}: CommentsProps) => {
    return (
        <ul>
            {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
        </ul>
    )
}