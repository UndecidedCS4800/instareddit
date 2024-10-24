import { FormEvent, useState } from "react";
import { ChatMessage, Friend } from "../schema";
import socket from "../socket";
import { useAuth } from "./auth";
import { v4 } from 'uuid'

interface ChatWindowViewProps {
    user: Friend;
    history: ChatMessage[];
    pushHistory: (withId: number, msg: ChatMessage) => void;
}

const ChatWindowView = ({user, history, pushHistory}: ChatWindowViewProps) => {
    const [messageText, setMessageText] = useState<string>("")
    const auth = useAuth();

    if (!auth) {
        return <div>Not authenticated</div>
    }
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const message = {from: auth.id, to: user.id, message: messageText}
        socket.emit("message", {to: user, message: messageText})
        pushHistory(user.id, message)
        setMessageText("");

    }

    return (
        <div>
            <h2>{user.username}</h2>
            <div>
                {history && history.map(msg => <div key={v4()}>{msg.from}{'->'}{msg.to}<p>{msg.message}</p></div>)}
            </div>
            <form className="py-4 px-4 border-t border-[#514350] justify-center items-center gap-[15px] flex" onSubmit={handleSubmit}>
                <input className="w-full h-10 px-5 py-4 bg-[#514350] rounded-[10px] text-white" type="text" value={messageText} onChange={e => setMessageText(e.target.value)}placeholder="Enter a message" />
                <button className=" h-10 py-2.5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex" type="submit">Send</button>
            </form>
        </div>
    )

}

export default ChatWindowView
