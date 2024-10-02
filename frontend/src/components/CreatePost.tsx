import { FormEvent, useState } from "react"
import { useAuth } from "./auth"
import { isError, JWTTokenResponse, PostRequest, ServerError } from "../schema"
import { useNavigate, useParams } from "react-router-dom"
import { createPost } from "../remote"
// import { JWTTokenResponse } from "../schema"

// export const action = () => {

// }

export const CreatePost = () => {
    const [text, setText] = useState("")
    const [srvError, setError] = useState<ServerError | null>(null)
    const auth = useAuth()
    const navigate = useNavigate()
    const { communityid } = useParams()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const a = auth as JWTTokenResponse
        const post: PostRequest = {
            text,
            community: Number(communityid)
        }
        const res = await createPost(a.token, post)
        console.log(res)
        if (isError(res)) {
            setError(res)
        } else {
            navigate(`../posts/${res.id}`, { replace: true })
        }
    }


    // fix me, should be handled better
    if (!auth) {
        return <div>Need to be logged in</div>
    }

    return (

        <>
        {srvError && <p>Error: {srvError.error}</p>}
        <form onSubmit={handleSubmit}>
            <h1>Create Post</h1>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
        </>
    )
}