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
        <div className="flex-1 h-screen w-full bg-[#342c33] flex flex-col items-start gap-4 p-4">
            <label className="text-white text-2xl font-semibold py-3">Create Community</label>
            <label className="text-white">Name</label>
            <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className="w-full px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
            />
            
            <label className="text-white">Description</label>
            <input 
                type="text" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className="w-full px-4 py-2 rounded-lg bg-[#514350] text-white focus:outline-none"
            />
            
            <div 
                className="text-white h-10 py-2.5 px-5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex hover:text-white hover:bg-[#d07db0]"
                onClick={handleSubmit}
            >
                Create
            </div>

        </div>

    )
}

export default CreateCommunity