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
            setText("")
            revalidator.revalidate()
        }
    }

    return (
            <form className="py-4 px-4 border-t border-[#514350] justify-center items-center gap-[15px] flex" onSubmit={onSubmit}>
                <input className="w-full h-10 px-5 py-4 bg-[#514350] rounded-[10px] text-white focus:outline-none"
                type="text" onChange={e => setText(e.target.value)} placeholder="Add comment..." value={text}></input>
                <button className="h-10 py-2.5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex focus:outline-none hover:bg-[#d07db0]"
                type="submit">Reply</button>
            </form>
    )
}
export default CommentForm;