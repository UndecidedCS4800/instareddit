import { useState } from "react"
import { Community, isError, User } from "../schema"
import { addAdmin } from "../remote"
import { useAuth } from "./auth"
import { useRevalidator } from "react-router-dom"

interface AdminPageProps {
    admins: User['username'][]
    returnHandler: () => void;
    community_id: Community['id']
}

const AdminPage = ({ community_id, admins, returnHandler }: AdminPageProps) => {
    const [username, setUsername] = useState("")
    const [description, setDescription] = useState("")
    const [modDescription, setModDescription] = useState("")
    const [targetModName, setTargetModName] = useState("")

    const auth = useAuth();
    const validator = useRevalidator()

    const handleAdd = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (auth) {
            const resp = await addAdmin(auth.token, community_id, username)
            if (!isError(resp)) {
                validator.revalidate()
            } else {
                console.error("server error:", resp)
            }
        }
    }

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault()
        if (auth) {
            const resp = await addAdmin(auth.token, community_id, username)
            if (!isError(resp)) {
                validator.revalidate()
            } else {
                console.error("server error:", resp)
            }
        }
    }

    const setModify = (e: React.MouseEvent, username: string) => {
        e.preventDefault()
        setTargetModName(username)
    }

    return (
        <div>
            <button onClick={() => returnHandler()}>Exit</button>
            {admins.map(admin => (
                <div>
                    {admin}
                    <button onClick={handleRemove}>-</button>
                    <button onClick={e => setModify(e, admin)}>modify</button>
                    {targetModName === admin && <input type="text" value={modDescription} onChange={e => setModDescription(e.target.value)} />}
                </div>
            ))}
            <input type="text" onChange={e => setUsername(e.target.value)} value={username}></input>
            <input type="text" onChange={e => setDescription(e.target.value)} value={description}></input>
            <div><button onClick={handleAdd}>+</button></div>
        </div>
    )
}
export default AdminPage