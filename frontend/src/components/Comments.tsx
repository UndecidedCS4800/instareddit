import { Comment } from "./Comment"
import { Comment as CommentType } from "../schema"
import CommentForm from "./CommentForm"

type CommentsProps = {
    comments: CommentType[]
}

export const Comments = ({comments}: CommentsProps) => {
    return (
        <>
            <CommentForm />
            <ul className="space-y-4">
                {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
            </ul>
            
        </>
    )
}