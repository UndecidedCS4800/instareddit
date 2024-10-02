import { FormEvent, useState } from "react"
import { useAuth } from "./auth"
import { JWTTokenResponse, Post } from "../schema"
// import { JWTTokenResponse } from "../schema"

// export const action = () => {

// }

export const CreatePost = () => {
    const [text, setText] = useState("")
    const auth = useAuth()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const a = auth as JWTTokenResponse
        const post: Post = {
            user: a.userid,
            text,
            image: null, // not implemented
        }
    }

    if (!auth) {
        return <div>Need to be logged in</div>
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Create Post</h1>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit">Submit</button>
        </form>
    )
}