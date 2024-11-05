import { useState } from "react";
import { UserMeta } from "../schema";

interface UserInfoDisplayProps {
    userinfo: UserMeta | null
    editable: boolean
    uiHandler: (ui: UserMeta) => Promise<void>;
}

interface EditorProps {
    def: UserMeta | null
    uiHandler: (ui: Partial<UserMeta>) => void;
}

interface DisplayProps {
    userinfo: UserMeta | null
}

const Editor = ({def, uiHandler}: EditorProps) => {
    const [firstName, setFirstName] = useState(def?.first_name || "")
    const [lastName, setLastName] = useState(def?.last_name || "")
    const [dateOfBirth, setDateOfBirth] = useState(def?.date_of_birth || "")

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const composed = {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            profile_picture: null,
        }

        uiHandler(composed)
    }
    return (
        <form className="flex p-5"onSubmit={onSubmit}>
            <span>First Name<input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}></input></span>
            <span>Last Name<input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}></input></span>
            <span>Date of Birth<input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}></input></span>
            <button className="bg-[#e78fcb]"type="submit">Save</button>
        </form>
    )
}

const Display = ({ userinfo }: DisplayProps) => {
    if (!userinfo) {
        return <p>Loading...</p>
    }
    return (
        <div className="flex space-x-4">
            <p>{userinfo.first_name}</p>
            <p>{userinfo.last_name}</p>
            <p>{userinfo.date_of_birth}</p>
        </div>
    )
}

const UserInfoDisplay = ({userinfo, editable, uiHandler}: UserInfoDisplayProps) => {

    const handleSubmit = (meta: Partial<UserMeta>) => {
        const compose: UserMeta = {
            first_name: meta?.first_name || userinfo?.first_name || "",
            last_name: meta?.last_name || userinfo?.last_name || "",
            date_of_birth: meta?.date_of_birth || userinfo?.date_of_birth || "",
            profile_picture: null,
        }

        uiHandler(compose)
    }

    if (editable) {
        return <Editor def={userinfo} uiHandler={handleSubmit} />
    }

    return <Display userinfo={userinfo} />
}

export default UserInfoDisplay