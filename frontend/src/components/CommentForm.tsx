import { useState } from "react"
import { useParams, useRevalidator } from "react-router-dom"
import { postComment } from "../remote"
import { useAuth } from "./auth"
import { isError } from "../schema"

const CommentForm = () => {
    const [text, setText] = useState("")
    const auth = useAuth();

    const params = useParams()
    const revalidator = useRevalidator();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (auth && params.postid) {
            const req = await postComment(auth.token, text, Number(params.postid))
            if (isError(req)) {
                console.error(req)
            }
            revalidator.revalidate()
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <input type="text" onChange={e => setText(e.target.value)} placeholder="Add comment..." value={text}></input>
            <button type="submit">Add post</button>
        </form>
    )
}
export default CommentForm;