import { useState } from "react"
import { createCommunity } from "../remote"
import { useAuth } from "./auth"
import { isError } from "../schema"
import { useNavigate } from "react-router-dom"

const CreateCommunity = () => {
    const [name, setName] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const auth = useAuth()
    const navigate = useNavigate()
    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault()

        if (auth) {
            const resp = await createCommunity(auth.token, name, description, auth.username)
            if (!isError(resp)) {
                navigate(`/community/${resp.id}`)
            } else {
                console.error("server error", resp)
            }
        }
    }
    return (
        <div>
            <label><input type="text" value={name} onChange={e => setName(e.target.value)}></input>Name</label>
            <label><input type="text" value={description} onChange={e => setDescription(e.target.value)}></input>Description</label>
            <button onClick={handleSubmit}>Create</button>
        </div>
    )
}

export default CreateCommunity